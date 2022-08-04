import { redisClient } from "@/services/redis";
export default async (req, res) => {
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		case "GET":
			try {
				const redirect = await redisClient.get(`redirect-${id}`);

				if (!redirect) throw new Error();

				return res.status(200).json({
					success: true,
					data: JSON.parse(redirect),
				});
			} catch (error) {
				return res.status(404).json({
					success: false,
				});
			}
		case "PUT":
			try {
				const oldRedirect = await redisClient.get(`redirect-${id}`);

				if (!oldRedirect) throw new Error();

				const newRedirect = Object.assign(JSON.parse(oldRedirect), req.body);

				await redisClient.set(`redirect-${id}`, JSON.stringify(newRedirect));

				return res.status(200).json({
					success: true,
					data: newRedirect,
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
				});
			}
		case "DELETE":
			try {
				await redisClient.del(`redirect-${id}`);

				return res.status(200).json({
					success: true,
					data: { id },
				});
			} catch (error) {
				return res.status(400).json({
					success: false,
				});
			}
		default:
			res.setHeaders("Allow", ["GET", "PUT", "DELETE"]);
			return res
				.status(405)
				.json({ success: false })
				.end(`Method ${method} Not Allowed`);
	}
};
