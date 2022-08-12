import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import format from "date-fns/format";
import dbConnect from "../../../../services/mongoose";
import { ClickModel, IClickSchema } from "../../../../db/mongoose/models";

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
  return clicks.reduce((acc, click) => {
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

            console.log(
              `[${timeGroupKeyName}][${subGroupKeyName}][${formattedTime}] Existent ${newAcc[subGroupKeyName][timeGroupKeyName][formattedTime][subGroupValue]} + ${click.value}`
            );
          } else {
            newAcc[subGroupKeyName][timeGroupKeyName][formattedTime][
              subGroupValue
            ] = click.value;

            console.log(
              `[${timeGroupKeyName}][${subGroupKeyName}][${formattedTime}] New Subgroup + ${click.value}`,
              newAcc
            );
          }
        } else {
          console.log(
            `[${timeGroupKeyName}][${subGroupKeyName}][${formattedTime}] New + ${click.value}`,
            newAcc
          );
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
  }, {});
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const clicks = await ClickModel.find({
        owner: query.owner,
      })
        .populate("destination")
        .lean();

      const graphicData = await getGraphicData(clicks);
      res.status(200).json({ graphicData });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
