import { Schema } from "mongoose";

const reviewsSchema = new Schema({
    reviewer: { type: Schema.Types.ObjectId, required: true, ref: "users"},
    reviewee: { type: Schema.Types.ObjectId, required: true, ref: "users"},
    ratings: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String, maxLength: 500 }
}, {
    timestamps: true 
})