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
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: 'uncategorized',
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

