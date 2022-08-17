import { GraphicDataResponse } from "../shared/types";
import { api } from "./base";

export type GetClickGraphics = {
  owner?: string;
  redirect?: string;
  destination?: number;
};

export type GetClickGraphicsResponse = {
  graphicData: GraphicDataResponse;
  destinationNames: string[];
};

export class ClicksService {
  path = "/clicks";

  async getGraphicData(
    params: GetClickGraphics
  ): Promise<GetClickGraphicsResponse> {
    const { data } = await api.get(`${this.path}/graphics`, {
      params,
    });

    return data;
  }
}
