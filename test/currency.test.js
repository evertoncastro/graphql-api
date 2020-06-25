import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
import { stub, spy } from 'sinon';
import axios from 'axios';
import { CurrencyAPI } from './../src/services/currency';

describe('CurrencyAPI', () => {
  it('should create currency api instance', () => {
    const cur_api = new CurrencyAPI('https://someapi.com', '/?foo=bar');
    assert.equal(cur_api.url, 'https://someapi.com');
    assert.equal(cur_api.path, '/?foo=bar');
  });

  it('should return currency data received from api', async () => {
    const cur_api = new CurrencyAPI('https://someapi.com', '/?foo=bar');
    const stubData = {
      data: { rates: { USD: 0.99, EUR: 0.99 } },
    };
    stub(axios, 'get').resolves(stubData);
    const data = await cur_api.fetch();
    assert.deepEqual(data, stubData.data.rates);
  });
});
