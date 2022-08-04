import type { NextApiRequest, NextApiResponse } from "next";
import { redisClient } from "../../../services/redis";
import { Redirect } from "../../../entities/Redirect";

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
      const redirect = await redisClient.get(`redirect-${id}`);

      if (!redirect) {
        return res.status(404).json({});
      }
      // Get data from your database
      res.status(200).json(JSON.parse(redirect) as Redirect);
      break;
    case "PUT":
      const oldRedirect = await redisClient.get(`redirect-${id}`);

      if (!oldRedirect) {
        return res.status(404).json({});
      }
      const newRedirect = Object.assign(JSON.parse(oldRedirect), req.body);

      await redisClient.set(`redirect-${id}`, JSON.stringify(newRedirect));

      res.status(200).json({ id });
      break;
    case "DELETE":
      await redisClient.del(`redirect-${id}`);

      res.status(200).json({ id });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
