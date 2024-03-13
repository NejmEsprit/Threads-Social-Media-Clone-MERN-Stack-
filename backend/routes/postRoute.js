import express from 'express'
import { createPostCtrl, deletePostCtrl, getAllPostCtrl, getFeedPosts, getSinglePost, getUserPosts, likePostCtrl, replyToPost } from '../controllers/postCtrl.js';
import protectRoute from '../middlewares/protectRoute.js';
const router = express.Router()

router.get("/feed", protectRoute, getFeedPosts);
router.post('/create', protectRoute, createPostCtrl)
router.get('/getAllPost', protectRoute, getAllPostCtrl)
router.get('/:id', getSinglePost)
router.get('/user/:username', getUserPosts)
router.delete('/delete/:id', protectRoute, deletePostCtrl)
router.put('/like/:id', protectRoute, likePostCtrl)
router.put('/reply/:id', protectRoute, replyToPost)


export default router;