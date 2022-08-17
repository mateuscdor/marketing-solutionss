export enum ClickType {
  simple = "simple",
  unique = "unique",
}
export type Click = {
  id?: string;
  userIp: string;
  redirect?: any;
  redirectGroup?: any;
  owner: string;
  destination?: any;
  type: ClickType;
  value: number;
  createdAt?: string;
  updatedAt?: string;
};
