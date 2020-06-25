import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import { stub, spy } from 'sinon';
import {
  BaseCrawler,
  TransferProValueCrawler,
} from './../src/services/crawler';

describe('BaseCrawler class', () => {
  it('should reject promise for invalid url on fetch', function (done) {
    let crl = new BaseCrawler('https://someinvalidaddress/', 1000, 1);
    crl
      .fetch()
      .then(() => {
        done(new Error('Expected method to reject.'));
      })
      .catch((err) => {
        assert.isDefined(err);
        done();
      });
  });

  it('should fetch data for valid url on fetch', function (done) {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    crl.fetch().then((data) => {
      assert.isDefined(data);
      done();
    });
  });

  it('should receive error for abtract parseData', function () {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    expect(() => crl.parseData({})).to.throw(
      'You have to implement the method parseData!'
    );
  });

  it('should call parseData after server response', async function () {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    crl.parseData = spy();
    stub(crl, 'fetch').returns('foo bar');
    await crl.getData();
    expect(crl.parseData.calledOnce).to.be.true;
    expect(crl.parseData.firstCall.args[0]).to.equal('foo bar');
  });
});

describe('TransferProValueCrawler class', () => {
  it('should extract data received from url server', async function () {
    let crl = new TransferProValueCrawler(
      'https://www.smartmei.com.br',
      1000,
      1
    );
    const data = await crl.getData();
  });
});
