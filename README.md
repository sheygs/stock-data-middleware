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

### Rename _.env.sample_ to _.env_

```bash
 API_KEY=XXXXXXXXXXXXXXX
 BASE_URL=XXXXXXXXXXXXXX
 PORT=3000
 DEV_DB_URL=postgresql://user:password@host:port/dataBase
```

### Installation 📦

```bash
   $ git clone `https://github.com/sheygs13/stock-data-middleware.git`
   $ cd stock-data-middleware
   $ npm install
```

### Start App

```bash
   $ npm run start
```

### Test

```bash
   $ npm run test
```

### Available Endpoints

`/api/v1/auth`

| Method | Route                              | Parameter/Query                               | Authentication | Brief Description        |
| ------ | ---------------------------------- | --------------------------------------------- | -------------- | ------------------------ |
| GET    | /stocks/agg                        | ticker,from,to                                | YES            | Get Aggregates (Bars)    |
| GET    | /stocks                            | page, limit,cost, percentPer, gain/loss, name | YES            | Get Grouped Daily (Bars) |
| GET    | /open-close/:ticker/:date          | ticker, date                                  | YES            | Get Daily Open/Close     |
| GET    | /ticker/:ticker/prev               | ticker                                        | YES            | Get Previous Close       |
| GET    | /ticker/:ticker                    | ticker                                        | YES            | Get Ticker Details       |
| GET    | /stocks/report/:startDate/:endDate | startDate, endDate                            | NO             | Get Stock Report         |

### API Documentation

The API uses the `/api/v1/auth` endpoint for accessing the Stock Routes. The endpoint works with only the `GET` HTTP verb.

#### GET /stocks/agg

- `Description:` Get aggregate bars for a stock over a given date range.
- Queries: `ticker`,`from`, `to`
- Query Description:

```x-form-url-endcoded
   ticker - Stock Ticker (required)
   from - StartDate (required)
   to - EndDate (required)
```

- API REQUEST FORMAT:

```x-form-url-encoded
 {{BASE_URL}}/api/v1/auth/stocks/agg?ticker=AAPL&from=2021-11-03&to=2021-12-04
```

#### HTTP Response

- HTTP Status: `200: success`
- JSON data

```json
{
    "status": "success",
    "data": {
        "ticker": "AAPL",
        "queryCount": 12,
        "resultsCount": 12,
        "adjusted": false,
        "results": [
            {
                "v": 54511532,
                "vw": 150.9171,
                "o": 150.39,
                "c": 151.49,
                "h": 151.97,
                "l": 149.82,
                "t": 1635912000000,
                "n": 399115
            }
            ....
    }    ]
}
```

#### GET /stocks

- `Description:` Get the daily open, high, low, and close (OHLC) for the entire stocks.
- Queries: `page`, `limit`,`cost`, `percentPer`, `gain`, `name`
- Query Description:

```x-form-url-endcoded
   page (default - 1) - Current Page (optional)
   limit (default - 10) - Result per Page (optional)
   cost - Cost (optional)
   percentPer  - Percent Performance (optional)
   gain - Gain (optional)
   loss - Loss (optional)
   name  - Stock Ticker (optional)
```

- API REQUEST FORMAT:

```x-form-url-encoded
 {{BASE_URL}}/api/v1/auth/stocks?page=2&limit=10&percentPer[lte]=1&gain[lte]=1
```

#### HTTP Response

- HTTP Status: `200: success`
- JSON data

```json
[
   {
      "status": "success",
      "data": [
        {
            "c": 27.51,
            "o": 27.43,
            "T": "OAKpA",
            "v": 2796,
            "vw": 27.679,
            "h": 27.71,
            "l": 27.43,
            "t": 1602705600000,
            "n": 62,
            "g": "0.08",
            "p": "0.29"
        }
        ...
      ]
   }
]
```

#### GET /open-close/:ticker/:date

- `Description:` Get the daily open, high, low, and close (OHLC) for the entire stocks.
- Parameters: `ticker`, `date`
- Parameters Description:

```x-form-url-endcoded
   ticker  - Stock Ticker (required)
   date  - Date (required)
