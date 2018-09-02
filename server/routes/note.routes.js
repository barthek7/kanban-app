import { Router } from 'express';
import * as NoteController from '../controllers/note.controller';

const router = new Router();

// Add a new note
router.route('/notes').post(NoteController.addNote);

//Delete a note from lane
router.route('/notes').delete(NoteController.deleteNote);

//Update note task
router.route('/notes/update').put(NoteController.changeNoteTask);

export default router;
