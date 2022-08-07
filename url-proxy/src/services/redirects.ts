import { Destination } from "../entities/Destination";
import { Redirect } from "../entities/Redirect";
import { api } from "./base";

export class RedirectsService {
  path = "/redirects";

  async getMany(): Promise<{
    results: Redirect[];
  }> {
    const { data } = await api.get(this.path);

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

  async getDestination(redirectId: string): Promise<Destination> {
    return await api
      .get(`${this.path}/${redirectId}/destination`)
      .then(({ data }) => data.destination);
  }
}
