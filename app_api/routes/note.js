const express = require('express');
const router = express.Router();
const config = require('../../config')
const secret = config.get('secret');

const jwt = require('express-jwt');

const auth = jwt({
    secret: secret,
    _userProperty: 'payload'
});

const ctrlNote = require('../controllers/note');

router.get('/notes', auth, ctrlNote.getNotes);
router.post('/note', auth, ctrlNote.createNote);
router.get('/notesCount', auth, ctrlNote.getNotesCount);
router.delete('/note/:id', auth, ctrlNote.deleteNote);
router.get('/note/:id', auth, ctrlNote.getNote);
router.put('/note/:id', auth, ctrlNote.updateNote);
router.put('/noteLinkSharing/:id', auth, ctrlNote.setLinkSharing);

router.get('/noteText/:path', ctrlNote.readNote);

module.exports = router;