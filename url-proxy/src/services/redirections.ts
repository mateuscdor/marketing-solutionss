import { Redirect } from "../entities/Redirect";
import { api } from "./base";

export class RedirectionsService {
  path = "/redirections";

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
  async update(id: string, body: Redirect): Promise<void> {
    await api.put(`${this.path}/${id}`, body);
  }
  async delete(id: string): Promise<void> {
    await api.delete(`${this.path}/${id}`);
  }
}
