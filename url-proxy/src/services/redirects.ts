import { Destination } from "../entities/Destination";
import { Redirect } from "../entities/Redirect";
import { api } from "./base";

export type GetManyRedirects = {
  owner?: string;
};

export class RedirectsService {
  path = "/redirects";

  async getMany({ owner }: GetManyRedirects): Promise<{
    results: Redirect[];
  }> {
    const { data } = await api.get(this.path, {
      params: {
        owner,
      },
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
    userData: any
  ): Promise<Destination> {
    return await api
      .get(`${this.path}/${redirectId}/destination`, {
        params: {
          ...userData,
        },
      })
      .then(({ data }) => data.destination);
  }
}
