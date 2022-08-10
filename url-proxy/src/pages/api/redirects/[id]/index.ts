import type { NextApiRequest, NextApiResponse } from "next";
import {
  RedirectionModel,
  DestinationModel,
} from "../../../../db/mongoose/models";
import { MongoId } from "../../../../db/mongoose/utils";

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
      const redirect = await RedirectionModel.findById(id).lean();

      if (!redirect) {
        return res.status(404).json({});
      }

      res.status(200).json(MongoId.toId(redirect));
      break;
    case "PUT":
      await RedirectionModel.updateOne(
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

      await RedirectionModel.deleteOne({
        _id,
      });

      await DestinationModel.deleteMany({
        redirect: _id,
      });

      res.status(200).json({ id });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
