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

  it('should receive error for abtract getRawDataText', function () {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    expect(() => crl.getRawDataText({})).to.throw(
      'You have to implement the method getRawDataText!'
    );
  });

  it('should receive error for abtract parseText', function () {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    expect(() => crl.parseText({})).to.throw(
      'You have to implement the method parseText!'
    );
  });

  it('should call getRawDataText after server response', async function () {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    crl.getRawDataText = spy();
    stub(crl, 'fetch').returns('foo bar');
    stub(crl, 'parseText');
    await crl.getData();
    expect(crl.getRawDataText.calledOnce).to.be.true;
    expect(crl.getRawDataText.firstCall.args[0]).to.equal('foo bar');
  });

  it('should call parseText after server response', async function () {
    let crl = new BaseCrawler('https://www.google.com/', 1000, 1);
    crl.parseText = spy();
    stub(crl, 'fetch').returns('foo bar');
    stub(crl, 'getRawDataText').returns('Fake value');
    await crl.getData();
    expect(crl.parseText.calledOnce).to.be.true;
    expect(crl.parseText.firstCall.args[0]).to.equal('Fake value');
  });
});

describe('TransferProValueCrawler class', () => {
  it('should parse raw currency text', function () {
    let crl = new TransferProValueCrawler('https://someurl.com', 1000, 1);
    const data = crl.parseText('R$ 9,15');
    assert.equal(data, 9.15);
  });

  it('should throw error for unexpected data pattern', function () {
    let crl = new TransferProValueCrawler('https://someurl.com', 1000, 1);
    expect(() => crl.parseText('9,15')).to.throw(
      'Issue traying to extract data'
    );
  });

  it('should return value, description and datetime', async function () {
    let crl = new TransferProValueCrawler('https://someurl.com', 1000, 1);
    stub(crl, 'fetch').resolves({});
    stub(crl, 'getRawDataText').returns({});
    stub(crl, 'parseText').returns(10);
    const data = await crl.getData();
    assert.equal(data.value, 10);
    assert.equal(data.description, '');
    assert.isDefined(data.datetime);
  });
});
