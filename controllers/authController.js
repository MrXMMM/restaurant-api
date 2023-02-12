const Employee = require('../models/Employee')
const Owner = require('../models/Owner')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password, status } = req.body

    if (!email || !password || !status) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    let accessToken
    let refreshToken

    if (status === "employee" ){
        console.log('employee')
        const foundEmployee = await Employee.findOne({ email }).exec()

        if (!foundEmployee || !foundEmployee.active) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const match = await bcrypt.compare(password, foundEmployee.password)

        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        accessToken = jwt.sign(
            {
            "UserInfo": {
                    "email": foundEmployee.email,
                    "position": foundEmployee.position,
                    "name": foundEmployee.name,
                    "phone": foundEmployee.phone,
                    "status": "Employee"
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        refreshToken = jwt.sign(
            { "email": foundEmployee.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
     
    }

    else{
        console.log('owner')
        const foundOwner = await Owner.findOne({ email }).exec()

        if (!foundOwner) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const match = await bcrypt.compare(password, foundOwner.password)

        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        accessToken = jwt.sign(
            {
            "UserInfo": {
                    "email": foundOwner .email,
                    "name": foundOwner.name,
                    "status": "Owner"
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        refreshToken = jwt.sign(
            { "email": foundOwner.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
    }

     // Create secure cookie with refresh token 
     res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })
    // Send accessToken containing email and employee info
    res.json({ accessToken })
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundEmployee = await Employee.findOne({ email: decoded.email }).exec()

            if (!foundEmployee) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "EmployeeInfo": {
                        "email": foundEmployee.email,
                        "position": foundEmployee.position,
                        "name": foundEmployee.name,
                        "phone": foundEmployee.phone
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}