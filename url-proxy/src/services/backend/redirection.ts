import { DestinationModel } from "../../db/mongoose/models/Destination";
import { RedirectionModel } from "../../db/mongoose/models/Redirection";
import { MongoId } from "../../db/mongoose/utils";
import { Destination } from "../../entities/Destination";
import { Redirect } from "../../entities/Redirect";
import { REDIRECT_STRATEGIES } from "../../enum";
import { redisClient } from "../redis";

export type UserData = {
  ip: string;
};
export class RedirectionService {
  async getRedirect(redirectId: string): Promise<Redirect | null> {
    const cacheKey = `cached-${redirectId}`;
    const cachedRedirect = await redisClient.get(cacheKey);

    if (cachedRedirect) {
      return JSON.parse(cachedRedirect);
    }
    const redirect = await RedirectionModel.findById(redirectId).lean();

    if (!redirect) return null;

    await redisClient.set(
      cacheKey,
      JSON.stringify(MongoId.toId(redirect)),
      "EX",
      10
    );

    return MongoId.toId(redirect) as Redirect;
  }
  async getDestination(
    redirectId: string,
    userData: UserData
  ): Promise<Destination | null> {
    const redirect = await this.getRedirect(redirectId);
    if (!redirect) return null;
    if (redirect.strategy === REDIRECT_STRATEGIES.clicksPerDestination.id) {
      const filters = {
        redirect: redirectId,
        clicks: {
          $lt: redirect.maxClicksPerDestination,
        },
      };

      const destination = await DestinationModel.findOneAndUpdate(
        filters,
        {
          $inc: { clicks: 1 },
        },
        {
          sort: {
            clicks: -1,
          },
          new: true,
        }
      ).lean();

      return destination;
    }

    if (
      redirect.strategy === REDIRECT_STRATEGIES.uniqueClicksPerDestination.id
    ) {
      const { ip } = userData;
      const userCacheKey = `${redirect.id}-${ip}`;
      const cachedUser = await redisClient.get(userCacheKey);

      const filters = {
        redirect: redirectId,
        clicks: {
          $lt: redirect.maxClicksPerDestination,
        },
      };

      if (cachedUser) {
        const destination = await DestinationModel.findOne(filters, null, {
          sort: {
            clicks: -1,
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
          },
          new: true,
        }
      ).lean();

      const ONE_WEEK_IN_SECONDS = 604800;
      await redisClient.set(
        userCacheKey,
        JSON.stringify(userData),
        "EX",
        ONE_WEEK_IN_SECONDS
      );

      return destination;
    }

    return null;
  }
}
