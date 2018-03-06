export default {
  signUp: {
    // res.body.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nullUsername: {
      password: 'javascript',
      email: 'user001@mail.com',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },

    // res.body.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nullEmail: {
      username: 'user001',
      password: 'javascript',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },

    // Object.message === "No password supplied"
    // res.statusCode === 400
    nullPassword: {
      username: 'user001',
      email: 'user001@mail.com',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },

    // res.body.message === "user successfully created"
    // res.statusCode === 201
    fullUserDetails: {
      username: 'user001',
      password: 'javascript',
      email: 'user001@mail.com',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },

    // Object.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nonUniqueEmail: {
      username: 'user001',
      password: 'javascript',
      email: 'user001@mail.com',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },

    // Object.message === "Invalid credentials supplied"
    // res.statusCode === 400
    nonUniqueUsername: {
      username: 'user001',
      password: 'javascript',
      email: 'user005@mail.com',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },

    altUser: {
      username: 'user002',
      password: 'javascript',
      email: 'user002@mail.com',
      firstName: 'usersfirstname',
      lastName: 'userslastname',
    },
  },

  signIn: {
    // statuscode === 400
    // message === invalid credentials supplied
    nullValues: {
    },

    // status code === 400
    // message === invalid credentials supplied
    nullUsername: {
      password: 'javascript',
    },

    nullPassword: {
      username: 'user001',
    },

    // status code === 200
    // message === user signin is successful
    fullSigninDetails: {
      username: 'user001',
      password: 'javascript',
    },

    // status code === 401
    // message === please verify the username or that you are registered
    wrongUsername: {
      username: 'wrongusername',
      password: 'javascript',
    },

    // status code === 401
    // message === please verify the password is correct
    wrongPassword: {
      username: 'user001',
      password: 'javascript21',
    },
  },
};
