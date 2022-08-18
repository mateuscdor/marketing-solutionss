import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { RedirectionService } from "../../../../services/backend/redirection";
import dbConnect from "../../../../services/mongoose";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { id, userIp },
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      const destination = await new RedirectionService().getDestination(
        id as string,
        {
          ip: userIp as string,
        }
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
};

export default withSentry(handler);
