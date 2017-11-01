export default (sequelize, DataTypes) => {
  const recipeAction = sequelize.define('recipe_action', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
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
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    vote: {
      type: DataTypes.ENUM,
      values: ['upvote', 'downvote'],
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
  });
  return recipeAction;
};
