import { DestinationModel } from "../../../../db/mongoose/models/Destination";
import { Destination } from "../../../../entities/Destination";
import { REDIRECT_STRATEGIES } from "../../../../enum";
import { GetDestination, IDestinationStrategy } from "../types";

export class ClicksPerDestinationStrategy implements IDestinationStrategy {
  public id = REDIRECT_STRATEGIES.clicksPerDestination.id;

  async get({ redirect }: GetDestination): Promise<Destination | null> {
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

    console.debug(filters, destination);

    return destination;
  }
}
