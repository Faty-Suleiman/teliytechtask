const UserModel = require('../models/userModel');
const RoleModel = require('../models/roleModel');
const OtpModel = require('../models/otpModel');
const AssignModel = require('../models/assignModel')
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const {validateLoger, validateRegister, validateRole} = require("../Validations/index");
const { Op } = require("sequelize");
const {
  hashPassword,
  generateOtp,
  comparePassword,
  verifyTOTPToken,
  generateTOTPToken
} = require("../utils/helpers");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')


const register = async(req, res)=>{
  //create user
  const { error } = validateRegister(req.body);
  if (error !== undefined) {
    res.status(400).json({
      status: false,
      message: error.details[0].message || "bad request",
    });
    return;
  }
      const { name, surname, nickname, phone, email, password, is_admin } = req.body
      try{
       // check if user exist
      const checkIfUserExist = await UserModel.findAll({
        attributes: ["email", "phone"],
        where: {
          [Op.and]: [{ email: email }, { phone: phone }],
        },
      });
    
      if(checkIfUserExist.length > 0) {
        console.log(checkIfUserExist)
          res.status(400).json({
              status: false,
              message: userExists
          })
          return
      }
// hash the password
      const { hash, salt } = await hashPassword(password)
      
      const userID = uuidv4()
      // create a new user
      await UserModel.create({
          user_id: userID,
          name:name,
          surname: surname,
          nickname:nickname,
          is_admin:is_admin,
          email: email,
          phone: phone,
          password_hash: hash,
          password_salt : salt
      })
      // to generate otp for new user
      const _otp = generateOtp(6)
      const dataToInsert = {
          otp_id: uuidv4(),
          phone: phone,
          otp: _otp 
      }
      await OtpModel.create(dataToInsert)

      res.status(201).json({
          status: true,
          message: 'User has been registered'
      })

  }catch(error) {
    console.log(error)
      res.status(500).json({
          status: false,
          message: error.message ||  "Internal server error"
      })
  }
}

const userLogin = async (req, res) => {
//login user
 const { error } = validateLoger(req.body);
 if (error !== undefined) {
   res.status(400).json({
     status: true,
     message: error.details[0].message || "Bad request",
   });
   return;
 }
 // to destructure the email and password passed by user
const { email, password } = req.body;
try {
  // if not bounce the user back
  if (!email || !password) throw new Error("All fields are required");
  // check if user exist
  const checkIfUserExists = await UserModel.findOne({
    where: { email: email },
  });
  if (checkIfUserExists == null) throw new Error("Invalid phone or password");

  
  const dataPayload = {
    email: email,
    _id: uuidv4(),
  };
  console.log(' dataPayload ', dataPayload )
  // to compare the password passed by user
  const comparePassword = await bcrypt.compare(
    password,
    checkIfUserExists.password_hash
  );
  if (!comparePassword) throw new Error("Invalid phone or password");
  if (!checkIfUserExists)
    throw new Error("Account not verified");
  // generate token expiresin one day
  const token =  jwt.sign( dataPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    status: true,
    message: "User logged in successfully.",
    token: token,
  });
} catch (error) {
  console.log(error)
  res.status(400).json({
    status: false,
    message: error.message || "Internal server error",
  });
}
};
// Create a new role by admin
const createRole =async(req, res)=> {
  // Validate the new role
const {error }= validateRole(req.body)
if(error !==undefined){
  return res.status(400).json({
    status:false,
    message: error.details[0].message || 'bad request'
  });
}
const {email} = req.params
const {roleName, description} = req.body;
console.log(email)
  try{
// Check if the user making the request is an admin
    const admin = await UserModel.findOne({
      attributes: ["email", "is_admin"],
        where: {
          [Op.and]: [{ email: email }, { is_admin: true }],
        },
    })
    if(!admin) throw new Error('Unauthorized: Admin privileges/permission required')
    
  
  // Generate a unique role_id using uuidv4()
  const roleID = uuidv4();
   // Create the new role
  await RoleModel.create({
    role_id:roleID,
    roleName:roleName,
    description:description
  });

  res.status(201).json({
          status: true,
          message: 'Role created successfully'
      })

}catch (error) {
  console.log(error)
  res.status(400).json({
    status: false,
    message: error.message || 'internal service error'
  })
}
}
// Update a role by admin
  const updateRole = async(req, res)=>{
 
  try {
    const {email} = req.params;
    const {role_id} = req.body;
    if (!role_id) throw new Error('Role ID is required');
    // Check if the user making the request is an admin
    const admin = await UserModel.findOne({
      attributes: ["email", "is_admin"],
        where: {
          [Op.and]: [{ email: email }, { is_admin: true }],
        },
    })
    if(!admin) throw new Error('Unauthorized: Admin privileges/permission required')
  
  // Check if the role to be updated exists
    const role = await RoleModel.findOne({
      where: {role_id:role_id}
     });

    if(!role) throw new Error('Role not found');
 // Update the role based on the request body
    await RoleModel.update(req.body, {
      where: {
        role_id: role_id,
      },
    });
    res.status(200).json({
      status: true,
      message: "Role updated successfully",
  
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "internal service error",
    });
  }
};

