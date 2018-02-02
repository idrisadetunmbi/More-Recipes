import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../bin/www';
import userSeeders from '../seeders/user_seeders';

const { assert } = chai;
chai.use(chaiHttp);

describe('Recipe voting review actions', () => {
  const testData = {};

  before((done) => {
    // sign in required user for creating recipe
    chai.request(server)
      .post('/api/users/signin')
      .type('form')
      .send(userSeeders.signIn.fullSigninDetails)
      .end((err, res) => {
        testData.userAuthToken = res.body.data.token;
        done();
      });
  });

  before((done) => {
    // sign in alternative user required to do actual upvoting
    chai.request(server)
      .post('/api/users/signin')
      .type('form')
      .send({
        username: userSeeders.signUp.altUser.username,
        password: userSeeders.signUp.altUser.password,
      })
      .end((err, res) => {
        testData.altUserToken = res.body.data.token;
        done();
      });
  });

  before((done) => {
    // post a recipe required for testing
    chai.request(server)
      .post('/api/recipes')
      .set('authorization', `Bearer ${testData.userAuthToken}`)
      .type('form')
      .send({
        title: 'Ewa agoyin with efo',
        description: 'A great recipe',
        ingredients: 'ewa and ata of course',
        directions: 'just pour everything together',
      })
      .end((err, res) => {
        assert.equal(res.statusCode, 201);
        assert.exists(res.body.data.id);
        testData.postedRecipeID = res.body.data.id;
        testData.postedRecipe = res.body.data;
        done();
      });
  });

  describe('POST /api/recipes/:recipeId/upvote - upvote a recipe', () => {
    it('returns an error without a user token', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/upvote`)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('returns an error with an invalid recipe id', (done) => {
      chai.request(server)
        .post('/api/recipes/invalidrecipeid/upvote')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('disallows recipe owner from upvoting a recipe', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/upvote`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          assert.exists(res.body.error);
          done();
        });
    });

    it('allows a user to upvote a recipe and increases the recipe upvote count', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/upvote`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.message, 'recipe has been upvoted');
          assert.equal(res.body.data.upvotes - testData.postedRecipe.upvotes, 1);
          done();
        });
    });

    it('removes the upvote if user tries to upvote recipe again', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/upvote`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.message, 'upvote has been removed on recipe');
          assert.equal(res.body.data.upvotes, testData.postedRecipe.upvotes);
          done();
        });
    });
  });

  describe('POST /api/recipes/:recipeId/downvote - downvoting a recipe', () => {
    it('returns an error without a user token', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/downvote`)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('returns an error with an invalid recipe id', (done) => {
      chai.request(server)
        .post('/api/recipes/invalidrecipeid/downvote')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('disallows recipe owner from downvoting a recipe', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/downvote`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          assert.exists(res.body.error);
          done();
        });
    });

    it('allows a user to downvote a recipe and increases the recipe downvote count', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/downvote`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.message, 'recipe has been downvoted');
          assert.equal(res.body.data.downvotes - testData.postedRecipe.downvotes, 1);
          done();
        });
    });

    it('removes the downvote if user tries to downvote recipe again', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/downvote`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.message, 'downvote has been removed on recipe');
          assert.equal(res.body.data.upvotes, testData.postedRecipe.upvotes);
          done();
        });
    });
  });

  describe('POST /api/recipes/:recipeId/favorite - favoriting a recipe', () => {
    it('returns an error without a user token', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/favorite`)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('returns an error with an invalid recipe id', (done) => {
      chai.request(server)
        .post('/api/recipes/invalidrecipeid/favorite')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('disallows recipe owner from favoriting a recipe', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/favorite`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 403);
          assert.exists(res.body.error);
          done();
        });
    });

    it('allows a user to favorite a recipe and increases the recipe favorites count', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/favorite`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          assert.equal(res.body.message, 'recipe has been added as a favorite');
          assert.equal(res.body.data.favorites - testData.postedRecipe.favorites, 1);
          done();
        });
    });

    it('removes the favorite if user tries to favorite recipe again', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/favorite`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.equal(res.body.message, 'recipe has been removed from favorites');
          assert.equal(res.body.data.upvotes, testData.postedRecipe.upvotes);
          done();
        });
    });
  });

  describe('POST /api/recipes/:recipeId/reviews', () => {
    it('returns an error without a user token', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('returns an error with an invalid recipe id', (done) => {
      chai.request(server)
        .post('/api/recipes/invalidrecipeid/reviews')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('returns an error without request body', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('returns an error without rating property on request body', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .type('form')
        .send({
          content: 'bad recipe',
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('returns an error with rating property greater than 5', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .type('form')
        .send({
          rating: 10,
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('returns an error with rating property less than 1', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .type('form')
        .send({
          rating: 0,
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('allows a user to review a recipe', (done) => {
      chai.request(server)
        .post(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .type('form')
        .send({
          rating: 1,
          content: 'a great recipe',
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 201);
          assert.exists(res.body.data);
          done();
        });
    });
  });

  describe('GET /api/recipes/:recipeId/reviews', () => {
    it('returns an error with an invalid recipe id', (done) => {
      chai.request(server)
        .get('/api/recipes/invalidrecipeid/reviews')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.exists(res.body.errors);
          done();
        });
    });

    it('returns an array of reviews for a valid recipe', (done) => {
      chai.request(server)
        .get(`/api/recipes/${testData.postedRecipeID}/reviews`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          assert.isArray(res.body.data);
          done();
        });
    });
  });
});
