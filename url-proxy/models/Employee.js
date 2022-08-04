import mongoose from "mongoose";

const RedirectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required!"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required!"],
		trim: true,
	},
	address: {
		type: String,
		required: [true, "Address is required!"],
		trim: true,
	},
	phone: {
		type: String,
		required: [true, "Phone is required!"],
		trim: true,
	},
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Redirect ||
	mongoose.model("Redirect", RedirectSchema);
