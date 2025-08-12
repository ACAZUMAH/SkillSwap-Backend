import { Types } from "mongoose";


export interface ReviewDocument {
    _id: Types.ObjectId;
    reviewerId: string | Types.ObjectId;
    revieweeId: string | Types.ObjectId;
    ratings: number;
    comments?: string;
}

export interface ReviewData {
    reviewerId: string | Types.ObjectId;
    revieweeId: string | Types.ObjectId;
    ratings: number;
    comments?: string | null;
}

export interface ReviewFilters {
    reviewerId?: string | Types.ObjectId | null;
    revieweeId?: string | Types.ObjectId | null;
    ratings?: number | null;
    page?: number | null;
    limit?: number | null;
    sortBy?: string | null;
    sortOrder?: string | null;
}