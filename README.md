  <p align="center">
    <h2>Stock-Data-Middleware</h2>
    <br>
    <p>A middleware service that exposes the <a href="http://polygon.io/">Polygon.io</a> Stock APIs</p>
  </p>

### Features

- Stock Data is available via an exposed API
- Stock Data can be filtered for name, cost, gain/loss and percentage performance
- Best 3 performing stocks are saved to the database daily
- Reporting API for saved stock entities with monthly and weekly groupings.

### Development Tools

- NodeJS/Express
- PostgresSQL
- Jest

### Requirements

- [API Key](http://api.polygon.io)
- [NodeJS](https://nodejs.org/en/download/)
- [Postman](https://www.postman.com/downloads/)
- [Git](https://git-scm.com/downloads)

### Installation 📦

```bash
   $ git clone `https://github.com/sheygs13/stock-data-middleware.git`
   $ cd stock-data-middleware
   $ npm install
```

### Rename _.env.sample_ to _.env_

```bash
 API_KEY=XXXXXXXXXXXXXXX
 BASE_URL=XXXXXXXXXXXXXX
 PORT=3000
 DEV_DB_URL=postgresql://user:password@host:port/dataBase
```

### Start App

```bash
   $ npm run start
```

### Test

```bash
   $ npm run start
```

### Available Endpoints

`/api/v1/auth`

| Method | Route                                                   | Parameters                                               | Auth |
| ------ | ------------------------------------------------------- | -------------------------------------------------------- | ---- |
| GET    | /ticker/:tickerId/range/:multiplier/:timespan/:from/:to | tickerId,multiplier,timespan,from,to,adjusted,sort,limit | YES  |
| GET    | /stocks/:date                                           | date, adjusted, page, limit                              | YES  |
| GET    | /open-close/:ticker/:date                               | ticker, date, adjusted                                   | YES  |
| GET    | /ticker/:ticker/prev                                    | ticker, adjusted                                         | YES  |
| GET    | /ticker/:tickerId                                       | tickerId                                                 | YES  |
