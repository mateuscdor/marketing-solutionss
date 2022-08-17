import { ClickModel } from "../../../../db/mongoose/models";
import {
  DestinationModel,
  IDestinationSchema,
} from "../../../../db/mongoose/models/Destination";
import { MongoId } from "../../../../db/mongoose/utils";
import { ClickType } from "../../../../entities/Click";
import { Destination } from "../../../../entities/Destination";
import { REDIRECT_STRATEGIES } from "../../../../enum";
import { GetDestination, IDestinationStrategy } from "../types";

export class ClicksPerDestinationStrategy implements IDestinationStrategy {
  public id = REDIRECT_STRATEGIES.clicksPerDestination.id;

  async registerClick(
    { redirect }: GetDestination,
    destination?: IDestinationSchema
  ): Promise<void> {
    console.debug(`==> registering click`);
    await ClickModel.create({
      redirect: MongoId.fromId(redirect as any),
      redirectGroup: redirect.redirectGroup,
      destination: destination?._id,
      type: ClickType.simple,
      value: 1,
    }).catch((err) => {
      console.error("Error during click register", err);
    });
  }

  async get(params: GetDestination): Promise<Destination | null> {
    const { redirect } = params;
    console.debug(`==> getting destination with strategy ${this.id}`);
    const filters = {
      redirect: redirect.id,
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
          order: 1,
        },
        new: true,
      }
    ).lean();

    console.debug(`==> destination`, destination);
    if (destination) await this.registerClick(params, destination);

    return destination;
  }
}
