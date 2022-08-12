import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import format from "date-fns/format";
import dbConnect from "../../../../services/mongoose";
import { ClickModel, IClickSchema } from "../../../../db/mongoose/models";

const getGraphicData = (clicks: IClickSchema[]) => {
  const groupKeys = [
    {
      groupKeyName: "day_hour",
      groupKeyValue: "MM-dd HH",
    },
    {
      groupKeyName: "day",
      groupKeyValue: "MM-dd",
    },
  ];

  const subGroupKeys = [
    {
      subGroupKeyName: "day",
      subGroupKeyValueExtractor: (click: IClickSchema) =>
        click?.destination?.name || "deleted",
    },
    {
      subGroupKeyName: "day 2",
      subGroupKeyValueExtractor: (click: IClickSchema) => click?.type,
    },
  ];
  return clicks.reduce((acc, click) => {
    const newAcc: any = {
      ...acc,
    };

    groupKeys.forEach(({ groupKeyName, groupKeyValue }) => {
      const groupKey = format(
        new Date(click.createdAt as string),
        groupKeyValue
      );

      subGroupKeys.forEach(({ subGroupKeyName, subGroupKeyValueExtractor }) => {
        const subGroupKey = subGroupKeyValueExtractor(click);

        if (newAcc[groupKey]) {
          if (newAcc[groupKey][subGroupKey]) {
            newAcc[groupKey][subGroupKey] =
              newAcc[groupKey][subGroupKey] + click.value;
          } else {
            newAcc[groupKey][subGroupKey] = click.value;
          }
        } else {
          newAcc[groupKey] = {
            [subGroupKey]: click.value,
          };
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
        .lean()
        .populate("destination");

      const graphicData = await getGraphicData(clicks);
      res.status(200).json({ graphicData, clicks });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
