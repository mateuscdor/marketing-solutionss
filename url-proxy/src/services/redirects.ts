import axiosRetry from "axios-retry";
import { Destination } from "../entities/Destination";
import { Redirect } from "../entities/Redirect";
import { ListManyResponse } from "../shared/types";
import { GetDestinationMetadata } from "./backend/redirection";
import { api } from "./base";

axiosRetry(api, { retries: 3 });

export type GetManyRedirects = {
  owner?: string;
  limit?: number;
  skip?: number;
  redirectGroup?: string;
};

export class RedirectsService {
  path = "/redirects";

  async getMany(params: GetManyRedirects): Promise<ListManyResponse<Redirect>> {
    const { data } = await api.get(this.path, {
      params,
    });

    return data;
  }
  async get(id: string): Promise<void> {
    await api.get(`${this.path}/${id}`);
  }
  async create(body: Redirect): Promise<void> {
    await api.post(this.path, body);
  }
  async update(id: string, body: Partial<Redirect>): Promise<void> {
    await api.put(`${this.path}/${id}`, body);
  }
  async delete(id: string): Promise<void> {
    await api.delete(`${this.path}/${id}`);
  }

  async getDestination(
    redirectId: string,
    userData: GetDestinationMetadata
  ): Promise<Destination> {
    return await api
      .get(`${this.path}/${redirectId}/destination`, {
        params: {
          ...userData,
        },
      })
      .then(({ data }) => data.destination);
  }

  getShareUrl(redirectId: string): string {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    return `${origin}/go?origin=${redirectId}`;
  }
}
