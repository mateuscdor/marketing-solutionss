import mongoose, { Model } from "mongoose";

export interface IRedirectionSchema {
  _id: mongoose.Types.ObjectId | any;
  source: string;
  destinations?: mongoose.Types.ObjectId[] | any[];
  strategy: string;
  maxClicksPerDestination?: number;
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
});

export const RedirectionModel = (mongoose.models.Redirection ||
  mongoose.model<IRedirectionSchema>(
    "Redirection",
    RedirectionSchema
  )) as Model<IRedirectionSchema>;
