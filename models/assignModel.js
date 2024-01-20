const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db')

const AssignRole = sequelize.define("assignRoles", {
  assignment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },

  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  
});


AssignRole.removeAttribute(['id'])

module.exports = AssignRole