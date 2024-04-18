import  express  from "express";
import {adduser, deleteuser, editUser, generateRefreshToken, getUser,  loginUser, registerUser, updateUserPassword} from "../controllers/userController.js"
import authenticationMidlleware from "../middleware/middleware.js";
const router=express.Router();


router.post("/register" ,registerUser)
router.post("/login" ,loginUser)
// router.get("/logout" ,logOut)
router.post("/update-password" ,updateUserPassword)
router.post("/refresh-token" ,generateRefreshToken)
router.post("/add-user" , authenticationMidlleware, adduser)
router.delete("/:userId" ,authenticationMidlleware, deleteuser)
router.put("/:userId" ,authenticationMidlleware, editUser)
router.get("/user" ,authenticationMidlleware, getUser)


export default router