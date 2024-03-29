const Users = require('../models/userSchema');
const jwt =require ('jsonwebtoken')

const authenticate =  async (req, res, next) => {
    try {
        // get the cookies
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).send("No token")
        }else{
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            const rootUser = await Users.findOne({_id : verifyToken,_id, "tokens-token" : token});
            
            if(!rootUser){
                res.status(401),send("user not found")
            }else(
                res.status(200).send("Authorized user")
            )

        }
        next()
    } catch (error) {
        res.status(401).send("Error")

    }
}

module.exports = authenticate;