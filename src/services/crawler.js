import Crawler from 'crawler';
import { raw } from 'express';

class BaseCrawler {
  constructor(url, timeout, retries) {
    this.url = url;
    this.timeout = timeout;
    this.retries = retries;
  }

  async getData() {
    const rawData = await this.fetch();
    return this.parseData(rawData);
  }

  fetch() {
    return new Promise((resolve, reject) => {
      new Crawler({
        maxConnections: 1,
        retryTimeout: this.timeout,
        retries: this.retries,
        callback: function (error, response, done) {
          if (error) {
            reject(error);
          } else {
            resolve(response.$);
          }
          done();
        },
      }).queue(this.url);
    });
  }

  parseData() {
    throw new Error('You have to implement the method parseData!');
  }
}

class TransferProValueCrawler extends BaseCrawler {
  constructor(url, timeout, retries) {
    super(url, timeout, retries);
  }

  parseData(rawData) {
    return rawData('#tarifas-2').text();
  }
}

export { BaseCrawler, TransferProValueCrawler };
