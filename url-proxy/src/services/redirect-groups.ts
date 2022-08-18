import axiosRetry from "axios-retry";
import { RedirectGroup } from "../entities/RedirectGroup";
import { ListManyResponse } from "../shared/types";
import { api } from "./base";

axiosRetry(api, { retries: 3 });

export type GetManyRedirectGroups = {
  owner?: string;
  limit?: number;
  skip?: number;
};

export class RedirectGroupsService {
  path = "/redirect-groups";

  async getMany(
    params: GetManyRedirectGroups
  ): Promise<ListManyResponse<RedirectGroup>> {
    const { data } = await api.get(this.path, {
      params,
    });

    return data;
  }
  async get(id: string): Promise<void> {
    await api.get(`${this.path}/${id}`);
  }
  async create(body: RedirectGroup): Promise<void> {
    await api.post(this.path, body);
  }
  async update(id: string, body: Partial<RedirectGroup>): Promise<void> {
    await api.put(`${this.path}/${id}`, body);
  }
  async delete(id: string): Promise<void> {
    await api.delete(`${this.path}/${id}`);
  }
}
