import { DestinationModel } from "../../../db/mongoose/models/Destination";
import { RedirectionModel } from "../../../db/mongoose/models/Redirection";
import { MongoId } from "../../../db/mongoose/utils";
import { Destination } from "../../../entities/Destination";
import { Redirect } from "../../../entities/Redirect";
import { REDIRECT_STRATEGIES } from "../../../enum";
import { redisClient } from "../../redis";
import { STRATEGIES } from "./strategies";
import { GetDestination } from "./types";

export type GetDestinationMetadata = Omit<GetDestination, "redirect">;

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
    metadata: GetDestinationMetadata
  ): Promise<Destination | null> {
    const redirect = await this.getRedirect(redirectId);
    if (!redirect) return null;

    const strategy = STRATEGIES[redirect.strategy];

    let destination: Destination | null = null;

    if (strategy) {
      destination = await strategy.get({
        redirect,
        ...metadata,
      });
    }

    if (!destination) {
      destination = await DestinationModel.findOneAndUpdate(
        {
          redirect: redirect.id,
        },
        {
          $inc: { clicks: 1 },
        },
        {
          sort: {
            clicks: -1,
            order: -1,
          },
          new: true,
        }
      ).lean();
    }

    return destination;
  }
}