// get all roles 
const getRoles = async (req, res) => {
  const {role_id} = req.query;
  let role;
  try { 
    if (role_id) {
      // Fetch a single role based on role_id
      role = await RoleModel.findOne({
        where: { role_id: role_id }
      });

    if(!role) {
      throw new Error('Role not found');
    }
    
  }else {
 // Fetch all roles if role_id is not provided
    const roles = await RoleModel.findAll();

    res.status(200).json({
      status: true,
      message: role_id ? 'Role fetched successfully' : 'All Roles fetched successfully',
      data: role_id ? role : roles

    });
  } 
  // Handle errors and respond with an appropriate error message
  }catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || 'Internal service error',
    });
   }
  
 
}


// Delete a  role by admin
const deleteRole = async (req, res) => {
 
  try {
    const { email } = req.params;
    const {role_id} = req.body;
    if (!role_id) throw new Error('Role ID is required')
// Check if the user making the request is an admin
  const admin = await UserModel.findOne({
   attributes: ["email", "is_admin"],
    where: {
      [Op.and]: [{ email: email }, { is_admin: true }],
    },
});
  if(!admin) throw new Error('Unauthorized: Admin privileges/permission required')
    const role = await RoleModel.destroy({
      where: {
        role_id: role_id,
      },
    });
    if (!role) throw new Error('Role does not exist')


    res.status(200).json({
      status: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message || "internal service error",
    });
  }
};



// Assign role to user by admin
const assignRole = async (req, res) => {
  const { email } = req.params;
  const { userEmail, roleName } = req.body;
 console.log('userEmail', userEmail)
  try {
    // Check if the admin has permission (is_admin) to create a role
    const admin = await UserModel.findOne({
      attributes: ['email', 'is_admin', 'user_id'],
      where: {
        [Op.and]: [{ email: email }, { is_admin: true }],
      },
    });

    if (!admin) {
      throw new Error('Unauthorized: Admin privileges/permission required');
    }

    // Check if the user with userEmail exists
    const user = await UserModel.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error('Invalid user');
    }

    // Check if the role with roleName exists
    const role = await RoleModel.findOne({
      where: { roleName: roleName },
    });

    if (!role) {
      throw new Error('Role not found');
    }
    const userID = user.dataValues.user_id
    const roleID = role.role_id;
    // Perform the role assignment
    await AssignModel.create({
      assignment_id: uuidv4(),
      roleName,
      user_id: userID,
      role_id: roleID
    });

    return res.status(200).json({
      status: true,
      message: 'Role assigned to user successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({
      status: false,
      message: error.message || 'Internal service error',
    });
  }
};

// Endpoint to enable MFA for a user
const enableMFA = async(req, res) => {
  const{user_id} = req.params
  console.log('user_id', user_id)
  try{
    const user = await UserModel.findOne({
      where: {
        user_id:user_id
      }
    });
    if(!user) throw new Error('User not found');
    console.log('user' , user)
      // Generate a secret key for TOTP
    const secret = speakeasy.generateSecret({length: 20})
    // Function to generate a TOTP token
   const generatedToken = generateTOTPToken(secret) 

    console.log('generatedToken', generatedToken) 
    //  await user.save();
    user.update({ mfa_secret: secret.base32, mfa_enabled: true });

    return  res.status(200).json({
      status: true,
      message: {secret: secret.otpauth_url }
      });

  }catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || 'internal service error'
    })
  }
}
// Endpoint to disable MFA for a user
const disenableMFA = async (req, res) => {
  try {
    const {user_id} = req.params;

    const user = await UserModel.findOne({
      where: {user_id:user_id}
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the secret key from the user model
    user.mfa_secret = undefined;
    await user.save();

   return res.status(200).json({ 
      status: true,
      message: 'MFA disabled successfully' });
  
    console.error(error);
  }catch (error) {
    res.status(400).json({
      status: false,
      message: error.message || 'internal service error'
    })
  }

}
// Endpoint to verify MFA for a user
  const verifyMFA = async(req, res)=> {
  const {token} = req.body
  const {user_id} = req.params
  try{
    // to check for user
  const getUser = await UserModel.findOne({
      where: {user_id: user_id}
    });
    console.log('getUser', getUser)
  // to extract the secret numbers from the datavalues
    const secret = getUser.dataValues.mfa_secret
    // verify user token 
    const verifyToken = verifyTOTPToken(secret, token)
    console.log('secret', secret);

  if(verifyToken){
  return  res.status(201).json({
      status: true,
      message: 'MFA verification successful'
    });
  } else {
  return  res.status(401).json({
      status: false,
      message: 'MFA verification failed'
    })
  }
}catch (error) {
  res.status(500).json({
    status: false,
    message: error.message || 'internal service error'
  });
}
}
module.exports = {
userLogin,
register,
createRole,
assignRole,
enableMFA,
verifyMFA,
disenableMFA,
updateRole,
deleteRole,
getRoles
};


