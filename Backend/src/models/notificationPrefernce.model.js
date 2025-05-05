import mongoose, { mongo, Schema } from "mongoose";

const notificationPrefernces = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: Boolean,
        default: true,
    },
    inApp: { 
        type: Boolean,
        default: true,
    },
    muted: {
        type: [String],
        default: [],
    },
}, {timestamps: true});

export const NotificationPreferences = mongoose.model("NotificationPreferences", notificationPrefernces);
