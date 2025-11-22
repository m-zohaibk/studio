import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    postCode: { type: String, required: true },
    houseNumber: { type: String, required: true },
    addition: { type: String, default: '' },
    wantToSellHouse: { type: Boolean, required: true },
    hadFinancialConsultation: { type: Boolean, required: true },
}, { timestamps: true, collection: "lazynest"});

export const UserModel = models.User || model("User", userSchema);