import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import mongoose from "mongoose";
import { Redirect } from "../../../entities/Redirect";
import dbConnect from "../../../services/mongoose";
import {
  RedirectionModel,
  IRedirectionSchema,
  DestinationModel,
  IDestinationSchema,
} from "../../../db/mongoose/models";
import { MongoId } from "../../../db/mongoose/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const limit = Number(query.limit || 10);
      const skip = Number(query.skip || 0);

      const filters = {
        owner: query.owner,
      };
      const redirects = await RedirectionModel.find(filters, null, {
        limit,
        skip,
      })
        .populate("destinations")
        .lean();

      const total = await RedirectionModel.countDocuments(filters);

      console.debug({
        redirects,
        total,
      });
      res.status(200).json({
        pagination: {
          limit,
          skip,
          total,
        },
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
        destinations.map((destination: any, order: number) => ({
          ...destination,
          redirect: _id,
          owner,
          order,
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
};

export default withSentry(handler);
