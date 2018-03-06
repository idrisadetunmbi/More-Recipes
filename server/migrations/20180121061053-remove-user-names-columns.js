'use strict';

module.exports = {
  up: queryInterface => queryInterface.removeColumn('users', 'firstName')
    .then(() => queryInterface.removeColumn('users', 'lastName')),

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
