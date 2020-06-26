import Crawler from 'crawler';
import cheerio from 'cheerio';
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
    const rawTextObject = this.getRawDataText(rawData);
    return {
      ...this.parseText(rawTextObject),
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
    try {
      const taxElement = rawData('.tarifas-2-2-2');
      const parentHtml = taxElement.parent().html();
      const parentHtmlObj = cheerio.load(parentHtml);
      return {
        tax: taxElement.text(),
        description: parentHtmlObj('.cell-small-title').text(),
      };
    } catch (e) {
      console.log(e);
      //TODO: Send an alert to check possible site modification
      throw new Error('Issue traying to extract data');
    }
  }

  parseText(rawTextObject) {
    if (
      rawTextObject.tax.includes('R$') == false ||
      !rawTextObject.description
    ) {
      //TODO: Send an alert to check possible site modification
      throw new Error('Issue traying to extract data');
    }
    return {
      tax: currencyFormatter.unformat(rawTextObject.tax, { code: 'BRL' }),
      description: rawTextObject.description.trim(),
    };
  }
}

export { BaseCrawler, TransferProValueCrawler };
