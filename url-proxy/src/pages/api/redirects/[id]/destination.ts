import type { NextApiRequest, NextApiResponse } from "next";
import { RedirectionService } from "../../../../services/backend/redirection";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
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
