import { describe, it } from 'mocha';
import { assert } from 'chai';
const request = require('supertest');
import app from './../src/app';

describe('API ', () => {
  it('should get transfer pro plan data', (done) => {
    request(app)
      .post('/graphql')
      .send({
        query:
          '{ getTransferProPlan(sourceUrl: "https://www.smartmei.com.br") { datetime, description, BRL, EUR, USD } }',
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        assert.isDefined(res.body.data.getTransferProPlan.datetime);
        assert.isDefined(res.body.data.getTransferProPlan.description);
        assert.isDefined(res.body.data.getTransferProPlan.BRL);
        assert.isDefined(res.body.data.getTransferProPlan.EUR);
        assert.isDefined(res.body.data.getTransferProPlan.USD);
        done();
      });
  });

  it('should receive bad request for invalid url', (done) => {
    request(app)
      .post('/graphql')
      .send({
        query:
          '{ getTransferProPlan(sourceUrl: "https://www.otheraddress.com") { datetime, description, BRL, EUR, USD } }',
      })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function (err, res) {
        assert.equal(
          JSON.parse(res.text).errors[0].message,
          'Please, send a valid smartmei url'
        );
        done();
      });
  });
});
