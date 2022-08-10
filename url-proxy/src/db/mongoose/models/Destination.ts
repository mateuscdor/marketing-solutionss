import mongoose, { Model } from "mongoose";

export interface IDestinationSchema {
  _id: mongoose.Types.ObjectId | any;
  url: string;
  redirect?: mongoose.Types.ObjectId | any;
  clicks?: number;
  order?: number;
  owner: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DestinationSchema = new mongoose.Schema<IDestinationSchema>(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    url: String,
    clicks: { type: Number, default: 0 },
    redirect: {
      type: mongoose.Types.ObjectId,
      ref: "Redirection",
    },
    owner: String,
    name: String,
    order: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const DestinationModel = (mongoose.models.Destination ||
  mongoose.model(
    "Destination",
    DestinationSchema
  )) as Model<IDestinationSchema>;
