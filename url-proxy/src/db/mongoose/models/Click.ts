import mongoose, { Model } from "mongoose";
import { ClickType } from "../../../entities/Click";

export interface IClickSchema {
  _id: mongoose.Types.ObjectId | any;
  userIp: string;
  redirect?: any;
  redirectGroup?: any;
  destination?: any;
  type: ClickType;
  value: number;
  createdAt?: string;
  updatedAt?: string;
}

export const ClickSchema = new mongoose.Schema<IClickSchema>(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    userIp: String,
    value: {
      type: Number,
      default: 0,
    },
    redirect: {
      type: mongoose.Types.ObjectId,
      ref: "Redirection",
    },
    redirectGroup: {
      type: mongoose.Types.ObjectId,
      ref: "RedirectGroup",
    },
    destination: {
      type: mongoose.Types.ObjectId,
      ref: "Destination",
    },
    type: {
      type: String,
      enum: Object.values(ClickType),
      default: ClickType.simple,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const ClickModel = (mongoose.models.Click ||
  mongoose.model("Click", ClickSchema)) as Model<IClickSchema>;
