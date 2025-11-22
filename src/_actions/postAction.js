"use server";

import connectDB from "../lib/mongodb";
import { UserModel } from "../lib/models/postModel";

export async function saveUserData(userData) {
    try {
        console.log("Saving User Data");
        await connectDB();
        
        // Validate required fields
        const { firstName, lastName, email, phone, postCode, houseNumber, wantToSellHouse, hadFinancialConsultation } = userData;
        
        if (!firstName || !lastName || !email || !phone || !postCode || !houseNumber) {
            return { error: "Missing required fields." };
        }
        
        if (wantToSellHouse === null || wantToSellHouse === undefined) {
            return { error: "Please specify if you want to sell your house." };
        }
        
        if (hadFinancialConsultation === null || hadFinancialConsultation === undefined) {
            return { error: "Please specify if you had a financial consultation." };
        }
        
        // Save to MongoDB
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            phone,
            postCode,
            houseNumber,
            addition: userData.addition || '',
            wantToSellHouse,
            hadFinancialConsultation,
        });
        
        console.log("User data saved:", newUser._id);
        
        // Convert ObjectId to string for client component compatibility
        return { success: true, userId: newUser._id.toString() };
    } catch (error) {
        console.error("Error saving user data:", error);
        return { error: "Failed to save user data." };
    }
}
