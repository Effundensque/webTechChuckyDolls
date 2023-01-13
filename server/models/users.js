const sequelize = require('../db')
const Sequelize = require('sequelize')

const User = sequelize.define('user', {
    id:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING
    },
    password:{
      type:Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM,
      values: ['PM', 'PROF']
    },
    teamId:
    {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    token: Sequelize.STRING,
    expiry: Sequelize.DATE
  });

  module.exports= User