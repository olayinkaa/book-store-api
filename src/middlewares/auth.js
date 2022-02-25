const jwt = require('jsonwebtoken');
const {SECRET} = require('../utils/configs.js')

const auth = (req, res, next) => {
  try {
    // const token = req.header('Authorization').replace("Bearer","")
    const authHeader = req.header('Authorization');
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1]
     // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
       message: 'No token, authorization denied',
       detail: "Please, generate an access token"
    })
  }
 
};

module.exports = auth;