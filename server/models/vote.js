export default (sequelize, DataTypes) => {
  const Vote = sequelize.define('vote', {
    type: {
      type: DataTypes.ENUM,
      values: ['upvote', 'downvote'],
    },
  }, {
    classMethods: {
      associate: () => {
        // associations can be defined here
      },
    },
  });
  return Vote;
};
