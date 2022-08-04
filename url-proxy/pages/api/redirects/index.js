import { redisClient } from "@/services/redis";
import { getAllRedirects } from "@/services/redirects";
import { v4 as uuid } from "uuid";

export default async (req, res) => {
	const { method } = req;

	switch (method) {
		case "GET":
			try {
				const redirects = await getAllRedirects();

				return res.status(200).json({
					success: true,
					data: redirects,
				});
			} catch (error) {
				console.error(error);
				return res.status(400).json({
					success: false,
				});
			}
		case "POST":
			try {
				const id = uuid();
				await redisClient.set(
					`redirect-${id}`,
					JSON.stringify({
						...req.body,
						id,
					})
				);

				const redirects = await getAllRedirects();

				return res.status(201).json({
					success: true,
					data: redirects,
				});
			} catch (error) {
				console.error(error);
				return res.status(400).json({
					success: false,
				});
			}
		default:
			res.setHeaders("Allow", ["GET", "POST"]);
			return res
				.status(405)
				.json({ success: false })
				.end(`Method ${method} Not Allowed`);
	}
};
