import Redis from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL as string);

export const getKeyValuesByPattern = async (pattern: string) => {
  const redirectKeys = await redisClient.keys(pattern);

  const redirects = await Promise.all(
    redirectKeys.map(async (key) => {
      const strValue = await redisClient.get(key);

      return {
        key,
        value: JSON.parse(strValue as string),
      };
    })
  );

  return redirects;
};
