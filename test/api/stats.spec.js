const _ = require('lodash');
const server = require('../../src/server');
const { User, Player, Match, Stats } = require('../../src/models');
const data = require('../util/data');

let token, user, player3;

describe('Stats API', () => {

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
    data.player3.created_by = user.id;
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

    data.player_two = player3._id;
    data.loser = player3._id;

    await Match.create(data.match);
  });

  describe('GET /api/stats', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    it('should not fail if token not provided', done => {
      chai.request(server)
        .get('/api/stats')
        .end((err, res) => {
          expect(err).to.not.exist;
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should deliver all stats', async () => {
      await Match.create(data.match);
      await Match.create(data.match);

      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/stats')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.stats).to.be.a('array');

      res.body.stats.forEach(stats => expect(stats.id).to.be.a('string'));
    });
  });
});
