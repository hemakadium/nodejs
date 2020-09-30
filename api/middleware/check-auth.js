const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   const headertoken=req.headers.authorization;
    try {
        const token = headertoken.split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, 'screte');
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};