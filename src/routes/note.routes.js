import { Router } from "express";
import {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
  getNoteById,
} from "../controllers/projectnote.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createNoteValidator } from "../validators/index.js";
import { verifyJWT, validateNotePermission } from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js"; 

const router = Router();
router.use(verifyJWT);

router
.route("/:projectId")
.get(getNotes)
.post(createNote);

router
.route("/:projectId/n/:noteId")
.get(getNoteById)
.put(validateNotePermission([UserRolesEnum.ADMIN]), createNoteValidator(), validate, updateNote)
.delete(validateNotePermission([UserRolesEnum.ADMIN]), deleteNote)

export default router;