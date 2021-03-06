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
    imageUrl: {
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
  });
  User.beforeCreate((user) => {
    // eslint-disable-next-line
    user.password = bcrypt.hashSync(user.password, 10);
  });
  User.associate = (models) => {
    User.hasMany(models.recipe, { as: 'recipes', foreignKey: 'authorId' });
    User.belongsToMany(models.recipe, { as: 'favoriteRecipes', through: models.favorite });
    User.belongsToMany(models.recipe, { as: 'votedRecipes', through: models.vote });
    User.hasMany(models.review);
  };
  return User;
};
