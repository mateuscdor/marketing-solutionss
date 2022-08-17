import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import mongoose from "mongoose";
import { Destination } from "../../../entities/Destination";
import dbConnect from "../../../services/mongoose";
import {
  DestinationModel,
  IDestinationSchema,
  RedirectionModel,
} from "../../../db/mongoose/models";
import { MongoId } from "../../../db/mongoose/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const limit = Number(query.limit || 10);
      const skip = Number(query.skip || 0);
      const filters = {
        owner: query.owner,
        redirect: query.redirectId,
      };
      const destinations = await DestinationModel.find(filters, null, {
        sort: {
          order: 1,
        },
        limit,
        skip,
      })
        .populate("redirect")
        .lean();
      const total = await DestinationModel.countDocuments(filters);
      res.status(200).json({
        pagination: {
          limit,
          skip,
          total,
        },
        results: destinations.map((destination) => {
          const destinationWithId =
            MongoId.toId<IDestinationSchema>(destination);

          return {
            ...destinationWithId,
            redirect:
              destinationWithId.redirect &&
              MongoId.toId(destinationWithId.redirect),
          } as Destination;
        }),
      });
      break;
    case "POST":
      const _id = new mongoose.Types.ObjectId();
      const { redirect, ...destination } = body;

      const data = {
        ...destination,
        _id,
        redirect: MongoId.stringToObjectId(redirect),
      };

      const lastDestination = await DestinationModel.findOne(
        {
          redirect,
        },
        null,
        {
          sort: {
            order: -1,
          },
        }
      ).lean();

      await RedirectionModel.updateOne(
        {
          _id: redirect,
        },
        {
          $$push: {
            destinations: _id,
          },
        }
      );

      const order = (lastDestination?.order || 0) + 1;

      const createData = {
        ...data,
        order,
      };
      console.log({
        lastDestination,
        order,
        createData,
      });
      const createdDestinationModel = await (
        await DestinationModel.create(createData)
      ).toJSON();

      res.status(200).json(MongoId.toId(createdDestinationModel));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withSentry(handler);
