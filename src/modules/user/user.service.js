import userModel from "../../database/model/user.model.js";
import { handleAsyncError } from "../../errorHandling/handelAsyncError.js";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../../utilts/sendEmail.js";
import { AppError } from "../../errorHandling/AppError.js";

export const getAllDeletedUser = handleAsyncError(async (req, res) => {
    let usersData = await userModel.find({ isDeleted: true }).populate('deletedBy', { name: 1, email: 1, phone: 1 });
    if (!usersData) {
        return res.json({ message: 'No deleted users found' });
    }
    res.json({ message: 'Deleted users retrieved successfully', usersData });

})
export const updateProfile = handleAsyncError(async (req, res) => {
    let { id } = req.user
    let { name, email, phone, gender, age, location } = req.body;
    let exsistUser = await userModel.findById(id);
    if (!exsistUser) {
        throw new AppError("User not found", 400);
    }
    if (exsistUser.isDeleted == true) {
        throw new AppError("User is already deleted", 400);
    }
    if (email) {
        if (email == exsistUser.email) {
            throw new AppError("Email already exists", 400);
        }
        let token = jwt.sign({ id: exsistUser._id }, process.env.VERIFY_SIGNATURE);
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
        sendEmail(email, html);
        exsistUser.isVerified = false
        exsistUser.email = email
    }
    name ? exsistUser.name = name : exsistUser.name
    phone ? exsistUser.phone = phone : exsistUser.phone
    gender ? exsistUser.gender = gender : exsistUser.gender
    age ? exsistUser.age = age : exsistUser.age
    location ? exsistUser.location = location : exsistUser.location
    let updatedUser = await exsistUser.save();
    res.json({ message: "User updated successfully", updatedUser })
})

export const deletedUser = handleAsyncError(async (req, res, next) => {
    let { userId } = req.params;
    let exsistUser = await userModel.findById(userId);
    if (!exsistUser) {
        throw new AppError("User not found", 400);
    }
    if (exsistUser.isDeleted == true) {
        throw new AppError("User is already deleted", 400);
    }
    exsistUser.isDeleted = true
    exsistUser.deletedBy = req.user.id
    exsistUser.deletedAt = Date.now()
    let deletedUser = await exsistUser.save();
    res.json({ message: "User deleted successfully", deletedUser })

})
export const getAllUsers = handleAsyncError(async (req, res, next) => {
    let users = await userModel.find({}).populate('deletedBy', { name: 1, email: 1, phone: 1 });
    res.json({ message: "All users", users })
})

export const restoreUser = handleAsyncError(async (req, res, next) => {
    let { userId } = req.params;
    let exsistUser = await userModel.findById(userId);
    if (!exsistUser) {
        throw new AppError("User not found", 400);
    }
    if (exsistUser.isDeleted == false) {
        throw new AppError("User is not deleted", 400);
    }
    exsistUser.isDeleted = false
    exsistUser.deletedBy = null
    exsistUser.deletedAt = null
    let deletedUser = await exsistUser.save();
    res.json({ message: "User restored successfully", deletedUser })
})

export const upgradeRole = handleAsyncError(async (req, res, next) => {
    let { userId } = req.params;
    let { role } = req.body
    let exsistUser = await userModel.findById(userId);
    if (!exsistUser) {
        throw new AppError("User not found", 400);
    }
    exsistUser.role = role
    let upgradeRole = await exsistUser.save();
    res.json({ message: "User upgraded successfully", upgradeRole })
})