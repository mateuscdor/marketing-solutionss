import { DestinationModel } from "../../db/mongoose/models/Destination";
import { RedirectionModel } from "../../db/mongoose/models/Redirection";
import { MongoId } from "../../db/mongoose/utils";
import { Destination } from "../../entities/Destination";
import { Redirect } from "../../entities/Redirect";
import { REDIRECT_STRATEGIES } from "../../enum";
import { redisClient } from "../redis";

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
  async getDestination(redirectId: string): Promise<Destination | null> {
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

    return null;
  }
}
