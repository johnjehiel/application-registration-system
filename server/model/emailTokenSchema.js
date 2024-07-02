const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailTokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "tempuser",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 },
});
const EmailToken = new mongoose.model("emailToken", emailTokenSchema);
module.exports = EmailToken;