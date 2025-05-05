import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: [],
        required: true,
    },
    targetType: {
        type: String,
        enum: ["Task", "Team"],
        required: true,
    },
    targetId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },
    details: {
        type: Object,
        required: true,
    },
}, {timestamps: true});

export const Log = mongoose.model("Log", activityLogSchema);