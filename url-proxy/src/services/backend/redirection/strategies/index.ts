import { REDIRECT_STRATEGIES } from "../../../../enum";
import { ClicksPerDestinationStrategy } from "./clicks-per-destination";
import { UniqueClicksPerDestinationStrategy } from "./unique-clicks-per-destination";

export const STRATEGIES = {
  [REDIRECT_STRATEGIES.clicksPerDestination.id]:
    new ClicksPerDestinationStrategy(),
  [REDIRECT_STRATEGIES.uniqueClicksPerDestination.id]:
    new UniqueClicksPerDestinationStrategy(),
};
