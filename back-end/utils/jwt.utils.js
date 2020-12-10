const jwt = require('jsonwebtoken')

//Unique key of the server that NO ONE SHOULD KNOW
const TOKEN_SECRET = "irRS}O&$)BOtuCIVOr)sbuR.-glL}O{c8d7WG^1A}d(4KFU77'VfGiu8EC+yq5N"
const REFRESH_TOKEN_SECRET = "]s@-you3@(hzPQv.n50I5(dm?T-Q,yw0(nRxm?ipl(c[1PyC1qmE'8UYboUzDsk"

module.exports ={
    generateUserToken: function(user){
        return jwt.sign({
            userId: user.username,
            avatar: user.avatar,
        },
        TOKEN_SECRET,
        {
            expiresIn: 86400
        })
    },
    generateUserRefreshToken: function(user){
        return jwt.sign({
            userId: user.username,
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: 86400
        })
    },
    verifyToken: function(authorization_token){
        try{
            const decodedToken = jwt.verify(authorization_token, TOKEN_SECRET)
            const userId = decodedToken.userId
            const avatar = decodedToken.avatar
            return {username: userId, avatar: avatar}
        } catch(err){
            return null
        }
    }
}