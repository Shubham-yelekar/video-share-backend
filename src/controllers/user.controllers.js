import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User } from "../models/users.models.js"
import {uploadOnCloudinary} from '../utils/cloudnary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req , res) =>{
  const {fullName, email, username, password} = req.body 

  if([fullName,email, username, password].some((field)=> field?.trim() === "")){
      throw new ApiError(400, "fullName is required")
    }

  const existedUser = await User.findOne({$or:[{username}, {email}]})
  if (existedUser) {
    throw new ApiError(409, "user with email.username already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverLocalPath = req.files?.coverImage[0]?.path

  if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar upload missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  
  if(!coverLocalPath) {
    throw new ApiError(400, "Cover upload missing")
  }

  const coverImage = await uploadOnCloudinary(coverLocalPath)

  User.create({
    fullName, avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()

  })

  const createdUser = await User.findById(username._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "registering user error")
  }

  return res.status(201).json(new ApiResponse(200, createdUser, "User registor succesfully "))
})

export {
  registerUser
}