import { ShortUrl } from "../../../entities/ShortUrl";

export type ShortUrlResponse = Omit<ShortUrl, "id">;
export interface IShortUrlService {
  getShortUrl(url: string): Promise<ShortUrlResponse>;
  deleteShortUrl(shortUrl: ShortUrlResponse): Promise<void>;
}
