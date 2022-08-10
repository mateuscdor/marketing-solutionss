import { DestinationModel } from "../../../../db/mongoose/models/Destination";
import { Destination } from "../../../../entities/Destination";
import { REDIRECT_STRATEGIES } from "../../../../enum";
import { redisClient } from "../../../redis";
import { GetDestination, IDestinationStrategy } from "../types";

export class UniqueClicksPerDestinationStrategy
  implements IDestinationStrategy
{
  public id = REDIRECT_STRATEGIES.uniqueClicksPerDestination.id;

  async get({ redirect, ip }: GetDestination): Promise<Destination | null> {
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

      console.log({
        cachedDestination,
        cachedUser,
      });
      if (cachedDestination) return cachedDestination;

      const destination = await DestinationModel.findOne(filters, null, {
        sort: {
          clicks: -1,
          order: 1,
        },
        new: true,
      }).lean();

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

    const ONE_WEEK_IN_SECONDS = 604800;
    const cacheValue = JSON.stringify({ ip, destination });
    await redisClient.set(userCacheKey, cacheValue, "EX", ONE_WEEK_IN_SECONDS);

    console.debug(`==> caching value at key ${userCacheKey}`, cacheValue);
    return destination;
  }
}
