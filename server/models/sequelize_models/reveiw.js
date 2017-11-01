'use strict';

export default (sequelize, DataTypes) => {
  const Review = sequelize.define('review', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },
    },
  });
  Review.associate = (models) => {
    Review.belongsTo(models.user);
    Review.belongsTo(models.recipe);
  };
  return Review;
};
