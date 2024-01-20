const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db')

const User = sequelize.define("user", {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    default: false,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },

  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  password_salt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mfa_secret: {
    type: DataTypes.STRING(),
    allowNull: true,
    unique: true
  },
  mfa_enable: {
    type: DataTypes.BOOLEAN,
    default: true,
    allowNull:true
  }
});

User.associate = (models) => {
    User.belongsToMany(sequelize.models.Role, { through: 'UserRoles' });
  };


User.removeAttribute(['id'])

module.exports = User