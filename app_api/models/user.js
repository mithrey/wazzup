
const Sequelize = require('sequelize');
const db = require('./db');
const Note = require('./note');

let User = db.sequelize.define('user',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    hash: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    login: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.hasMany(Note, {as: 'notes', foreignKey:"userId"})

module.exports = User;

//////////////////////////////////////


