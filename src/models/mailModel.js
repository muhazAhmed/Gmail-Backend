const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const mailSchema = new mongoose.Schema(
  {
    mailbox: {
      inbox: [{ type: ObjectId, ref: "User" }],
      outbox: [{ type: ObjectId, ref: "User" }],
      drafts: [{ type: ObjectId, ref: "User" }],
      trash: [{ type: ObjectId, ref: "User" }],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Mail", mailSchema);
