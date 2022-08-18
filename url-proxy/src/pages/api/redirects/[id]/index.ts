import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import {
  RedirectionModel,
  DestinationModel,
  RedirectGroupModel,
} from "../../../../db/mongoose/models";
import { MongoId } from "../../../../db/mongoose/utils";
import { ShortUrlService } from "../../../../services/backend/shorturl";
import dbConnect from "../../../../services/mongoose";

const shortUrlService = new ShortUrlService();

export const deleteRedirect = async (id: string) => {
  const redirectToDelete = await RedirectionModel.findById(id).lean();
  const _id = MongoId.stringToObjectId(id as string);

  await RedirectionModel.deleteOne({
    _id,
  });

  if (redirectToDelete?.shortUrl) {
    await shortUrlService.deleteShortUrl(redirectToDelete?.shortUrl);
  }

  await DestinationModel.deleteMany({
    redirect: _id,
  });

  await RedirectGroupModel.updateOne(
    {
      _id: (redirectToDelete as any)?.redirectGroup,
    },
    {
      $pull: {
        redirects: _id,
      },
    }
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    body,
    method,
  } = req;

  await dbConnect();
  
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
      await deleteRedirect(id as string);
      res.status(200).json({ id });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
