import { Destination } from "./Destination";
import { ShortUrl } from "./ShortUrl";

export type Redirect = {
  id?: string;
  name: string;
  destinations?: Destination[];
  redirectGroup?: any;
  strategy: string;
  maxClicksPerDestination?: number;
  owner: string;
  shortUrl?: ShortUrl;
  createdAt?: string;
  updatedAt?: string;
};
