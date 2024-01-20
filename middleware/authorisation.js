require("dotenv").config();
const UserModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "keep-secret-secure123#";

const authorization = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization', authorization)
  if (!authorization) {
    res.status(401).send({
      status: false,
      message: "Unauthorized Access1",
    });
  } else {
    const tokenSplit = authorization.split(" ");
    jwt.verify(tokenSplit[1], jwtSecret, async(err, decoded) => {
      console.log('decoded', decoded)
      if (err) {
        res.status(401).send({
          status: false,
          message: "Unauthorized Acesss",
        });
      }
      const email = decoded.email
      const getUser = await UserModel.findOne({
        where: {email:email}
        
      })

      const user_id = getUser.dataValues.user_id
      console.log('getUser', getUser)
      
      req.params.email = email
      req.params.user_id = user_id
      req.params.userData = decoded;
      next();
    });
  }
};


module.exports = {authorization};
