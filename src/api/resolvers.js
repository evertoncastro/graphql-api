import { CurrencyConverter } from './../services/currency';

export default {
  Query: {
    async getTransferProPlan(_, { sourceUrl }) {
      if (sourceUrl != 'https://www.smartmei.com.br') {
        throw new Error('Please, send a valid smartmei url');
      }
      const crawlerData = {
        value: 7.0,
        description: 'Fake info',
        date: '2020-06-25 19:25:56',
      };
      const currencyConverter = await new CurrencyConverter('BRL');
      const currencyData = currencyConverter.getConvertedData(
        crawlerData.value
      );
      return {
        date: crawlerData.date,
        description: crawlerData.description,
        BRL: currencyData.BRL,
        EUR: currencyData.EUR,
        USD: currencyData.USD,
      };
    },
  },
};
