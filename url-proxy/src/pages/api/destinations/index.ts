import type { NextApiRequest, NextApiResponse } from "next";
import { Destination } from "../../../entities/Destination";
import dbConnect from "../../../services/mongoose";
import {
  DestinationModel,
  IDestinationSchema,
} from "../../../db/mongoose/models";
import { MongoId } from "../../../db/mongoose/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const destinations = await DestinationModel.find(
        {
          owner: query.owner,
          redirect: query.redirectId,
        },
        null,
        {
          sort: {
            order: 1,
          },
        }
      )
        .populate("redirect")
        .lean();

      res.status(200).json({
        results: destinations.map((destination) => {
          const destinationWithId =
            MongoId.toId<IDestinationSchema>(destination);

          return {
            ...destinationWithId,
            redirect:
              destinationWithId.redirect &&
              MongoId.toId(destinationWithId.redirect),
          } as Destination;
        }),
      });
      break;
    case "POST":
      const { redirect, ...destination } = body;

      const data = {
        ...destination,
        redirect: MongoId.stringToObjectId(redirect),
      };

      const lastDestination = await DestinationModel.findOne(
        {
          redirect,
        },
        null,
        {
          sort: {
            order: -1,
          },
        }
      ).lean();

      const order = (lastDestination?.order || 0) + 1;

      const createData = {
        ...data,
        order,
      };
      console.log({
        lastDestination,
        order,
        createData,
      });
      const createdDestinationModel = await (
        await DestinationModel.create(createData)
      ).toJSON();

      res.status(200).json(MongoId.toId(createdDestinationModel));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
