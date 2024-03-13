import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import generateTokenAndCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const signupUserCtrl = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] })
        if (user) {
            return res.status(400).json({ error: 'User already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        })
        await newUser.save()
        if (newUser) {
            generateTokenAndCookie(newUser._id, res)
            res.status(201).json({
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            })
        } else {
            res.status(400).json({ error: 'Invalid user data' })
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
        console.log('Error in signupUser', error.message)
    }
}

const loginUserCtrl = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ error: 'Invalid username' })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Invalid password'
            })
        }
        const token = generateTokenAndCookie(user._id, res);

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log('Error in loginUser', error.mesage)
    }
}
const logoutUserCtrl = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 1 })
        res.status(200).json({ message: 'User logged out successfully' })
    } catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in logout user', error.mesage)
    }
}

const followUnfollowUserCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if (id === req.user._id)
            return res.status(400).json({ error: 'You cannot follow/unfollow yourself' })
        if ((!userToModify || !currentUser))
            return res.status(400).json({ error: 'User not found' })
        const isFollowing = currentUser.following.includes(id)
        if (isFollowing) {
            //Unfollow
            // modify current user following ,modify followers of userToModify
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            res.status(200).json({ message: 'User unfollowed successfully' })
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            res.status(200).json({ message: 'User followed successfully' })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.mesage })
        console.log('Error in follow', error.mesage)
    }
}

const updateUserCtrl = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id;
    try {
        let user = await User.findById(userId)
        if (!user) { res.status(400).json({ error: 'User not found' }) }

        if (req.params.id !== userId.toString())
            return res.status(400).json({ error: 'you cannot update other user s profile' })


        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword;
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save()
        await Post.updateMany(
            { "replies.userId": userId },
            {
                $set: {
                    'replies.$[reply].username': user.username,
                    'replies.$[reply].userProfilePic': user.profilePic,

                }
            },
            {
                arrayFilters: [{ 'reply.userId': userId }]
            }
        )

        //password should be null in response 
        user.password = null;

        res.status(200).json({ message: 'Profile updated with successfully', user: user })


    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log('Error in update', error.message)
    }
}

const getUserProfile = async (req, res) => {
    const { query } = req.params;
    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select('-password').select('-updatedAt')
        }
        else {
            user = await User.findOne({ username: query }).select('-password').select('-updatedAt')
        }
        if (!user) return res.status(400).json({ error: 'User Not Found 55555' })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log('Error in GetUserProfile', error.message)
    }
}
export { signupUserCtrl, loginUserCtrl, logoutUserCtrl, followUnfollowUserCtrl, updateUserCtrl, getUserProfile }