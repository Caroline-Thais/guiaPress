const Sequelize = require("sequelize");

const connection = new Sequelize('lpaopo_bd', 'lpaopo_userbd', 'IYASyivwr98231',{
    host: 'mysql-ag-br1-12.hospedagemelastica.com.br',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;