require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT
const sequelize = require("./config/db");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const router = require("./routes/index");
const user = require("./models/userModel")
const otp = require("./models/otpModel")
const role = require("./models/roleModel")
const assignRole = require("./models/assignModel")

app.use(bodyParser.json());
app.use("/api/v1",router)

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    app.listen(port, () => {
    });
  })
  .catch((err) => console.log("Error: " + err));

  sequelize
    .sync()
    .then(() => {
      console.log("Database synchronized");
    })
    .catch((error) => {
      console.error("Error synchronizing the database:", error);
    });
    
  app.use((req, res) => {
    res.status(404).json({
      status: false,
      message: 'Failed'
    });
    
  });