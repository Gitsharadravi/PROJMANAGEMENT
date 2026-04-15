import { Router } from "express";
import {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjects,
  getProjectById,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembertoProjectValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

console.log({
  getProjects: typeof getProjects,
  getProjectById: typeof getProjectById,
  validateProjectPermission: typeof validateProjectPermission,
  permissionResult: typeof validateProjectPermission([UserRolesEnum.ADMIN])
});

const router = Router();
router.use(verifyJWT);   //all route will include verifyJWT middleware

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(),
   validate,
   createProject);

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getProjectById)
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProject,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]),
   deleteProject);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembertoProjectValidator(),
    validate,
    addMembersToProject,
  );

router
  .route("/:projectId/members/:userId")
  .put(validateProjectPermission([UserRolesEnum.ADMIN]),
   updateMemberRole)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]),
   deleteMember);

export default router;
