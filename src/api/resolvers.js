import { CurrencyConverter } from './../services/currency';
import { TransferProValueCrawler } from './../services/crawler';

export default {
  Query: {
    async getTransferProPlan(_, { sourceUrl }) {
      if (sourceUrl != 'https://www.smartmei.com.br') {
        throw new Error('Please, send a valid smartmei url');
      }
      const crawlerData = await new TransferProValueCrawler(
        sourceUrl,
        2000,
        3
      ).getData();
      console.log(`Crawler data: ${JSON.stringify(crawlerData)}`);
      const currencyConverter = await new CurrencyConverter('BRL');
      const currencyData = currencyConverter.getConvertedData(
        crawlerData.value
      );
      return {
        datetime: (await crawlerData).datetime,
        description: crawlerData.description,
        BRL: currencyData.BRL,
        EUR: currencyData.EUR,
        USD: currencyData.USD,
      };
    },
  },
};
