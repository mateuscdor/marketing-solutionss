// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { DestinationModel } from "../../../../db/mongoose/models/Destination";
import { MongoId } from "../../../../db/mongoose/utils";
import { Redirect } from "../../../../entities/Redirect";
import { RedirectionService } from "../../../../services/backend/redirection";
import { redisClient, getKeyValuesByPattern } from "../../../../services/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    body,
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      const destination = await new RedirectionService().getDestination(
        id as string
      );

      if (!destination) {
        return res.status(404).json({});
      }

      res.status(200).json({
        destination,
      });
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
