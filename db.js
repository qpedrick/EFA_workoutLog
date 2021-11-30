const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:postgresPW@localhost:5432/workoutLog')

module.exports = sequelize