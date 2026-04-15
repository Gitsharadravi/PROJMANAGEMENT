import { User } from "../models/user.models.js";
import { ProjectNote } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import mongoose from "mongoose";
import { logger } from "../logger/index.js";

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
      }

    const projectnote = await ProjectNote.create({
        content,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });
    logger.warn("note warning 1")
    
    return res
    .status(201)
    .json(new ApiResponse(201, projectnote, "Projectnote created successfully"));  
    logger.warn("note warning 1")
});
console.log("console note");
logger.warn("note warning")

const getNotes = asyncHandler(async (req, res) => {
const { projectId } = req.params;
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await ProjectNote.find({
    project: new mongoose.Types.ObjectId(projectId),
  })

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const projectnote = await ProjectNote.findById(noteId);

    if(!projectnote){
        throw new ApiError(404, "Projectnote not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, projectnote, "Projectnote fetched successfully"))
});

const updateNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { noteId } = req.params;

    const projectnote = await ProjectNote.findByIdAndUpdate(
        noteId,
        {
            content,
        },
        { new: true },
    );

    if (!projectnote) {
        throw new ApiError(404, "Project note not found");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, projectnote, "Project note updated successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const projectnote = await ProjectNote.findByIdAndDelete(noteId);

    if(!projectnote){
        throw new ApiError(404, "Projectnote not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, projectnote, "Projectnote deleted successfully"));
});

export { 
    createNote,
    updateNote,
    deleteNote, 
    getNotes, 
    getNoteById 
   };
