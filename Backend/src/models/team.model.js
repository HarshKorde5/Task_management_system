import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "manager"],
        required: true,
    }
});

const teamSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    roles: [roleSchema],
},{timestamps: true});

export const Team = mongoose.model("Team", teamSchema); 