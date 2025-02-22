import userModel from "../../database/model/user.model.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from "../../errorHandling/AppError.js"
import { sendEmail } from '../../utilts/sendEmail.js'
import { handleAsyncError } from '../../errorHandling/handelAsyncError.js'

export const signUp = handleAsyncError(async (req, res, next) => {
    let { name, email, confirmPassword, password, phone, adress, role, gender, age, location } = req.body;
    if (password !== confirmPassword) {
        throw new AppError("Passwords do not match", 400);
    }
    let exsistUser = await userModel.findOne({ email });
    if (exsistUser) {
        throw new AppError("User already exists", 400);
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let user = await userModel.create({ name, email, password: hashedPassword, phone, adress, role, gender, age, location });
    let token = jwt.sign({ id: user._id }, process.env.VERIFY_SIGNATURE);
    let confirmationLink = `http://${process.env.CLIENT_URL}/auth/confirm-email/${token}`;
    let html = `
<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <a href="www.google.com"  target="_blank" style="display: none;">www.google.com</a > 
                <h1>
                    <img width="100px" src="https://imgs.search.brave.com/sQKQlbEGmcJQ7Y3fwrRxzhodH-cHHOxvGE2-_FOYExc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM3/NDg3NjMxOC9waG90/by9jbG9zZS11cC1v/Zi1tZWNoYW5pYy1p/bi10aXJlLXNlcnZp/Y2Utd29ya3Nob3At/Y2hhbmdpbmctdGly/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9MUpxTEhEcEZY/OVVrT0dramYxZV83/STFVcXY3U0szN1Js/X1c3NDdVYUZacz0"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
        
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <div> 
                <a href="${confirmationLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>
    `;
    await sendEmail(user.email, html);
    return res.status(201).json({ message: "User registered. Please check your email to confirm your account." });
});

export const confirmEmail = async (req, res, next) => {
    let { token } = req.params;
    let decoded = jwt.verify(token, process.env.VERIFY_SIGNATURE);
    if (!decoded) {
        throw new AppError("Invalid token", 400);
    }
    let user = await userModel.findById(decoded.id);
    if (!user) {
        throw new AppError("User not found", 400);
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: "Email verified successfully" });
};

export const login = handleAsyncError(async (req, res, next) => {
    let { email, phone, identifier, password } = req.body;
    let user = await userModel.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    });
    if (!user) {
        throw new AppError("User not found", 400);
    }
    if (!user.isVerified) {
        throw new AppError("Email not verified", 400);
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    let signature = '';
    if (user.role === 'Admin') {
        signature = process.env.ADMIN_SIGNATURE;
    } else if (user.role === 'Agent') {
        signature = process.env.AGENT_SIGNATURE;
    } else if (user.role === 'Maintenance_Center') {
        signature = process.env.MC_SIGNATURE;
    } else if (user.role === 'User') {
        signature = process.env.USER_SIGNATURE;
    }
    let token = jwt.sign({ id: user._id }, signature);
    return res.status(200).json({ message: "Login successful", token });
});

export const sendOTP = handleAsyncError(async (req, res, next) => {
    let { email } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 400);
    }
    let otp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
    console.log(otp);
    user.otp = otp;
    await user.save();
    let html = `
        <html>
        <body>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align: center; width: 100%;">
        <tr>
        <td style="background-color: #88BDBF; height: 100px; font-size: 50px; color: #fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top: 25px; color: #630E2B;">Reset Password</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding: 0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <div>
        <h2 style="margin: 10px 0px 30px 0px; border-radius: 4px; padding: 10px 20px; border: 0; color: #fff; background-color: #630E2B;">${otp}</h2>
        </div>
        </td>
        </tr>
        </table>
        </body>
        </html> 
    `;
    await sendEmail(user.email, html);
    return res.status(200).json({ message: "Email sent successfully" });
});

export const resetPassword = handleAsyncError(async (req, res, next) => {
    let { email, otp, newPassword } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 400);
    }
    if (user.otp !== otp) {
        throw new AppError("Invalid OTP", 400);
    }
    let hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
});