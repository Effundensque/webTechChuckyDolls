const sequelize = require('../db')
const Sequelize = require('sequelize')

const Team = sequelize.define('team', {
    id:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teamName:{
      type:Sequelize.STRING
    }
  });

  module.exports= Team