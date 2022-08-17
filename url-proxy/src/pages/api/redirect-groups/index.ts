import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import mongoose from "mongoose";
import dbConnect from "../../../services/mongoose";
import { RedirectGroupModel } from "../../../db/mongoose/models";
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
      const redirectGroups = await RedirectGroupModel.find(filters, null, {
        limit,
        skip,
      }).lean();

      const total = await RedirectGroupModel.countDocuments(filters);

      res.status(200).json({
        pagination: {
          limit,
          skip,
          total,
        },
        results: redirectGroups.map(MongoId.toId),
      });
      break;
    case "POST":
      const _id = new mongoose.Types.ObjectId();

      const data = {
        ...body,
        _id,
      };
      const createdRedirectGroupModel = await (
        await RedirectGroupModel.create(data)
      ).toJSON();

      res.status(200).json(MongoId.toId(createdRedirectGroupModel));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
