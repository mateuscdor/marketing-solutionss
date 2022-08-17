import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import format from "date-fns/format";
import parse from "date-fns/parse";

import dbConnect from "../../../../services/mongoose";
import { ClickModel, IClickSchema } from "../../../../db/mongoose/models";
import { identity, pickBy } from "lodash";

export type GraphicDataGroupTimeValue = {
  [moment: string]: {
    [destinationName: string]: number;
  };
};
export type GraphicDataGroupValue = {
  day: GraphicDataGroupTimeValue;
  day_hour: GraphicDataGroupTimeValue;
  day_hour_minute: GraphicDataGroupTimeValue;
};
export type GraphicData = {
  by_destination_name: GraphicDataGroupValue;
  by_click_type: GraphicDataGroupValue;
};
const getGraphicData = (clicks: IClickSchema[]) => {
  const timeGroupKeys = [
    {
      timeGroupKeyName: "day",
      timeGroupKeyValue: "MM-dd",
    },
    {
      timeGroupKeyName: "day_hour",
      timeGroupKeyValue: "MM-dd HH'h'",
    },
    {
      timeGroupKeyName: "day_hour_minute",
      timeGroupKeyValue: "MM-dd HH'h' m'm'",
    },
  ];

  const timeGroupKeysGrouppedByKey = timeGroupKeys.reduce(
    (acc, { timeGroupKeyName, timeGroupKeyValue }) => {
      return {
        ...acc,
        [timeGroupKeyName]: timeGroupKeyValue,
      };
    },
    {}
  ) as any;

  const subGroupKeys = [
    {
      subGroupKeyName: "by_destination_name",
      subGroupValueExtractor: (click: IClickSchema) =>
        click?.destination?.name || "deleted",
    },
    {
      subGroupKeyName: "by_click_type",
      subGroupValueExtractor: (click: IClickSchema) => click?.type,
    },
  ];
  const graphicData = clicks.reduce((acc, click) => {
    const newAcc: any = {
      ...acc,
    };

    timeGroupKeys.forEach(({ timeGroupKeyName, timeGroupKeyValue }) => {
      const formattedTime = format(
        new Date(click.createdAt as string),
        timeGroupKeyValue
      );

      subGroupKeys.forEach(({ subGroupKeyName, subGroupValueExtractor }) => {
        const subGroupValue = subGroupValueExtractor(click);

        if (newAcc[subGroupKeyName]?.[timeGroupKeyName]?.[formattedTime]) {
          if (
            newAcc[subGroupKeyName][timeGroupKeyName][formattedTime][
              subGroupValue
            ]
          ) {
            newAcc[subGroupKeyName][timeGroupKeyName][formattedTime][
              subGroupValue
            ] =
              newAcc[subGroupKeyName][timeGroupKeyName][formattedTime][
                subGroupValue
              ] + click.value;
          } else {
            newAcc[subGroupKeyName][timeGroupKeyName][formattedTime][
              subGroupValue
            ] = click.value;
          }
        } else {
          if (!newAcc[subGroupKeyName]) {
            newAcc[subGroupKeyName] = {
              [timeGroupKeyName]: {
                [formattedTime]: {
                  [subGroupValue]: click.value,
                },
              },
            };
          } else {
            if (!newAcc[subGroupKeyName][timeGroupKeyName]) {
              newAcc[subGroupKeyName][timeGroupKeyName] = {
                [formattedTime]: {
                  [subGroupValue]: click.value,
                },
              };
            } else {
              newAcc[subGroupKeyName][timeGroupKeyName][formattedTime] = {
                [subGroupValue]: click.value,
              };
            }
          }
        }
      });
    });

    return newAcc;
  }, {}) as GraphicData;

  const preparedGraphicData = Object.entries(graphicData).reduce(
    (acc, [subGroupKeyName, subGroupKeyValue]) => {
      const newSubGroupVaue = Object.entries(subGroupKeyValue).reduce(
        (acc2, [timeGroupKeyName, timeGroupKeyValue]) => {
          const newTimeGroupValue = Object.entries(timeGroupKeyValue)
            .sort(([keyA], [keyB]) => {
              const timeTemplate = timeGroupKeysGrouppedByKey[timeGroupKeyName];
              return (
                parse(keyA, timeTemplate, new Date()).getTime() -
                parse(keyB, timeTemplate, new Date()).getTime()
              );
            })
            .map(([keyName, keyValue]) => {
              const newValue = {
                name: keyName,
                ...keyValue,
              };

              return newValue;
            });

          const newAcc2 = {
            ...acc2,
            [timeGroupKeyName]: newTimeGroupValue,
          };
          return newAcc2;
        },
        {}
      );

      const newAcc = {
        ...acc,
        [subGroupKeyName]: newSubGroupVaue,
      };

      return newAcc;
    },
    {}
  );
  return {
    graphicData,
    preparedGraphicData,
  };
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const filters = pickBy(
        {
          owner: query.owner,
          redirect: query.redirect,
          destination: query.destination,
        },
        identity
      );

      const clicks = await ClickModel.find(filters)
        .populate("destination")
        .lean();

      const destinationNames = Array.from(
        new Set(
          clicks.map(({ destination }) => destination?.name).filter(identity)
        )
      );
      const graphicData = await getGraphicData(clicks);
      res.status(200).json({
        graphicData: graphicData.preparedGraphicData,
        destinationNames,
      });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
