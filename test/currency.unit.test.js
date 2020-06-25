import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import { stub, mock } from 'sinon';
import axios from 'axios';
import { CurrencyAPI, CurrencyConverter } from './../src/services/currency';

describe('CurrencyAPI', () => {
  afterEach(function () {
    if (axios.get.restore) {
      axios.get.restore();
    }
  });

  it('should create currency api instance', () => {
    const cur_api = new CurrencyAPI(
      'https://someapi.com',
      '/foo',
      'BRL',
      'USD,EUR'
    );
    assert.equal(cur_api.url, 'https://someapi.com');
    assert.equal(cur_api.path, '/foo');
    assert.equal(cur_api.base, 'BRL');
    assert.equal(cur_api.symbols, 'USD,EUR');
  });

  it('should mount url correctly', async () => {
    const cur_api = new CurrencyAPI(
      'https://someapi.com',
      '/foo',
      'BRL',
      'USD,EUR'
    );
    const stubData = {
      data: { rates: { USD: 0.99, EUR: 0.99 } },
    };
    const mockGet = mock(axios);
    mockGet
      .expects('get')
      .withArgs('https://someapi.com/foo?symbols=USD,EUR&base=BRL')
      .resolves(stubData);
    await cur_api.fetch();
    mockGet.verify();
  });

  it('should return currency data received from api', async () => {
    const cur_api = new CurrencyAPI(
      'https://someapi.com',
      '/foo',
      'BRL',
      'USD,EUR'
    );
    const stubData = {
      data: { rates: { USD: 0.99, EUR: 0.99 } },
    };
    stub(axios, 'get').resolves(stubData);
    const data = await cur_api.fetch();
    assert.deepEqual(data, stubData.data.rates);
  });
});

describe('CurrencyConverter', () => {
  afterEach(function () {
    if (axios.get.restore) {
      axios.get.restore();
    }
  });

  it('should get currency values from BRL base and USD,EUR symbols', async () => {
    const stubData = {
      data: { rates: { USD: 1.99, EUR: 1.99 } },
    };
    stub(axios, 'get').resolves(stubData);
    const cur_converter = await new CurrencyConverter();
    assert.deepEqual(cur_converter.currency, stubData.data.rates);
  });

  it('should convert from BRL for USD,EUS symbols', async () => {
    const stubData = {
      data: { rates: { USD: 0.1930779501, EUR: 0.1711683955 } },
    };
    stub(axios, 'get').resolves(stubData);
    const cur_converter = await new CurrencyConverter('BRL');
    const convertedValues = cur_converter.convertFromBase(7.0);
    assert.equal(convertedValues.USD, 1.35);
    assert.equal(convertedValues.EUR, 1.2);
  });

  it('should make money conversion', async () => {
    const stubData = {
      data: { rates: { USD: 1.99, EUR: 1.99 } },
    };
    stub(axios, 'get').resolves(stubData);
    const cur_converter = await new CurrencyConverter('BRL');
    const value_converted = cur_converter.convert(7.78, 0.1930779501);
    assert.equal(value_converted, 1.5);
  });

  it('should make money format', async () => {
    const stubData = {
      data: { rates: { USD: 1.99, EUR: 1.99 } },
    };
    stub(axios, 'get').resolves(stubData);
    const cur_converter = await new CurrencyConverter('BRL');
    const value_converted = cur_converter.convert(7.78, 0.1930779501);
    let value_formated_usd = cur_converter.format(value_converted, 'USD');
    assert.equal(value_formated_usd, '$1.50');
  });

  it('should get converted data', async () => {
    const stubData = {
      data: { rates: { USD: 0.1930779501, EUR: 0.1711683955 } },
    };
    stub(axios, 'get').resolves(stubData);
    const cur_converter = await new CurrencyConverter('BRL');
    const data = cur_converter.getConvertedData(7.0);
    assert.isDefined(data.BRL);
    assert.isDefined(data.EUR);
    assert.isDefined(data.USD);
  });
});
