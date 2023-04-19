const Sequelize = require('sequelize');
const Users = (sequelize) => sequelize.define('users', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  failedLoginAttempts: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  lockedUntil: {
    type: Sequelize.DATE,
    allowNull: true
  },
  confirmed: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
},
  {
    freezeTableName: true,
    timestamps: false
  })

module.exports = Users
