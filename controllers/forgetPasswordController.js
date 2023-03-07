const Employee = require('../models/Employee')
const Owner = require('../models/Owner')
const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken")
var nodemailer = require("nodemailer")
const bcrypt = require('bcrypt')

// @desc Create all Emp
// @route POST /forgetpassword
// @access Private

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    let oldUser
    let status = 'owner'
    try {
        oldUser = await Owner.findOne({ email })
        if (!oldUser) {
            oldUser = await Employee.findOne({ email })
            status = 'employee'
        }
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }
        const secret = process.env.EMAIL_TOKEN_SCRET
        const token = jwt.sign({ 
                            "UserInfo": {
                                    "email": oldUser.email,
                                    "id": oldUser._id,
                                    "status": status
                            }}, 
                            secret, { expiresIn: "5m", })
        const link = `http://localhost:3000/resetpassword/${oldUser._id}/${token}`
        var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', port: 587, secure: false,
            auth: {
                user: "restaurant.testing35@gmail.com",
                pass: "vzuhtevefyyvjqul",
            },
        })
        console.log(transporter)
  
        var mailOptions = {
            from: "restaurant.testing35@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `คลิ๊กลิงค์ เพื่อทำการเปลี่ยนรหัสผ่าน ${link}`,
        }
        new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    res.status(401).json({ message: error })
                  } else {
                    res.status(400).json({ message: "Email sent: " + info.response})
                  }
              })
        })
    } catch (error) { }
})

// @desc Create all Emp
// @route POST /resetpassword
// @access Private

const ResetPassword = asyncHandler(async (req, res) => {
    const { id, token, password } = req.body;
    
    const secret = process.env.EMAIL_TOKEN_SCRET

    jwt.verify(
        token,
        secret,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'ลิงค์หมดอายุ' })

            const status = decoded.UserInfo.status

            if (status === 'owner'){
                oldUser = await Owner.findById(id).exec()
            }
            if (status === 'employee'){
                oldUser = await Employee.findById(id).exec()
            }

            if (oldUser === '') {
                return res.json({ status: "User Not Exists!!" })
            }

            oldUser.password = await bcrypt.hash(password, 10)
            await oldUser.save()
            
            res.json({ message:  `password reset`})
        })
    )
})

module.exports = {
    forgetPassword,
    ResetPassword
}
