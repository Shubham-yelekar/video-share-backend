import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User } from "../models/users.models.js"
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudnary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req , res) =>{
  const {fullname, email, username, password} = req.body 

  if([fullname,email, username, password].some((field)=> field?.trim() === "")){
      throw new ApiError(400, "fullname is required")
    }

  const existedUser = await User.findOne({$or:[{username}, {email}]})
  if (existedUser) {
    throw new ApiError(409, "user with email.username already exist")
  }
  console.warn(req.files);
  
  const avatarLocalPath = req.files?.avatar?.[0]?.path
  let avatar ;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("🚀 Avatar Uploaded", avatar);
    
  } catch (error){
    console.log("🔴 Failed to upload avatar", error);
    
    throw new ApiError(500, "🔴 Failed to upload avatar")
  }

   let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

 let coverImage 
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("🚀 Cover image Uploaded", coverImage); 
  } catch (error){
    console.log("🔴 Failed to upload cover image", error);
    throw new ApiError(500, "🔴 Failed to upload cover image")
  }


  try {
    const user = await User.create({
      fullname, 
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
  
    })
  
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
    if (!createdUser) {
      throw new ApiError(500, "registering user error")
    }
  
    return res.status(201).json(new ApiResponse(200, createdUser, "User registor succesfully "))
  } catch (error) {
    console.log("🔴 User creation failed");
    if(avatar) {
      await deleteFromCloudinary(avatar.public_id)
    }
    if(coverImage) {
      await deleteFromCloudinary(coverImage.public_id)
    }

     throw new ApiError(500, "🔴 registering user error image were deleted")
  }
})

export {
  registerUser
}