const User = require('../models/user');
const Note = require('../models/note');
const db = require('../models/db');
const Op = db.Sequelize.Op;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config')
const secret = config.get('secret');

const sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.getNotesCount = async function(req, res){
    let authorization = req.headers.authorization.split(' ')[1];

    try {
        let decoded = jwt.verify(authorization, secret);

        let user = await User.findByPk(decoded._id);
        let notes = await user.countNotes();
        return sendJsonResponse(res, 200, {status: 'success', data: notes});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}

module.exports.deleteNote = async function(req, res){
    let authorization = req.headers.authorization.split(' ')[1];
    let id = req.params.id;

    try {
        let decoded = jwt.verify(authorization, secret);

        let user = await User.findByPk(decoded._id);
        let notes = await user.getNotes({where: {id}});
        if (notes.length === 0) return sendJsonResponse(res, 400,  {status: 'error', msg: "Note not found"});
        await notes[0].destroy();
        return sendJsonResponse(res, 200,  {status: 'success', data: notes[0].id});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}

module.exports.getNote = async function(req, res){
    let authorization = req.headers.authorization.split(' ')[1];
    let id = req.params.id;

    try {
        let decoded = jwt.verify(authorization, secret);

        let user = await User.findByPk(decoded._id);
        
        let notes = await user.getNotes({where: {id}});
        if (notes.length === 0) return sendJsonResponse(res, 400,  {status: 'error', msg: "Note not found"});
        return sendJsonResponse(res, 200, {status: 'success', data: notes[0]});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}

module.exports.readNote = async function(req, res){
    let path = req.params.path;

    try {

        let note = await Note.findOne({where: {path, linkAccess: true}});
        if (!note) return sendJsonResponse(res, 400,  {status: 'error', msg: "Note not found"});
        return sendJsonResponse(res, 200, {status: 'success', data: note.text});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}

module.exports.updateNote = async function(req, res){
    let authorization = req.headers.authorization.split(' ')[1];
    let id = req.params.id;
    let text = req.body.text;
    if ( !text ) return sendJsonResponse(res, 400, {status: 'error', msg: "Wrong params"});
    if (text.length > 1000 || text.length === 0) return sendJsonResponse(res, 400, {status: 'error', msg: "Text length error"});

    try {
        let decoded = jwt.verify(authorization, secret);

        let user = await User.findByPk(decoded._id);
        let notes = await user.getNotes({where: {id}});
        if (notes.length === 0) return sendJsonResponse(res, 400,  {status: 'error', msg: "Note not found"});
        notes[0].text = text
        await notes[0].save();
        return sendJsonResponse(res, 200,  {status: 'success', data: notes[0]});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}

module.exports.setLinkSharing = async function(req, res){
    let authorization = req.headers.authorization.split(' ')[1];
    let id = req.params.id;
    let state = req.body.state;
    if (typeof state === "undefined") return sendJsonResponse(res, 400, {status: 'error', msg: "Wrong params"});

    try {
        let decoded = jwt.verify(authorization, secret);

        let user = await User.findByPk(decoded._id);
        let notes = await user.getNotes({where: {id}});
        if (notes.length === 0) return sendJsonResponse(res, 400,  {status: 'error', msg: "Note not found"});
        notes[0].linkAccess = state;
        await notes[0].save();
        return sendJsonResponse(res, 200,  {status: 'success', data: notes[0]});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}


module.exports.getNotes = async function(req, res){
    let authorization = req.headers.authorization.split(' ')[1];
    let limit = parseInt(req.query.l) | 10;
    let skip = parseInt(req.query.s) | 0;
    
    try {
        let decoded = jwt.verify(authorization, secret);

        let user = await User.findByPk(decoded._id);
        let notes = await user.getNotes({limit: limit, offset: skip, order: [['createdAt', 'DESC']]});
        return sendJsonResponse(res, 200, {status: 'success', data: notes});
    } catch (e) {
        console.log(e);
        return sendJsonResponse(res, 400,  {status: 'error', msg: e});
    }
}

module.exports.createNote = async function (req, res) {
    let text = req.body.text;
    if ( !text ) return sendJsonResponse(res, 400, {status: 'error', msg: "Wrong params"});
    if ( text.length > 1000 || text.length === 0) return sendJsonResponse(res, 400, {status: 'error', msg: "Text length error"});
    let authorization = req.headers.authorization.split(' ')[1];

    try {
        let decoded = jwt.verify(authorization, secret);
        let user = await User.findByPk(decoded._id);
        let note = await user.createNote({
            text: String(text)
        });

        return sendJsonResponse(res, 200, {status: 'success', data: note.id});
    } catch (e) {
        return sendJsonResponse(res, 400, {status: 'error', msg: e, msg: e});
    }

    
};