```

- API REQUEST FORMAT:

```x-form-url-encoded
 {{BASE_URL}}/api/v1/auth/open-close/BB/2021-12-09
```

#### HTTP Response

- HTTP Status: `200: success`
- JSON data

```json
[
        {
                "status": "success",
                "data": {
                        "status": "OK",
                        "from": "2021-12-09",
                        "symbol": "BB",
                        "open": 9.2,
                        "high": 9.33,
                        "low": 8.935,
                        "close": 9.01,
                        "volume": 4532465,
                        "afterHours": 9.02,
                        "preMarket": 9.29
                }
        }
]
```

#### GET /ticker/:ticker/prev

- `Description:` Get the previous day's open, high, low, and close (OHLC) for the specified stock ticker.
- Parameter: `ticker`
- Parameter Description:

```x-form-url-endcoded
   ticker  - Stock Ticker (required)
```

- API REQUEST FORMAT:

```x-form-url-encoded
 {{BASE_URL}}/api/v1/auth/ticker/BB/prev
```

#### HTTP Response

- HTTP Status: `200: success`
- JSON data

```json
[
        {
                "status": "success",
                "data": {
                        "ticker": "BB",
                        "queryCount": 1,
                        "resultsCount": 1,
                        "adjusted": false,
                        "results": [
                                {
                                        "T": "BB",
                                        "v": 15904371,
                                        "vw": 8.7323,
                                        "o": 8.91,
                                        "c": 8.93,
                                        "h": 9.07,
                                        "l": 8.42,
                                        "t": 1639602000000,
                                        "n": 66766
                                }
                        ],
                        "status": "OK",
                        "request_id": "8126410c6026499e4ba2992a972e73a6",
                        "count": 1
                }
        }
]
```

#### GET /ticker/:ticker

- `Description:` Get details for a ticker symbol's company.
- Parameter: `ticker`
- Parameter Description:

```x-form-url-endcoded
   ticker  - Stock Ticker (required)
```

- API REQUEST FORMAT:

```x-form-url-encoded
 {{BASE_URL}}/api/v1/auth/ticker/AAPL
```

#### HTTP Response

- HTTP Status: `200: success`
- JSON data

```json
[
        {
                "status": "success",
                "data": {
                        "logo": "https://s3.polygon.io/logos/aapl/logo.png",
                        "listdate": "1990-01-02",
                        "cik": "320193",
                        "bloomberg": "EQ0010169500001000",
                        "figi": null,
                        "lei": "HWUPKR0MPOU8FGXBT394",
                        "sic": 3571,
                        "country": "usa",
                        "industry": "Computer Hardware",
                        "sector": "Technology",
                        "marketcap": 908316631180,
                        "employees": 123000,
                         ...
                }
        }
]
```

#### GET /stocks/report/:startDate/:endDate

- `Description:` Get Stock Entity Report.
- Parameter: `startDate`, `endDate`
- Parameter Description:

```x-form-url-endcoded
   startDate  - (required)
   endDate  - (required)
```

- API REQUEST FORMAT:

```x-form-url-encoded
 {{BASE_URL}}/api/v1/auth/stocks/report/:startDate/:endDate
```

#### HTTP Response

- HTTP Status: `200: success`
- JSON data

```json
[
        {
                "status": "success",
                "data": [
                        {
                                "tickername": "OAKpA",
                                "gain": "0.08",
                                "loss": "-0.08",
                                "cost": "27.51",
                                "percentperf": "0.29",
                                "createdat": "2021-12-15T23:00:00.000Z",
                                "timestamp": "1602705600000"
                        },
                        {
                                "tickername": "GIK",
                                "gain": "0.03",
                                "loss": "-0.03",
                                "cost": "10.02",
                                "percentperf": "0.30",
                                "createdat": "2021-12-15T23:00:00.000Z",
                                "timestamp": "1602705600000"
                        },
                        {
                                "tickername": "EQ",
                                "gain": "-0.02",
                                "loss": "0.02",
                                "cost": "6.12",
                                "percentperf": "-0.33",
                                "createdat": "2021-12-15T23:00:00.000Z",
                                "timestamp": "1602705600000"
                        }
                ]
        }
]
```
