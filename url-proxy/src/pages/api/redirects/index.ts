import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { Redirect } from "../../../entities/Redirect";
import dbConnect from "../../../services/mongoose";
import {
  RedirectionModel,
  IRedirectionSchema,
} from "../../../db/mongoose/models/Redirection";
import {
  DestinationModel,
  IDestinationSchema,
} from "../../../db/mongoose/models/Destination";
import { MongoId } from "../../../db/mongoose/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const redirects = await RedirectionModel.find({
        owner: query.owner,
      })
        .populate("destinations")
        .lean();

      res.status(200).json({
        results: redirects.map((redirect) => {
          const redirectWithId = MongoId.toId<IRedirectionSchema>(redirect);

          return {
            ...redirectWithId,
            destinations: (redirectWithId.destinations || []).map(MongoId.toId),
          } as Redirect;
        }),
      });
      break;
    case "POST":
      const _id = new mongoose.Types.ObjectId();
      const { destinations = [], owner, ...redirect } = body;

      const createdDestinations = await DestinationModel.create<
        IDestinationSchema[]
      >(
        destinations.map((destination: any) => ({
          ...destination,
          redirect: _id,
          owner,
        }))
      );

      const data = {
        ...redirect,
        destinations: createdDestinations.map(({ _id }) => _id),
        _id,
        owner,
      };

      const createdRedirectionModel = await (
        await RedirectionModel.create(data)
      ).toJSON();

      res.status(200).json(MongoId.toId(createdRedirectionModel));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
