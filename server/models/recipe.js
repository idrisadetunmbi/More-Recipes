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
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
  });
  Recipe.associate = (models) => {
    Recipe.belongsTo(models.user, { as: 'author', foreignKey: 'authorId' });
    Recipe.belongsToMany(models.user, { as: 'favoritedUsers', through: models.favorite });
    Recipe.belongsToMany(models.user, { as: 'voters', through: models.vote });
    Recipe.hasMany(models.review);
  };
  return Recipe;
};

