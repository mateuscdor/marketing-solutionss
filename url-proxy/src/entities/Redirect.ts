import { Destination } from "./Destination";

export type Redirect = {
  id?: string;
  name: string;
  destinations?: Destination[];
  strategy: string;
  maxClicksPerDestination?: number;
  owner: string;
  createdAt?: string;
  updatedAt?: string;
};
