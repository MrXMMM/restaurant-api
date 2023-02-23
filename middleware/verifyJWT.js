const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            const status = decoded.UserInfo.status
            console.log(status)
            if (status === 'พนักงาน'){
                req.email = decoded.UserInfo.email
                req.position = decoded.UserInfo.position
                req.name = decoded.UserInfo.name
                req.phone = decoded.UserInfo.phone
                req.status = status
            }
            else if (status === 'เจ้าของ'){
                req.email = decoded.UserInfo.email
                req.name = decoded.UserInfo.name
                req.status = status
            }
            else if (status === 'ลูกค้า'){
                req.table = decoded.UserInfo.table
                req.phone = decoded.UserInfo.phone
                req.status = status
            }
            else return res.status(403).json({ message: 'Forbidden' })
            next()
        }
    )
}

module.exports = verifyJWT