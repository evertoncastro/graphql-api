import { get } from 'axios';
import currency from 'currency.js';
import currencyFormatter from 'currency-formatter';

class CurrencyAPI {
  constructor(url, path, base, symbols) {
    this.url = url;
    this.path = path;
    this.base = base;
    this.symbols = symbols;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      get(`${this.url}${this.path}?symbols=${this.symbols}&base=${this.base}`)
        .then((response) => {
          resolve(this.parse(response.data));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  parse(rawData) {
    return rawData.rates;
  }
}

class CurrencyConverter {
  constructor(baseConvertion) {
    return (async () => {
      this.baseConvertion = baseConvertion;
      this.currency = await new CurrencyAPI(
        'https://api.exchangeratesapi.io',
        '/latest',
        baseConvertion,
        'USD,EUR'
      ).fetch();
      return this;
    })();
  }

  getConvertedData(value) {
    let result = {};
    const convertedData = this.convertFromBase(value);
    Object.keys(convertedData).forEach((element) => {
      result[element] = this.format(convertedData[element], element);
    });
    result[this.baseConvertion] = this.format(value, this.baseConvertion);
    return result;
  }

  convertFromBase(value) {
    let result = {};
    Object.keys(this.currency).forEach((element) => {
      const convertedValue = this.convert(value, this.currency[element]);
      result[element] = convertedValue;
    });
    return result;
  }

  convert(value, rate) {
    return currency(value).multiply(rate).value;
  }

  format(value, code) {
    return currencyFormatter.format(value, { code });
  }
}

export { CurrencyAPI, CurrencyConverter };
