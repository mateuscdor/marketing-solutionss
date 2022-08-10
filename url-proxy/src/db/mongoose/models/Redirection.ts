import mongoose, { Model } from "mongoose";

export interface IRedirectionSchema {
  _id: mongoose.Types.ObjectId | any;
  destinations?: mongoose.Types.ObjectId[] | any[];
  strategy: string;
  maxClicksPerDestination?: number;
  owner: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export const RedirectionSchema = new mongoose.Schema<IRedirectionSchema>(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    destinations: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Destination",
      },
    ],
    strategy: String,
    maxClicksPerDestination: { type: Number, required: false },
    owner: String,
    name: String,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const RedirectionModel = (mongoose.models.Redirection ||
  mongoose.model<IRedirectionSchema>(
    "Redirection",
    RedirectionSchema
  )) as Model<IRedirectionSchema>;
