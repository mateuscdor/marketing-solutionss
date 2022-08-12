import { Destination } from "../entities/Destination";
import { ListManyResponse } from "../shared/types";
import { api } from "./base";

export type GetManyDestinations = {
  redirectId: string;
  owner?: string;
  limit?: number;
  skip?: number;
};
export class DestinationsService {
  path = "/destinations";

  async getMany({
    redirectId,
    owner,
    limit,
    skip,
  }: GetManyDestinations): Promise<ListManyResponse<Destination>> {
    const { data } = await api.get(this.path, {
      params: {
        redirectId,
        owner,
        limit,
        skip,
      },
    });

    return data;
  }
  async get(id: string): Promise<void> {
    await api.get(`${this.path}/${id}`);
  }
  async create(body: Destination): Promise<void> {
    await api.post(this.path, body);
  }
  async update(id: string, body: Partial<Destination>): Promise<void> {
    await api.put(`${this.path}/${id}`, body);
  }
  async delete(id: string): Promise<void> {
    await api.delete(`${this.path}/${id}`);
  }

  async resetClicks(id: string): Promise<void> {
    await api.put(`${this.path}/${id}`, {
      clicks: 0,
    });
  }
}
