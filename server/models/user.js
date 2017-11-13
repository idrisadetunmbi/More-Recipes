import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
  User.beforeCreate((user, options) => {
    user.password = bcrypt.hashSync(user.password, 10);
  });
  User.associate = (models) => {
    User.hasMany(models.recipe, { as: 'recipes', foreignKey: 'authorId' });
    User.belongsToMany(models.recipe, { as: 'favoriteRecipes', through: 'favorites' });
    User.belongsToMany(models.recipe, { as: 'upvotedRecipes', through: 'upvotes' });
    User.belongsToMany(models.recipe, { as: 'recipeReviews', through: models.review });
    User.hasMany(models.review);
  };
  return User;
};
