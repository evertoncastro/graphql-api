# Graphql-API for currency conversion from crawler data 💰🔍👩🏽‍💻

## Main dependencies

- crawler (for html crawler fetch)
- cheerio (for data extraction)
- currency.js (for currency conversion. *Used due simplicity. For production, there are better libs, like Dinero.js)
- https://exchangeratesapi.io API (to get EUR and USD tax conversion)

## Development

**Important**: requires node >= 12.16

### Running on localhost

---
with npm

```
npm install
npm run start
```

with yarn

```
yarn add all
yarn start
```

Browse playground at: http://localhost:8080/graphql

---

### Running with docker

### Tests

```
npm run test
or
yarn test
```

```
docker build -t application/graphql-api:0.1 .
docker run -it -p 4000:8080 application/graphql-api:0.1
```

Browse playground at: http://0.0.0.0:4000/graphql

---

## Sample

```
{
  getTransferProPlan(sourceUrl: "https://www.smartmei.com.br") {
    datetime
    description
    BRL
    EUR
    USD
  }
}
```

IMPORTANT: The sourceurl will work only with https://www.smartmei.com.br address.

## Improvements

- Create a fallback in case of currency external API downtime
- Send alerts to devops team in case of crawled target website changes
