const { Sequelize } = require('sequelize');
const db = {};
const sequelize = new Sequelize('wazzup', 'root', '123321', {
  dialect: 'mysql',
  host: 'localhost'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
(async () => {
    await sequelize.sync({  });
    // Code here
  })();
module.exports = db;

