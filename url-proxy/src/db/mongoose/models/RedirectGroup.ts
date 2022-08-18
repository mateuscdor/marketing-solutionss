import mongoose, { Model } from "mongoose";

export interface IRedirectGroupSchema {
  _id: mongoose.Types.ObjectId | any;
  name: string;
  owner: string;
  redirects?: mongoose.Types.ObjectId[] | any[];
  createdAt?: string;
  updatedAt?: string;
}
export const RedirectGroupSchema = new mongoose.Schema<IRedirectGroupSchema>(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    name: String,
    owner: String,
    redirects: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Redirection",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const RedirectGroupModel = (mongoose.models.RedirectGroup ||
  mongoose.model<IRedirectGroupSchema>(
    "RedirectGroup",
    RedirectGroupSchema
  )) as Model<IRedirectGroupSchema>;
