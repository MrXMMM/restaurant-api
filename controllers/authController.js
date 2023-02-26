const Employee = require('../models/Employee')
const Owner = require('../models/Owner')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password, status, table, phone } = req.body

    let accessToken
    let refreshToken

    if (status === "employee" ){

        if (!email || !password || !status) {
            return res.status(400).json({ message: 'All fields are required' })
        }

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
                    "status": "พนักงาน"
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        )

        refreshToken = jwt.sign(
            { 
                "data": `${foundEmployee.email}/employee`,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
     
    }

    if (status === "owner"){

        if (!email || !password || !status) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const foundOwner = await Owner.findOne({ email }).exec()

        if (!foundOwner) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const match = await bcrypt.compare(password, foundOwner.password)
        console.log('match')
        if (!match) return res.status(401).json({ message: 'Unauthorized' })

        accessToken = jwt.sign(
            {
            "UserInfo": {
                    "email": foundOwner .email,
                    "name": foundOwner.name,
                    "status": "เจ้าของ"
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        refreshToken = jwt.sign(
            { 
                "data": `${foundOwner.email}/owner`,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
    }

    if (status === "customer"){
        
        if (!table || !phone) return res.status(401).json({ message: 'ข้อมูลไม่ครบถ้วน' })

        accessToken = jwt.sign(
            {
            "UserInfo": {
                    "table": table,
                    "phone": phone,
                    "status": "ลูกค้า"
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        refreshToken = jwt.sign(
            { 
                "data": `${table}/customer/${phone}`,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
    }

     // Create secure cookie with refresh token 
     res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
        Secure
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

            let accessToken
            const data = decoded.data
            const data_split = data.split('/')

            if (data_split[1] === 'employee'){

                const foundEmployee = await Employee.findOne({ email: data_split[0] }).exec()

                if (foundEmployee){
                    accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "email": foundEmployee.email,
                                "position": foundEmployee.position,
                                "name": foundEmployee.name,
                                "phone": foundEmployee.phone,
                                "status": "พนักงาน"
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '15m' }
                    )
                } else return res.status(401).json({ message: 'Unauthorized' })
            } 

            else if (data_split[1] === 'owner'){

                const foundOwner = await Owner.findOne({ email: data_split[0] }).exec()
                if (foundOwner){
                    accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "email": foundOwner.email,
                                "name": foundOwner.name,
                                "status": "เจ้าของ",
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '15m' }
                    )
                } else return res.status(401).json({ message: 'Unauthorized' })
            }


            else if (data_split[1] === 'customer'){
                accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "table": data_split[0],
                            "phone": data_split[2],
                            "status": "ลูกค้า"
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )
            }

            else return res.status(401).json({ message: 'Unauthorized' })

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