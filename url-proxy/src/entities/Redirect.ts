import { Destination } from "./Destination";

export type Redirect = {
  id?: string;
  source: string;
  destinations: Destination[];
  strategy: string;
  maxClicksPerDestination?: number;
};
