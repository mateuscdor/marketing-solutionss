import mongoose, { Model } from "mongoose";

export interface IRedirectionSchema {
  _id: mongoose.Types.ObjectId | any;
  source: string;
  destinations?: mongoose.Types.ObjectId[] | any[];
  strategy: string;
  maxClicksPerDestination?: number;
  owner: string;
  name: string;
}
export const RedirectionSchema = new mongoose.Schema<IRedirectionSchema>({
  _id: { type: mongoose.Types.ObjectId, auto: true },
  source: String,
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
});

export const RedirectionModel = (mongoose.models.Redirection ||
  mongoose.model<IRedirectionSchema>(
    "Redirection",
    RedirectionSchema
  )) as Model<IRedirectionSchema>;
