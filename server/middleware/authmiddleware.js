import jwt from "jsonwebtoken";
import User from "..//models/User.js";

const protect = async (req, res, next) => {
    try {
        //1. Get the authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                messsage: "Not authorized. please login."
            });
        }

        //2. Extract the token from the header
        const token = authHeader.split(" ")[1];

        //3. Verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        //4. Find the user by ID
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "user no longer exists."
            });
        }

        //5. check account status
        if (user.status !== "active") {
            return res.status(403).json({
                message: "your account is unavailable"
            });
        }

        //6. attach user to request
        req.user = user;

        //7. continue
        next();

    } catch (error) {
        console.error("authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default protect;