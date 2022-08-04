import { redisClient } from "@/services/redis";
export const getAllRedirects = async () => {
	const redirectKeys = await redisClient.keys("redirect-*");

	const redirects = await Promise.all(
		redirectKeys.map(async (key) => {
			const strValue = await redisClient.get(key);

			return JSON.parse(strValue);
		})
	);
	return redirects;
};
