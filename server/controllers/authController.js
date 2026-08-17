import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

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

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //1. vaalidate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide your email and password."
            });
        }

        //2. find the user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            })
        }

        //3. compare the password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        //4. check account status
        if (user.status !== "active") {
            return res.status(403).json({
                message: "your account is currently unavailable"
            });
        }

        //5. generate JWT
        const token = generateToken(user._id.toString());

        //6. send response
        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                businessName: user.businessName,
                category: user.category,
                phoneNumber: user.phoneNumber,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "An error occured while logging in."
        });
    }
};