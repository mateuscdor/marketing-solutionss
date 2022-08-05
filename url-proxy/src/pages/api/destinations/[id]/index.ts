import type { NextApiRequest, NextApiResponse } from "next";
import omit from "lodash/omit";
import { DestinationModel } from "../../../../db/mongoose/models/Destination";
import { MongoId } from "../../../../db/mongoose/utils";
import { RedirectionModel } from "../../../../db/mongoose/models/Redirection";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    body,
    method,
  } = req;

  switch (method) {
    case "GET":
      const redirect = await DestinationModel.findById(id).lean();

      if (!redirect) {
        return res.status(404).json({});
      }

      res.status(200).json(MongoId.toId(redirect));
      break;
    case "PUT":
      await DestinationModel.updateOne(
        {
          id,
        },
        {
          $set: omit(body, "redirect"),
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
}
