import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        businessName: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: [
                "Pastry", 
                "restaurant", 
                "supermarket", 
                "boutique", 
                "electronics", 
                "pharmacy", 
                "salon", 
                "Hardware", 
                "printing"
            ],
            required: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
        },

        phoneNumber: {
            type: Number,
            default: null,
        },

        avatar: {
            type: String,
            default: null,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["active", "suspended"],
            default: "active",
        },


    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
export default User;