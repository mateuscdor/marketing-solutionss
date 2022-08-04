export type Redirect = {
  id?: string;
  source: string;
  destinations: {
    url: string;
  }[];
};
