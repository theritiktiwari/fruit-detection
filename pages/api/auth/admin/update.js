import User from "../../../../server/models/User";
import connectToDB from "../../../../server/middleware/db";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
    try {
        if (req.method === "PUT") {
            const token = req.body.token;
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if(data.data.role !== 'admin')
                return res.status(400).json({
                    type: "error",
                    message: "You are not authorized to perform this action"
                });

            if(req.body.mobile && req.body.mobile.toString().length !== 10)
                return res.status(400).json({
                    type: "error",
                    message: "Invalid mobile number"
                });

            if(req.body.pincode && req.body.pincode.toString().length !== 6)
                return res.status(400).json({
                    type: "error",
                    message: "Invalid pincode"
                });

            let existing = await User.findOne({ mobile: req.body.mobile });
            if (existing && existing.email !== req.body.email)
                return res.status(400).json({
                    type: "error",
                    message: "Mobile number already exists"
                });

            let user = await User.findOneAndUpdate({ _id: req.body._id }, {
                name: req.body.name,
                mobile: req.body.mobile,
                address: req.body.address,
                city: req.body.city,
                pincode: req.body.pincode,
                role: req.body.role,
                verified: req.body.verified
            });

            if (user) {
                res.status(200).json({
                    type: "success",
                    message: "Details Updated Successfully"
                });
            } else {
                res.status(400).json({
                    type: "error",
                    message: "No user found"
                });
            }

        } else {
            res.status(405).json({
                type: "error",
                message: "Method not allowed"
            });
        }
    } catch (error) {
        res.status(500).json({
            type: "error",
            message: "Internal Server Error"
        });
    }
}

export default connectToDB(handler);
