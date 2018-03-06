export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('favorite', {
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
    recipeId: {
      type: DataTypes.UUID,
      references: {
        model: 'recipes',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
  });
  Favorite.associate = (models) => {
    Favorite.belongsTo(models.recipe);
    Favorite.belongsTo(models.user);
  };
  return Favorite;
};
