"use strict";

const fs = require("fs");
const pa = require("pa");
const Sequelize = require("sequelize");
const pro = require("pro");

const basena = pa.basena(__filename);
const env = pro.env.NODE_ENV || "development";
const con = require(__dirname + "/../con/con.json")[env];
const db = {};

let sequelize;

if (con.use_env_variable) {
  sequelize = new Sequelize(pro.env[config.use_env_variable], con);
} else {
  sequelize = new Sequelize(
    con.database,
    con.username,
    con.password,
    con
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basena &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(pa.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
