import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { ProjectNote } from "../models/note.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //Decode token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {       //return fix
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "project id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(400, "project not found");
    }
    
    const givenRole = project?.role;     //getting role from db
    
    req.user.role = givenRole;           //adding role to user

    if (!roles.includes(givenRole)) {    //here roles is comimg from, that we'r providing in req
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  });
};

export const validateTaskPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {       //return fix
    const { projectId } = req.params;
    console.log("roles is ", roles)
    if (!projectId) {
      throw new ApiError(400, "project id is missing");
    }
   
  const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(400, "project not found");
    }
    
    const givenRole =  project?.role; //getting role from db
    console.log("given roles is ", givenRole)
    req.user.role = givenRole;            

    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  });
};

export const validateSubtaskPermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {       //return fix
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "projectId id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId), 
      user: new mongoose.Types.ObjectId(req.user._id),
    });
    console.log("project", project)
    if (!project) {
      throw new ApiError(404, "project not found");
    }
    
    const givenRole = project?.role; 
    
    req.user.role = givenRole;            

    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  });
};

export const validateNotePermission = (roles = []) => {
  return asyncHandler(async (req, res, next) => {       //return fix
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "project Id is missing");
    }

    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!project) {
      throw new ApiError(400, "project not found");
    }
    
    const givenRole = project?.role; //getting role from db
    
    req.user.role = givenRole;            

    if (!roles.includes(givenRole)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  });
};
