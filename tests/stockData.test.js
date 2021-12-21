import server from '../src/index';
import request from 'supertest';
import nock from 'nock';

import StockPrevClose from './ticker_prev_close.json';
import TickerCompanyDetails from './ticker_company_details.json';
import StockDailyOpenClose from './stock_daily_open_close.json';
import { config } from '../src/config/envConfig';

describe('Stock Ticker Company Details', () => {
        test("Should get details for a ticker symbol's company", async () => {
                nock(config.BASE_URL, {
                        reqheaders: {
                                Authorization: `Bearer ${config.API_KEY}`,
                        },
                })
                        .get('/v1/meta/symbols/AAPL/company')
                        .query({})
                        .reply(200, TickerCompanyDetails);

                const response = await request(server).get('/api/v1/auth/ticker/AAPL').expect(200);

                console.log(response);

                expect(response.statusCode).toEqual(200);
                expect(response.body).toStrictEqual({
                        status: 'success',
                        message: 'Stock ticker details retrieved',
                        data: TickerCompanyDetails,
                });
        });
});

describe('Stock Ticker Previous Close', () => {
        test("Should get the previous day's open, high, low, and close for the specified stock ticker.", async () => {
                nock(config.BASE_URL, {
                        reqheaders: {
                                Authorization: `Bearer ${config.API_KEY}`,
                        },
                })
                        .get('/v2/aggs/ticker/AAPL/prev')
                        .query({
                                adjusted: false,
                        })
                        .reply(200, StockPrevClose);

                const response = await request(server)
                        .get('/api/v1/auth/ticker/AAPL/prev')
                        .expect(200);
                expect(response.statusCode).toEqual(200);
                expect(response.body).toStrictEqual({
                        status: 'success',
                        message: 'Previous close stocks retrieved',
                        data: StockPrevClose,
                });
        });
});

describe('Stock Ticker Daily Open/Close', () => {
        test('Should get the open, close and afterhours prices of a stock symbol on a certain date.', async () => {
                nock(config.BASE_URL, {
                        reqheaders: {
                                Authorization: `Bearer ${config.API_KEY}`,
                        },
                })
                        .get('/v1/open-close/AAPL/2020-10-14')
                        .query({
                                adjusted: false,
                        })
                        .reply(200, StockDailyOpenClose);

                const response = await request(server)
                        .get('/api/v1/auth/open-close/AAPL/2020-10-14')
                        .expect(200);
                expect(response.statusCode).toEqual(200);
                expect(response.body).toStrictEqual({
                        status: 'success',
                        message: 'Stock prices retrieved',
                        data: StockDailyOpenClose,
                });
        });
});

afterAll(() => {
        server.close();
});
