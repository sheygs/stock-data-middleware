import server from '../src/index';
import request from 'supertest';
import nock from 'nock';

import TickerCompanyDetails from './ticker_company_details.json';
import TickerOpenClose from './stock_ticker_open_close.json';
import { config } from '../src/config/envConfig';

describe('Stock Ticker Company Details', () => {
        test("Should get details for a ticker symbol's company", async () => {
                nock(config.BASE_URL, {
                        reqheaders: {
                                Authorization: `Bearer ${config.API_KEY}`,
                        },
                })
                        .get('/v1/meta/symbols/AAPL/company')
                        .reply(200, TickerCompanyDetails);

                const response = await request(server).get('/api/v1/auth/ticker/AAPL').expect(200);

                expect(response.statusCode).toEqual(200);
                expect(response.body).toStrictEqual({
                        data: TickerCompanyDetails,
                });
        });
});

describe('Stock Ticker Previous Close', () => {
        test("Should get the previous day's open, high, low, and close (OHLC) for the specified stock ticker.", async () => {
                nock(config.BASE_URL, {
                        reqheaders: {
                                Authorization: `Bearer ${config.API_KEY}`,
                        },
                })
                        .get('/v2/aggs/ticker/AAPL/prev')
                        .query({
                                adjusted: true,
                        })
                        .reply(200, TickerOpenClose);

                const response = await request(server).get('/api/v1/auth/ticker/AAPL/prev');
                expect(response.statusCode).toEqual(200);
                expect(response.body).toStrictEqual({
                        data: TickerOpenClose,
                });
        });
});

afterAll(() => {
        server.close();
});
