import mongoose, { Model } from "mongoose";

export interface IShortUrlSchema {
  _id: mongoose.Types.ObjectId | any;
  externalId: string;
  shortUrl: string;
  integration: string;
}
export const ShortUrlSchema = new mongoose.Schema<IShortUrlSchema>(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    externalId: String,
    shortUrl: String,
    integration: String,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const ShortUrlModel = (mongoose.models.ShortUrl ||
  mongoose.model<IShortUrlSchema>(
    "ShortUrl",
    ShortUrlSchema
  )) as Model<IShortUrlSchema>;
