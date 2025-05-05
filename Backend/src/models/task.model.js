import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
    todo: {
        type : String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const taskSchema = new Schema({
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
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    dueDate: {
        type: Date,
        required: true,
    },
    assignedTo: [
        {
        type: Schema.Types.ObjectId,
        ref: "User",
        }
    ],
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    attachments: [
        {
            type: String,
        }
    ],
    todoChecklist: [todoSchema],
    progress: {
        type: Number,
        default: 0,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },
    repeatDuration: {
        type: String,
        enum: ["no-repeat","daily","weekly","monthly"],
        default: "no-repeat",
    },
},{timestamps: true});

export const Task = mongoose.model("Task", taskSchema);