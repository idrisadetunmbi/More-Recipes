import path from 'path';

export const recipe = {
  title: 'A great Recipe',
  ingredients: 'ingredients1\ningredients2',
  directions: 'direction1\ndirection2',
  description: 'A great recipe',
  image: path.resolve(`${__dirname}/download.jpeg`),
};

export const testRecipe = {
  title: 'a new recipe',
  description: 'a new recipe',
  directions: 'go like this\nthenthisi',
  ingredients: 'ingredients1\ningredients2',
  images: ['http://res.cloudinary.com/morerecipes/image/upload/v1520953934/ncs7jppy7aklskaejfre.jpg'],
};

export const user = {
  signUpData: {
    username: 'newusername',
    password: 'password',
    email: 'xyz@mail.com',
  },
  dataWithRegisteredEmail: {
    username: 'anothername',
    password: 'password',
    email: 'xyz@mail.com',
  },
  testUser: {
    username: 'username',
    password: 'password',
    email: 'email@email.com',
  },
};
