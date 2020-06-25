import { get } from 'axios';

class CurrencyAPI {
  constructor(url, path) {
    this.url = url;
    this.path = path;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      get(`${this.url}${this.path}`)
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

export { CurrencyAPI };
