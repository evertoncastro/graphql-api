export default {
  Query: {
    getTransferProPlan(_, { sourceUrl }) {
      return {
        date: '2020-06-23',
        description: 'Fake info',
        brl_value: '0,00',
        usd_value: '0,00',
        eur_value: '0,00',
      };
    },
  },
};
