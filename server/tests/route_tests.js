import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../bin/www';
import RecipeServices from '../services/RecipesService';
import Recipe from '../models/recipe';
import recipeSeeders from '../seeders/recipes.json';

const { assert } = chai;
chai.use(chaiHttp);

before((done) => {
  recipeSeeders.recipes.slice(0, -1).forEach((recipe) => {
    RecipeServices.addRecipe(recipe);
  });
  console.log('last item', recipeSeeders.recipes.slice(-1));
  done();
});

describe('More-Recipes API', () => {
  describe('App root path', () => {
    describe('GET /', () => {
      it('should return 200', (done) => {
        chai.request(server)
          .get('/')
          .end((err, res) => {
            assert.equal(res.statusCode, 200);
            done();
          });
      });
  
      it('should return 404 for a non-existing path - /404path', (done) => {
        chai.request(server)
          .get('/404path')
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });
    });
  });

  describe('API root path', () => {
    describe('GET /api/', () => {
      it('should return 200', (done) => {
        chai.request(server)
          .get('/api/')
          .end((err, res) => {
            assert.equal(res.statusCode, 200);
            done();
          });
      });
  
      it('should return 404 for a non-existing path - /404path', (done) => {
        chai.request(server)
          .get('/api/404path/')
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });

      it('should return 404 for an unsupported method - POST to /api', (done) => {
        chai.request(server)
          .post('/api')
          .end((err, res) => {
            assert.equal(res.statusCode, 404);
            done();
          });
      });
    });
  });

  describe('Recipes routes', () => {
    let postedRecipeID;

    describe('GET /api/recipes', () => {
      it('should return 200', (done) => {
        chai.request(server)
          .get('/api/recipes/')
          .end((err, res) => {
            assert.equal(res.statusCode, 200);
            done();
          });
      });
  
      it('has a response object that contains a data property', (done) => {
        chai.request(server)
          .get('/api/recipes/')
          .end((err, res) => {
            console.log(res.body.data);
            assert.exists(res.body.data);
            done();
          });
      });
    });

    describe('POST /api/recipes', () => {
      it('should return 422 with empty data input', (done) => {
        chai.request(server)
          .post('/api/recipes')
          .end((err, res) => {
            assert.equal(res.statusCode, 422);
            done();
          });
      });
      it('should return 201 for a full recipe request data', (done) => {
        chai.request(server)
          .post('/api/recipes')
          .type('form')
          .send(recipeSeeders.recipes.slice(-1)[0])
          .end((err, res) => {
            assert.equal(res.status, 201);
            postedRecipeID = res.body.data.id;
            done();
          });
      });
    });

    describe('GET /api/recipes/:id/', () => {
      it('should return 422 for an invalid id', (done) => {
        chai.request(server)
          .get('/api/recipes/1/')
          .end((err, res) => {
            assert.equal(res.statusCode, 422);
            done();
          });
      });
      it('should return 404 for an unexisting id', (done) => {
        chai.request(server)
          .get('/api/recipes/fb27eb9e-2fe8-41ec-836f-adb7b47b8dd4/')
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });
      it('should return 200 for a valid and existing id', (done) => {
        chai.request(server)
          .get(`/api/recipes/${postedRecipeID}/`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
      it('returns a response with a data property on the body', (done) => {
        chai.request(server)
          .get(`/api/recipes/${postedRecipeID}/`)
          .end((err, res) => {
            assert.exists(res.body.data);
            done();
          });
      });
    });
    describe('PUT /api/recipes/:id/', () => {
      it('should return 422 for an invalid id', (done) => {
        chai.request(server)
          .put('/api/recipes/1/')
          .end((err, res) => {
            assert.equal(res.statusCode, 422);
            done();
          });
      });
      it('should return 404 for an unexisting id', (done) => {
        chai.request(server)
          .put('/api/recipes/fb27eb9e-2fe8-41ec-836f-adb7b47b8dd4/')
          .type('form')
          .send({
            title: 'A great recipe',
          })
          .end((err, res) => {
            assert.equal(res.status, 404);
            done();
          });
      });
      it('should return 400 for an empty title', (done) => {
        chai.request(server)
          .put(`/api/recipes/${postedRecipeID}/`)
          .type('form')
          .send({
            title: '',
          })
          .end((err, res) => {
            assert.equal(res.status, 422);
            done();
          });
      });
      it('returns 400 for an empty request body', (done) => {
        chai.request(server)
          .put(`/api/recipes/${postedRecipeID}/`)
          .type('form')
          .send({

          })
          .end((err, res) => {
            assert.equal(res.status, 400);
            done();
          });
      });
      it('returns 200 for a request with the right data test', (done) => {
        chai.request(server)
          .put(`/api/recipes/${postedRecipeID}/`)
          .type('form')
          .send({
            title: 'A great recipe',
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });
  });
});
