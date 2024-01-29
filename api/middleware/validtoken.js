const jwt = require('jsonwebtoken');
const validtoken = (req, res, next) => {
    let token = req.cookies.accesstoken;
    if (!token)
    {
        res.status(401);
        throw new Error("You are not Authorized");
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => { 
         if (err)
         {
            res.status(403);
            throw new Error("Forbidden");
        }
        req.user= decoded;
        next();
    });
    
};

module.exports = validtoken;