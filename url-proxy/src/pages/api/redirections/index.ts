// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { Redirect } from "../../../entities/Redirect";
import { redisClient, getKeyValuesByPattern } from "../../../services/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  switch (method) {
    case "GET":
      const redirectKeys = await getKeyValuesByPattern("redirect-*");

      const redirects = redirectKeys.map(({ value }) => value);

      res.status(200).json({
        results: redirects as Redirect[],
      });
      break;
    case "POST":
      const id = uuid();
      const entity = {
        ...body,
        id,
      };
      await redisClient.set(`redirect-${id}`, JSON.stringify(entity));

      res.status(200).json({ id });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
