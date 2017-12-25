export default (sequelize, DataTypes) => {
  const vote = sequelize.define('vote', {
    type: {
      type: DataTypes.ENUM,
      values: ['upvote', 'downvote'],
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
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
  return vote;
};
