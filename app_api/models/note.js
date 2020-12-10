const Sequelize = require('sequelize');
const db = require('./db');

let Note = db.sequelize.define('note',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  // createdAt: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  //   defaultValue: Sequelize.NOW
  // },
  // updatedAt: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  //   defaultValue: Sequelize.NOW
  // },
  text: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  path: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true,
    defaultValue: Sequelize.UUIDV4
  },
  linkAccess: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Note;
