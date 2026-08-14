import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            businessName,
            category
        } = req.body;

        // check required fields
        if (!firstName || !lastName || !email || !password || !businessName || !category) {
            return res.status(400).json({
                message: "Please fill all required fields."
            });
        }

        //ensure password is atleast 8 x-ters
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be atleast 8 characters long."
            });
        }

        //2. check if the email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        //3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        //4. create a new user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            businessName,
            category

        });

        // 5. return a safe response
        res.status(201).json({
            message: "User's account has be successully created.",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                businessName: user.businessName,
                category: user.category
            }
        });
    }catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "An error occured while creating your account. please try later."
        });
    }
};