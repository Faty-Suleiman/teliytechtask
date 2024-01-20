const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Otp = sequelize.define("otps", {
  otp_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 0,
  },
});

Otp.removeAttribute(["id"]);

module.exports = Otp;
