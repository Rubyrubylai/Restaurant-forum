'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('restaurants', 'image', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('restaurants', 'image');
  }
};
