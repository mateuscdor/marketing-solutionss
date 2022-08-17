import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import {
  RedirectGroupModel,
  RedirectionModel,
} from "../../../../db/mongoose/models";
import { MongoId } from "../../../../db/mongoose/utils";
import { deleteRedirect } from "../../redirects/[id]";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    body,
    method,
  } = req;

  switch (method) {
    case "GET":
      const redirectGroup = await RedirectGroupModel.findById(id).lean();

      if (!redirectGroup) {
        return res.status(404).json({});
      }

      res.status(200).json(MongoId.toId(redirectGroup));
      break;
    case "PUT":
      await RedirectGroupModel.updateOne(
        {
          _id: id,
        },
        {
          $set: body,
        }
      );

      res.status(200).json({ id });
      break;
    case "DELETE":
      const _id = MongoId.stringToObjectId(id as string);

      await RedirectGroupModel.deleteOne({
        _id,
      });

      const redirects = await RedirectionModel.find({
        redirectGroup: _id,
      }).lean();

      await Promise.all(
        redirects.map(({ _id }) => deleteRedirect(String(_id)))
      );

      res.status(200).json({ id: id as string });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
