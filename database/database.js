const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress', 'root', 'Passei1t',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;

