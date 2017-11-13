import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../bin/www';
import userSeeders from '../seeders/user_seeders';

const { assert } = chai;
chai.use(chaiHttp);

describe('Recipes routes and actions', () => {
  const testData = {};

  before((done) => {
    // sign in required user for recipe CRUD actions
    chai.request(server)
      .post('/api/users/signin')
      .type('form')
      .send(userSeeders.signIn.fullSigninDetails)
      .end((err, res) => {
        testData.userAuthToken = res.body.data.token;
        testData.userId = res.body.data.userId;
      });
    
    // sign up alternative user required to test that routes/controllers
    // disallow non-author of a recipe to update, delete or modify a recipe
    chai.request(server)
      .post('/api/users/signup')
      .type('form')
      .send(userSeeders.signUp.altUser)
      .end((err, res) => {
        testData.altUserToken = res.body.data.token;
      });
    done();
  });

  describe('POST /api/recipes', () => {
    it('returns an error without a user token', (done) => {
      chai.request(server)
        .post('/api/recipes')
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('should return statusCode:400 without request data', (done) => {
      chai.request(server)
        .post('/api/recipes/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });

    it('should return statusCode:201 with request data', (done) => {
      chai.request(server)
        .post('/api/recipes/')
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
          done();
        });
    });

    it('should return statusCode:400 with no description', (done) => {
      chai.request(server)
        .post('/api/recipes/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .type('form')
        .send({
          ingredients: 'ewa and ata of course',
          title: 'Ewa agoyin with efo',
          directions: 'just pour everything together',
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });

    it('should return statusCode:400 with no ingredients', (done) => {
      chai.request(server)
        .post('/api/recipes/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .type('form')
        .send({
          title: 'Ewa agoyin with efo',
          directions: 'just pour everything together',
          description: 'A great recipe',
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });

    it('should return statusCode:400 with no title', (done) => {
      chai.request(server)
        .post('/api/recipes/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .type('form')
        .send({
          description: 'A great recipe',
          ingredients: 'ewa and ata of course',
          directions: 'just pour everything together',
        })
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });
  });

  describe('GET /api/recipes/', () => {
    it('returns error without a user token', (done) => {
      chai.request(server)
        .get('/api/recipes')
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('returns an array of recipes', (done) => {
      chai.request(server)
        .get('/api/recipes/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.data);
          done();
        });
    });
  });

  describe('GET /api/recipes/:id/', () => {
    it('returns error without a user token', (done) => {
      chai.request(server)
        .get('/api/recipes/recipeId')
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('should return statusCode:400 for an invalid id', (done) => {
      chai.request(server)
        .get('/api/recipes/1/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });

    it('should return statusCode:400 for an unexisting id', (done) => {
      chai.request(server)
        .get('/api/recipes/fb27eb9e-2fe8-41ec-836f-adb7b47b8dd4/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });
    it('should return 200 for a valid and existing id', (done) => {
      chai.request(server)
        .get(`/api/recipes/${testData.postedRecipeID}/`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    it('returns a response with a data property on the body', (done) => {
      chai.request(server)
        .get(`/api/recipes/${testData.postedRecipeID}/`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.exists(res.body.data);
          done();
        });
    });
  });

  describe('PUT /api/recipes/:id/', () => {
    it('should return 400 for an invalid id', (done) => {
      chai.request(server)
        .put('/api/recipes/1/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });
    it('should return 400 for an unexisting id', (done) => {
      chai.request(server)
        .put('/api/recipes/fb27eb9e-2fe8-41ec-836f-adb7b47b8dd4/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .type('form')
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });
    it('should return 400 for an empty title', (done) => {
      chai.request(server)
        .put(`/api/recipes/${testData.postedRecipeID}/`)
        .type('form')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .send({
          title: '',
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });
    it('returns 400 for an empty request body', (done) => {
      chai.request(server)
        .put(`/api/recipes/${testData.postedRecipeID}/`)
        .type('form')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
    it('returns 200 for a request with the right data', (done) => {
      chai.request(server)
        .put(`/api/recipes/${testData.postedRecipeID}/`)
        .type('form')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .send({
          title: 'A great recipe',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.data);
          assert.equal(res.body.data.title, 'A great recipe');
          done();
        });
    });
    it('should disallow non-author of a recipe to modify a recipe', (done) => {
      chai.request(server)
        .put(`/api/recipes/${testData.postedRecipeID}/`)
        .type('form')
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .send({
          title: 'A great recipe',
        })
        .end((err, res) => {
          assert.equal(res.status, 403);
          assert.exists(res.body.error);
          done();
        });
    });
  });

  describe('DELETE /api/recipes/:id/', () => {
    it('returns an error without a user token', (done) => {
      chai.request(server)
        .del(`/api/recipes/${testData.postedRecipeID}/`)
        .end((err, res) => {
          assert.equal(res.statusCode, 401);
          assert.include(res.body.error, 'please include user token');
          done();
        });
    });

    it('should return statusCode:400 for an invalid id', (done) => {
      chai.request(server)
        .del('/api/recipes/1/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.statusCode, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });

    it('should return statusCode:400 for an unexisting id', (done) => {
      chai.request(server)
        .del('/api/recipes/fb27eb9e-2fe8-41ec-836f-adb7b47b8dd4/')
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'one or more of the required request data is not included or is invalid');
          done();
        });
    });

    it('disallows non-author of a recipe to delete a recipe', (done) => {
      chai.request(server)
        .del(`/api/recipes/${testData.postedRecipeID}/`)
        .set('authorization', `Bearer ${testData.altUserToken}`)
        .end((err, res) => {
          assert.equal(res.status, 403);
          assert.exists(res.body.error);
          done();
        });
    });

    it('should return 200 for a valid and existing id', (done) => {
      chai.request(server)
        .del(`/api/recipes/${testData.postedRecipeID}/`)
        .set('authorization', `Bearer ${testData.userAuthToken}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.exists(res.body.message);
          done();
        });
    });
  });
});
