import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import omit from "lodash/omit";
import {
  DestinationModel,
  RedirectionModel,
} from "../../../../db/mongoose/models";
import { MongoId } from "../../../../db/mongoose/utils";
import dbConnect from "../../../../services/mongoose";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    body,
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      const redirect = await DestinationModel.findById(id).lean();

      if (!redirect) {
        return res.status(404).json({});
      }

      res.status(200).json(MongoId.toId(redirect));
      break;
    case "PUT":
      const changes = omit(body, "redirect");

      await DestinationModel.updateOne(
        {
          _id: id,
        },
        {
          $set: changes,
        }
      );

      res.status(200).json({ id });
      break;
    case "DELETE":
      const _id = MongoId.stringToObjectId(id as string);

      const entity = await DestinationModel.findById(id)
        .populate("redirect")
        .lean();

      if (!entity) {
        return res.status(404).json({});
      }

      await DestinationModel.deleteOne({
        _id,
      });

      await RedirectionModel.updateOne(
        {
          _id: entity.redirect._id,
        },
        {
          $pull: {
            destinations: entity._id,
          },
        }
      );

      res.status(200).json({ id });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
