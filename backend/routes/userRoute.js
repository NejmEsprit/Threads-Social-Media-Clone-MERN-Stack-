import express from "express";
import { followUnfollowUserCtrl, getUserProfile, loginUserCtrl, logoutUserCtrl, signupUserCtrl, updateUserCtrl } from "../controllers/userCtrl.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router()

router.post('/signup', signupUserCtrl)
router.post('/login', loginUserCtrl)
router.post('/logout', logoutUserCtrl)
router.post('/follow/:id', protectRoute, followUnfollowUserCtrl)
router.put('/update/:id', protectRoute, updateUserCtrl)
router.get('/profile/:query', getUserProfile)


export default router;