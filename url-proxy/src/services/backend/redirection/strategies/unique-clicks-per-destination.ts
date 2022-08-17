import { ClickModel } from "../../../../db/mongoose/models";
import {
  DestinationModel,
  IDestinationSchema,
} from "../../../../db/mongoose/models/Destination";
import { MongoId } from "../../../../db/mongoose/utils";
import { ClickType } from "../../../../entities/Click";
import { Destination } from "../../../../entities/Destination";
import { REDIRECT_STRATEGIES } from "../../../../enum";
import { redisClient } from "../../../redis";
import { GetDestination, IDestinationStrategy } from "../types";

export class UniqueClicksPerDestinationStrategy
  implements IDestinationStrategy
{
  public id = REDIRECT_STRATEGIES.uniqueClicksPerDestination.id;

  async registerClick(
    { redirect, ip }: GetDestination,
    isNew: boolean,
    destination?: IDestinationSchema
  ): Promise<void> {
    console.debug(`==> registering click`);
    await ClickModel.create({
      redirect: MongoId.fromId(redirect as any),
      redirectGroup: redirect.redirectGroup,
      destination: destination?._id,
      type: ClickType.unique,
      userIp: ip,
      value: isNew === true ? 1 : 0,
    }).catch((err) => {
      console.error("Error during click register", err);
    });
  }
  async get(params: GetDestination): Promise<Destination | null> {
    const { redirect, ip } = params;
    console.debug(`==> getting destination with strategy ${this.id}`);
    const userCacheKey = `${redirect.id}-${ip}`;
    const cachedUser = await redisClient.get(userCacheKey);

    const filters = {
      redirect: redirect.id,
      clicks: {
        $lt: redirect.maxClicksPerDestination,
      },
    };

    if (cachedUser) {
      const { destination: cachedDestination } = JSON.parse(cachedUser);

      if (cachedDestination) {
        await this.registerClick(params, false, cachedDestination);
        return cachedDestination;
      }

      const destination = await DestinationModel.findOne(filters, null, {
        sort: {
          clicks: -1,
          order: 1,
        },
        new: true,
      }).lean();

      if (destination) await this.registerClick(params, false, destination);

      return destination;
    }
    const destination = await DestinationModel.findOneAndUpdate(
      filters,
      {
        $inc: { clicks: 1 },
      },
      {
        sort: {
          clicks: -1,
          order: 1,
        },
        new: true,
      }
    ).lean();

    if (destination) await this.registerClick(params, true, destination);

    const ONE_WEEK_IN_SECONDS = 604800;
    const cacheValue = JSON.stringify({ ip, destination });
    await redisClient.set(userCacheKey, cacheValue, "EX", ONE_WEEK_IN_SECONDS);

    console.debug(`==> caching value at key ${userCacheKey}`, cacheValue);
    return destination;
  }
}
