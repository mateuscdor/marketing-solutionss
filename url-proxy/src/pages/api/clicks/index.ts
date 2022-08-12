import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import dbConnect from "../../../services/mongoose";
import { ClickModel, IClickSchema } from "../../../db/mongoose/models";
import { MongoId } from "../../../db/mongoose/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const redirects = await ClickModel.find({
        owner: query.owner,
      }).lean();

      const data = {};
      res.status(200).json(data);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
