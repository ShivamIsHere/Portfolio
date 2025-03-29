import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar Required!", 400));
  }

  const { avatar, resume } = req.files;


  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    { folder: "PORTFOLIO AVATAR" }
  );
  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

//   const cloudinaryResponseForResume = await cloudinary.uploader.upload(
//     resume.tempFilePath,
//     { folder: "PORTFOLIO RESUME" }
//   );
const cloudinaryResponseForResume = await cloudinary.uploader.upload(resume.tempFilePath, {
    folder: "PORTFOLIO RESUME",
    resource_type: "auto",  
    type: "upload",        
    format: "pdf"
});


  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForResume.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
  }
  const {
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
    linkedInURL,
  } = req.body;
  const user = await User.create({
    fullName,
    email,
    phone,
    aboutMe,
    password,
    portfolioURL,
    githubURL,
    instagramURL,
    twitterURL,
    facebookURL,
    linkedInURL,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id, 
      url: cloudinaryResponseForAvatar.secure_url, 
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id, 
      url: cloudinaryResponseForResume.secure_url, 
    },
  });
   res.status(200).json({
    success:true,
    message:"User Registered"
   })
});