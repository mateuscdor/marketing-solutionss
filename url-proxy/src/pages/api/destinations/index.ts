import type { NextApiRequest, NextApiResponse } from "next";
import { Destination } from "../../../entities/Destination";
import dbConnect from "../../../services/mongoose";
import {
  DestinationModel,
  IDestinationSchema,
} from "../../../db/mongoose/models/Destination";
import { MongoId } from "../../../db/mongoose/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const destinations = await DestinationModel.find()
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

      const createdDestinationModel = await (
        await DestinationModel.create(data)
      ).toJSON();

      res.status(200).json(MongoId.toId(createdDestinationModel));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
