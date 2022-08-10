import { Destination } from "../../../entities/Destination";
import { Redirect } from "../../../entities/Redirect";

export type GetDestination = {
  redirect: Redirect;
  ip: string;
};

export interface IDestinationStrategy {
  get(props: GetDestination): Promise<Destination | null>;
}
