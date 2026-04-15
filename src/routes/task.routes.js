import { Router } from "express";
import {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createTaskValidator,
  createSubtaskValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateTaskPermission,
  validateSubtaskPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();
router.use(verifyJWT);   //all/every route will include verifyJWT middleware

router
  .route("/:projectId")
  .get(getTasks)
  .post(createTaskValidator(),
   validate,
   upload.single('attachements'), //.fields([{},{}])
   createTask);

router
   .route("/:projectId/t/:taskId")   
   .get( validateTaskPermission(AvailableUserRole), getTaskById)
   .put( validateTaskPermission([UserRolesEnum.ADMIN]),
    createTaskValidator(), 
    validate, 
    updateTask)
   .delete(deleteTask);

router
   .route("/:projectId/st/:taskId/subtasks")
   .post(createSubtaskValidator(),
    validate,
    createSubTask)

router
   .route("/:projectId/st/:subTaskId")     
   .put(validateSubtaskPermission([UserRolesEnum.ADMIN]), 
   createSubtaskValidator(),
    validate,
    updateSubTask,
   )
  .delete(validateSubtaskPermission([UserRolesEnum.ADMIN]),
   deleteSubTask);

   export default router;