import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";
const { Schema } = mongoose;

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
    index: true,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: thirtyDaysFromNow(),
  },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
