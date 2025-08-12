import { model, Schema } from "mongoose";
import { ReviewDocument } from "src/common/interfaces";

const reviewsSchema = new Schema<ReviewDocument>({
    reviewerId: { type: Schema.Types.ObjectId, required: true, ref: "users"},
    revieweeId: { type: Schema.Types.ObjectId, required: true, ref: "users"},
    ratings: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String, maxLength: 500 }
}, {
    timestamps: true 
})

export const reviewsModel = model<ReviewDocument>("reviews", reviewsSchema);

