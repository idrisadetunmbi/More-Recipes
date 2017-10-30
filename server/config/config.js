require('dotenv').config({ path: `${__dirname}/../../.env` });


module.exports = {
  development: {
    use_env_variable: 'DEV_DATABASE_URL',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres',
  },
  // development: {
  //   use_env
  //   dialect: 'mysql',
  // },
  // test: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_test',
  //   host: '127.0.0.1',
  //   dialect: 'mysql',
  // },
  // production: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_production',
  //   host: '127.0.0.1',
  //   dialect: 'mysql',
  // },
};
