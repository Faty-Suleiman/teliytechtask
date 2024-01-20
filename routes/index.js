const express = require("express");
const router = express.Router();
const { userLogin, register, assignRole, enableMFA, verifyMFA, createRole, deleteRole, getRoles, disenableMFA, updateRole } = require("../Controllers/index");
const {authorization}  = require("../middleware/authorisation");

router.post("/login", userLogin);
router.post("/registerUser", register);
router.put('/enableMFA', authorization, enableMFA);
 router.post('/verifyMFA', authorization, verifyMFA);
router.put('/disenableMFA', authorization, disenableMFA)
router.post('/createRole', authorization, createRole);
router.post("/assignRole", authorization, assignRole);
router.delete('/deleteRole', authorization, deleteRole);
router.get('/getRoles/:role_id?', getRoles);
router.post('/updateRole', authorization, updateRole);




module.exports = router;
