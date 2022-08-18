import mongoose from "mongoose";

export class MongoId {
  static toId<
    Type extends {
      _id: any;
    }
  >(obj: Type): Omit<Type, "_id"> & { id: any } {
    const { _id, ...newObj } = obj;
    return {
      ...newObj,
      id: _id.toString(),
    };
  }

  static fromId<
    Type extends {
      id: any;
    }
  >(obj: Type): Omit<Type, "id"> & { _id: any } {
    const { id, ...newObj } = obj;
    return {
      ...newObj,
      _id: MongoId.stringToObjectId(id),
    };
  }

  static stringToObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id.toString());
  }
  static objectIdToString(_id: mongoose.Types.ObjectId): string {
    return _id.toString();
  }
  static canBeObjectId(id: any): boolean {
    try {
      new mongoose.Types.ObjectId(id.toString());
      return true;
    } catch {
      return false;
    }
  }
}
