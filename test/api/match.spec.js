const _ = require('lodash');
const server = require('../../src/server');
const { User, Player, Match } = require('../../src/models');
const data = require('../util/data');

let token, user, player3;

describe('Matches API', () => {

  before(async () => {
    await User.remove({});
    await Player.remove({});
    const res = await chai.request(server)
      .post('/api/user')
      .send(data.user);
    token = res.body.token;
    user = res.body.user;
    data.player.created_by = user.id;
    data.player2.created_by = user.id;
    data.player3.created_by = user.id + '_';
    data.match.created_by = user.id;

    await Player.create(data.player)
      .then(player => {
        data.match.player_one = player.id;
        data.match.winner = player.id;
      });

    await Player.create(data.player2)
      .then(player => {
        data.match.player_two = player.id;
        data.match.loser = player.id;
      });
    await Player.create(data.player3)
      .then(player => {
        player3 = player;
      });
  });

  describe('POST /api/matches', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    it('should create match if successful', done => {
      let match = data.match;
      match.player_two = player3._id;
      match.loser = player3._id;

      chai.request(server)
        .post('/api/matches')
        .send(match)
        .set('Authorization', `Bearer ${ token }`)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success).to.be.true;
          expect(res.body.match).to.be.a('object');
          done();
        });
    });

    it('should fail if token not provided', done => {
      chai.request(server)
        .post('/api/matches')
        .send(data.match)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    ['player_one', 'player_one_score', 'player_two', 'player_two_score', 'winner', 'loser'].forEach(field => {
      it(`should fail if ${ field } not present`, done => {
        chai.request(server)
          .post('/api/matches')
          .send(_.omit(data.match, field))
          .set('Authorization', `Bearer ${ token }`)
          .end(err => {
            expect(err).to.exist;
            expect(err.status).to.equal(409);
            done();
          });
      });
    });

    it('should fail if player one is the same as player two', done => {
      let match = data.match;
      match.player_two = match.player_one;
      chai.request(server)
        .post('/api/matches')
        .send(match)
        .set('Authorization', `Bearer ${ token }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(409);
          done();
        });
    });

    it('should fail if player one and player two are from the same creator', done => {
      chai.request(server)
        .post('/api/matches')
        .send(data.match)
        .set('Authorization', `Bearer ${ token }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(409);
          done();
        });
    });

    it('should fail if winner is neither player one or player two', done => {
      let match = data.match;
      match.winner = 'sample';
      chai.request(server)
        .post('/api/matches')
        .send(match)
        .set('Authorization', `Bearer ${ token }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(409);
          done();
        });
    });

    it('should fail if loser is neither player one or player two', done => {
      let match = data.match;
      match.loser = 'sample';
      chai.request(server)
        .post('/api/matches')
        .send(match)
        .set('Authorization', `Bearer ${ token }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(409);
          done();
        });
    });

    it('should fail if winner and loser are the same', done => {
      let match = data.match;
      match.loser = match.winner;
      chai.request(server)
        .post('/api/matches')
        .send(match)
        .set('Authorization', `Bearer ${ token }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(409);
          done();
        });
    });


  });

  describe('GET /api/matches', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    it('should fail if token not provided', done => {
      chai.request(server)
        .get('/api/matches')
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    it('should deliver an empty array if no matches', async () => {
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/matches')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.matches).to.be.a('array');
      expect(res.body.matches.length).to.equal(0);
    });

    it('should deliver all matches', async () => {
      await Match.create(data.match);
      await Match.create(data.match);

      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/matches')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.matches).to.be.a('array');
      expect(res.body.matches.length).to.equal(2);

      res.body.matches.forEach(match => expect(match.id).to.be.a('string'));
    });
  });

  describe('DELETE /api/matches/:id', () => {
    beforeEach(async () => {
      await Player.remove({});
    });

    it('should fail if token not provided', done => {
      chai.request(server)
        .delete('/api/matches/1')
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    it('should fail if match does not exist', async () => {
      let res, error;
      try {
        res = await chai.request(server)
          .delete('/api/matches/1')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(res).not.to.exist;
      expect(error.status).to.equal(404);
    });

    it('should fail if match created by different user', async () => {
      const userRes = await chai.request(server)
        .post('/api/user')
        .send(Object.assign({}, data.user, { email: '__deletetest__@foo.com' }));

      let player = await Match.create(Object.assign({}, data.match, { created_by: userRes.body.user.id }));

      let res, error;
      try {
        res = await chai.request(server)
          .delete(`/api/matches/${ player.id }`)
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }
      expect(error).to.exist;
      expect(res).not.to.exist;
      expect(error.status).to.equal(404);
    });

    it('should remove the match if successful', async () => {
      let match = await Match.create(data.match);
      let res, error;
      try {
        res = await chai.request(server)
          .delete(`/api/matches/${ match.id }`)
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);

      match = await Match.findById(match.id);
      expect(match).not.to.exist;
    });
  });
});
