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
};
