const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db')

const Role = sequelize.define("roles", {
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  
  roleName	: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Role.associate = (models) => {
    Role.belongsToMany(sequelize.models.User, { through: 'UserRoles' });
  };

Role.removeAttribute(['id'])

module.exports = Role