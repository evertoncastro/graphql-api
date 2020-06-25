import { CurrencyConverter } from './../services/currency';

export default {
  Query: {
    async getTransferProPlan(_, { sourceUrl }) {
      const valueFromCrawler = 7;
      const currencyConverter = await new CurrencyConverter('BRL');
      const currencyData = currencyConverter.getConvertedData(valueFromCrawler);
      return {
        date: '2020-06-23',
        description: 'Fake info',
        BRL: currencyData.BRL,
        EUR: currencyData.EUR,
        USD: currencyData.USD,
      };
    },
  },
};
