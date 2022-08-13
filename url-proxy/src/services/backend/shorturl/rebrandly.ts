import axios from "axios";
import { ShortUrl } from "../../../entities/ShortUrl";
import { IShortUrlService, ShortUrlResponse } from "./interfaces";

export const rebrandlyApi = axios.create({
  baseURL: "https://api.rebrandly.com/",
  headers: {
    "Content-Type": "application/json",
    apikey: process.env.REBRANDLY_API_KEY as string,
    workspace: process.env.REBRANDLY_WORKSPACE as string,
  },
});

export class RebrandlyService implements IShortUrlService {
  async deleteShortUrl(shortUrl: ShortUrlResponse): Promise<void> {
    await rebrandlyApi
      .delete(`/v1/links/${shortUrl.externalId}`)
      .catch((err) => console.error(err));
  }
  async getShortUrl(url: string): Promise<ShortUrlResponse> {
    const {
      data: { id, shortUrl },
    } = await rebrandlyApi.post("/v1/links", {
      destination: url,
      domain: { fullName: "rebrand.ly" },
      //, slashtag: "A_NEW_SLASHTAG"
      //, title: "Rebrandly YouTube channel"
    });

    return {
      externalId: id,
      shortUrl,
      integration: "rebrandly",
    };
  }
}
