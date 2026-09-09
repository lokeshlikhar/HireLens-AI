import mongoose from "mongoose";

const blacklistSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    expires: 0,
  },
});
const BlackListModel = mongoose.model("BlackList", blacklistSchema);
export default BlackListModel;
