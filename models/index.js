const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('socket_app', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Notification = require('./notification')(sequelize, Sequelize);

db.User.hasMany(db.Notification, { foreignKey: 'receiverId' });
db.Notification.belongsTo(db.User, { foreignKey: 'receiverId', as: 'receiver' });
db.Notification.belongsTo(db.User, { foreignKey: 'senderId', as: 'sender' });



module.exports = db;