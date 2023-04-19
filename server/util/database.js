const Sequelize = require('sequelize');
const sequelize = new Sequelize('chat_app_db', 'root', "", {
  dialect: 'mysql',
  host: 'localhost',
})

const Users = require('../models/Users')(sequelize)
const Messages = require('../models/Messages')(sequelize)


Messages.belongsTo(Users, { as: 'sender', foreignKey: 'senderId' })
Messages.belongsTo(Users, { as: 'receiver', foreignKey: 'receiverId' })


sequelize.sync()
module.exports = { Users, Messages }
