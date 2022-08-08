import { Destination } from "./Destination";

export type Redirect = {
  id?: string;
  name: string;
  source: string;
  destinations?: Destination[];
  strategy: string;
  maxClicksPerDestination?: number;
  owner: string;
};
