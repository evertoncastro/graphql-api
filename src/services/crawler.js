import Crawler from 'crawler';
import currencyFormatter from 'currency-formatter';
import Moment from 'moment-timezone';

class BaseCrawler {
  constructor(url, timeout, retries) {
    this.url = url;
    this.timeout = timeout;
    this.retries = retries;
  }

  async getData() {
    const rawData = await this.fetch();
    const rawText = this.getRawDataText(rawData);
    return {
      value: this.parseText(rawText),
      description: '',
      datetime: Moment().tz('America/Sao_Paulo').format(),
    };
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
        jQuery: {
          name: 'cheerio',
          options: {
            normalizeWhitespace: true,
            xmlMode: true,
          },
        },
      }).queue(this.url);
    });
  }

  getRawDataText() {
    throw new Error('You have to implement the method getRawDataText!');
  }

  parseText() {
    throw new Error('You have to implement the method parseText!');
  }
}

class TransferProValueCrawler extends BaseCrawler {
  constructor(url, timeout, retries) {
    super(url, timeout, retries);
  }

  getRawDataText(rawData) {
    const value = rawData('.tarifas-2-2-2').text();
    return value;
  }

  parseText(rawText) {
    if (rawText.includes('R$') == false) {
      //TODO: Send an alert to check possible site modification
      throw new Error('Issue traying to extract data');
    }
    return currencyFormatter.unformat(rawText, { code: 'BRL' });
  }
}

export { BaseCrawler, TransferProValueCrawler };
