const { Op } = require('sequelize')
const { Users, Messages, Rooms } = require('../util/database')
class UserController {
  getUser = async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({ where: { id: id }, include: all });
    res.json(user);
  }

  getUsers = async (req, res) => {
    const users = await Users.findAll({
      where: {
        confirmed: 1,
        id: {
          [Op.ne]: req.user.id
        }
      }
    })
    res.send({ users })
  }
}
module.exports = new UserController()
