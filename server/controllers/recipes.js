import Sequelize from 'sequelize';
import dbModels from '../models';

/**
 *
 *
 * @export
 * @class RecipeController
 */
export default class RecipeController {
  /**
   * Retrieves a single recipe from the database
   * @param {string} recipeId - id of recipe to get from the database
   *
   * @returns {Promise} promise object holding the single recipe from
   * the database
   * @memberOf RecipeController
   */
  getRecipeFromDb = recipeId =>
    dbModels.recipe.findById(recipeId, {
      include: [
        {
          model: dbModels.user, as: 'author', attributes: ['username', 'imageUrl'],
        },
      ],
    });

  /**
   * Adds a new recipe to the database
   * @param {object} req - express request object
   * @param {object} res - express response object
   *
   * @returns {void}
   */
  createRecipe = async (req, res) => {
    // check recipe with title by user already exists
    let recipe = await dbModels.recipe.findOne({
      where: {
        title: {
          [Sequelize.Op.iLike]: req.body.title,
        },
        authorId: req.user.id,
      },
    });
    if (recipe) {
      return res.status(400).send({
        message: 'you already created a recipe with this title',
      });
    }
    try {
      recipe = await dbModels.recipe.create({
        ...req.body,
        authorId: req.user.id,
        upvotes: 0,
        downvotes: 0,
        favorites: 0,
      });
      recipe = await this.getRecipeFromDb(recipe.id);
    } catch (error) {
      return res.status(400).send({
        message: 'An error occured while performing this request',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(201).send({
      message: 'Recipe created successfully',
      data: recipe,
    });
  }

  /**
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  getAllRecipes = async (req, res) => {
    const {
      limit, sort, offset, query, order,
    } = req.query;
    const acceptableSortKeys = ['upvotes', 'downvotes', 'createdAt', 'favorites'];
    const sortKey = acceptableSortKeys.includes(sort) ? sort : 'createdAt';

    let recipes;
    try {
      recipes = await dbModels.recipe.findAll({
        // findAll where title contains query or where ingredients contain query
        [query && 'where']: {
          [Sequelize.Op.or]: [
            {
              title: {
                [Sequelize.Op.iLike]: `%${query}%`,
              },
            },
            {
              ingredients: {
                [Sequelize.Op.iLike]: `%${query}%`,
              },
            },
          ],
        },
        include: [
          {
            model: dbModels.user, as: 'author', attributes: ['username', 'imageUrl'],
          },
        ],
        order: [[sortKey, order && order.toLowerCase().includes('asc') ? 'ASC' : 'DESC']],
        limit,
        offset,
      });
    } catch (error) {
      return res.status(500).send({
        message: 'unhandled server error',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      messgae: 'recipe listing',
      data: recipes,
    });
  }

  /**
   * Retrieves a single recipe from the database and sends it to the client
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  getRecipe = async (req, res) => {
    const { recipe } = req;
    return res.status(200).send({
      data: recipe,
    });
  }

  /**
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  modifyRecipe = async (req, res) => {
    if (Object.values(req.body).every(field => !field)) {
      return res.status(400).send({
        error: 'request body does not contain any data to modify recipe',
      });
    }

    const recipeWithTitleExists = await dbModels.recipe.findOne({
      where: {
        authorId: req.user.id,
        id: { [Sequelize.Op.ne]: req.params.recipeId },
        title: { [Sequelize.Op.iLike]: req.body.title },
      },
    });
    if (recipeWithTitleExists) {
      return res.status(400).send({
        message: 'you have another recipe with this title',
      });
    }

    const { recipe } = req;
    if (recipe.authorId !== req.user.id) {
      return res.status(403).send({
        error: 'this recipe was added by another user',
      });
    }
    const newRecipeData = {
      [req.body.title && 'title']: req.body.title,
      [req.body.ingredients && 'ingredients']: req.body.ingredients,
      [req.body.description && 'description']: req.body.description,
      [req.body.directions && 'directions']: req.body.directions,
      [req.body.images && 'images']: req.body.images,
    };
    try {
      await recipe.update({
        ...newRecipeData,
        authorId: recipe.authorId,
        upvotes: recipe.upvotes,
        downvotes: recipe.downvotes,
        favorites: recipe.favorites,
      });
    } catch (error) {
      return res.status(500).send({
        message: 'server unhandled error',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: 'recipe updated successfully',
      data: recipe,
    });
  }

  /**
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  deleteRecipe = async (req, res) => {
    const { recipe } = req;
    if (recipe.authorId !== req.user.id) {
      return res.status(403).send({
        error: 'this recipe was added by another user',
      });
    }
    try {
      await recipe.destroy();
    } catch (error) {
      return res.status(500).send({
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      // eslint-disable-next-line
      message: `recipe with ${req.params.recipeId} has been successfully deleted`,
    });
  }

  /**
   * Retrieves a single recipe from the database and sends it to the client
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  postRecipeReview = async (req, res) => {
    let review;
    try {
      review = await dbModels.review.create({
        ...req.body,
        userId: req.user.id,
        recipeId: req.params.recipeId,
      });
      review = await dbModels.review.findById(review.id, {
        attributes: { exclude: ['updatedAt', 'rating'] },
        include: [{
          model: dbModels.user, attributes: ['username', 'imageUrl'],
        }],
      });
    } catch (error) {
      return res.status(500).send({
        message: 'an error occurred while performing this request',
        error: error.message,
      });
    }
    return res.status(201).send({
      message: 'review added successfully',
      data: review,
    });
  }

  /**
   * Retrieves a single recipe from the database and sends it to the client
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  getRecipeReviews = async (req, res) => {
    let reviews;
    try {
      reviews = await dbModels.review.findAll({
        where: {
          recipeId: req.params.recipeId,
        },
        include: [{ model: dbModels.user, attributes: ['username', 'imageUrl'] }],
      });
    } catch (error) {
      return res.status(500).send({
        message: 'an error occurred',
        error: error.message || error.errors[0].message,
      });
    }
    return res.status(200).send({
      message: `reviews for recipe with id ${req.params.recipeId}`,
      data: reviews,
    });
  }

  /**
   * Retrieves a single recipe from the database and sends it to the client
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  favoriteRecipe = async (req, res) => {
    const { user, recipe } = req;
    if (user.id === recipe.authorId) {
      return res.status(403).send({
        error: 'you cannot favorite a recipe you created',
      });
    }

    const recipeIsUsersFavorite = await user.hasFavoriteRecipe(recipe);
    if (recipeIsUsersFavorite) {
      user.removeFavoriteRecipe(recipe);
      await recipe.decrement('favorites');
      return res.status(200).send({
        message: 'recipe has been removed from favorites',
        data: recipe,
      });
    }
    user.addFavoriteRecipe(recipe);
    await recipe.increment('favorites');
    return res.status(201).send({
      message: 'recipe has been added as a favorite',
      data: recipe,
    });
  }

  /**
   * Retrieves a single recipe from the database and sends it to the client
   * @param {string} req - express request object
   * @param {string} res - express response object
   *
   * @returns {Object} express ServerResponse object
   * @memberOf RecipeController
   */
  voteRecipe = async (req, res) => {
    // get vote type from url since same controller handles upvotes and
    // downvotes
    const action = req.path.includes('upvote') ? 'upvote' : 'downvote';
    const { user, recipe } = req;
    if (user.id === recipe.authorId) {
      return res.status(403).send({
        error: `you cannot ${action} a recipe you created`,
      });
    }

    const vote = await recipe.getVoters({
      attributes: [],
      where: { id: user.id },
      joinTableAttributes: ['type'],
    });

    const currentVoteType = vote.length && vote[0].vote.type;
    if (!currentVoteType || currentVoteType !== action) {
      recipe.addVoter(user, { through: { type: action } });
      await recipe.increment(`${action}s`);
      if (currentVoteType) {
        await recipe.decrement(`${currentVoteType}s`);
      }
      return res.status(200).send({
        message: `recipe has been ${action}d`,
        data: recipe,
      });
    }
    recipe.removeVoter(user);
    await recipe.decrement(`${action}s`);
    return res.status(200).send({
      message: `${action} has been removed on recipe`,
      data: recipe,
    });
  }
}

