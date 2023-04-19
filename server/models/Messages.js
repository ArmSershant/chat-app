const Sequelize = require('sequelize')
const Messages = (sequelize) => sequelize.define('messages', {
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName: true,
  timestamps: false
});
module.exports = Messages
