import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { logger } from "../logger/index.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username fullname");

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Task fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;

  const attachementsLocalPath = req.files?.attachements[0]?.path;     
    console.log(attachementsLocalPath)
  if(!attachementsLocalPath){
    throw new ApiError(400, "Attachement is required")
  }

const attachment = await uploadOnCloudinary(attachementsLocalPath)

if(!attachment){
  throw new ApiError(400, "Attachement is required for cloudinary")
} 

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const files = req.files || [];

  // const attachements = files.map((file) => {
  //   return {
  //     url: `${process.env.SERVER_URL}/images/${file.originalname}`,
  //     mimetype: file.mimetype,
  //     size: file.size,
  //   };
  // });

  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,
    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments: [{url: attachment?.url || ""}],
  });

  return res
    .status(201)
    .json(new ApiResponse(200, task, "Task created successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          // {
          //   _id: 1,
          //   username: 1,
          //   fullname: 1,
          //   avatar: 1,
          // },
          {
    $project: { // <--- This stage was missing
      _id: 1,
      username: 1,
      fullname: 1,
      avatar: 1,
    },
  },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]); 

 

  if (!task || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { projectId, taskId } = req.params;

   console.log("Task ID:", taskId);
   if (!mongoose.Types.ObjectId.isValid(taskId)) {
  throw new ApiError(400, "Invalid task ID");
    }
    
  try {
    const task = await Task.findByIdAndUpdate(
  new mongoose.Types.ObjectId(taskId),
    {
      title,
      description,
    },
    { new: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
  } catch (error) {
    logger.error(error)
  }
 
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, isCompleted, createdBy } = req.body;
  const { projectId, taskId } = req.params;
  
  const task = await Task.findById(taskId);
  console.log("taskkk", task)
  if (!task) {
    throw new ApiError(404, "task not found");
  }

  const subtask = await SubTask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    isCompleted: isCompleted
      ? new mongoose.Types.ObjectId(isCompleted)
      : undefined,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { projectId, subTaskId } = req.params;

  const subtask = await SubTask.findByIdAndUpdate(
    subTaskId,
    {
      title,
    },
    { new: true },
  );
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const { subTaskId } = req.params;

  const subtask = await SubTask.findByIdAndDelete(subTaskId);
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, subtask, "Subtask deleted successfully"));
});

export {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
