export default (sequelize, DataTypes) => {
  const Recipe = sequelize.define('recipe', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    directions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'uncategorized',
    },
    upvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    downvotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    favorites: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
  Recipe.associate = (models) => {
    Recipe.belongsTo(models.user, { as: 'creator', foreignKey: 'creatorId' });
    Recipe.belongsToMany(models.user, { as: 'userActions', through: models.recipe_action });
    Recipe.hasMany(models.review);
  };
  return Recipe;
};

