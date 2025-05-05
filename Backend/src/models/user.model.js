import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    refreshToken : {
        type: String,
    },
    teams: [
        {
            type: Schema.Types.ObjectId,
            ref: "Team"
        }
    ],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
}, {timestamps : true});

export const User = mongoose.model("User", userSchema);

