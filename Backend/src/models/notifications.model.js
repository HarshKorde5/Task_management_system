import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "Task",
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },

}, {timestamps: true});

export const Notification = mongoose.model("Notification", notificationSchema);