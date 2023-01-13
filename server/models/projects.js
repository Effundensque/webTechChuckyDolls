const sequelize = require('../db')
const Sequelize = require('sequelize')

const Project = sequelize.define('project', {
    id:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    projectName:{
      type:Sequelize.STRING
    },
    teamId:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    grade1:{
        type: Sequelize.FLOAT
    },
    grade2:{
        type: Sequelize.FLOAT
    },
    grade3:{
        type: Sequelize.FLOAT
    },
    grade4:{
        type: Sequelize.FLOAT
    },
    grade5:{
        type: Sequelize.FLOAT
    },
    description:{
        type: Sequelize.STRING
    }
  });

  module.exports= Project