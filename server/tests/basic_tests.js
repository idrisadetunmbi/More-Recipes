import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../bin/www';

const assert = chai.assert;
chai.use(chaiHttp);

// before((done) => {
//   console.log('mocha before hook runs successfully');
//   done();
// });

describe('API root path', () => {
  describe('GET /', () => {
    it('should return 200', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          assert.equal(res.statusCode, 200);
          done();
        });
    });
  });
});
