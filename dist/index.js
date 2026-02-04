"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USPS = void 0;
const title_case_1 = require("./title-case");
class USPS {
    baseUrl;
    clientId;
    clientSecret;
    useTitleCase;
    accessToken = '';
    expiresAt = 0;
    constructor({ clientId = '', clientSecret = '', useTitleCase = false, environment = 'production', }) {
        const productionUrl = 'https://apis.usps.com';
        const testingUrl = 'https://apis-tem.usps.com';
        if (!clientId || !clientSecret) {
            throw new Error('USPS clientId and clientSecret are required');
        }
        this.baseUrl = environment === 'production'
            ? productionUrl
            : testingUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.useTitleCase = useTitleCase;
    }
    async getAccessToken() {
        const body = {
            grant_type: 'client_credentials',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            response_type: 'code',
            scope: 'addresses',
        };
        const response = await fetch(`${this.baseUrl}/oauth2/v3/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = (await response.json());
        if (!data.access_token || !data.expires_in) {
            throw new Error('Failed to get access token from USPS');
        }
        this.accessToken = data.access_token;
        this.expiresAt = data.issued_at + data.expires_in * 1000;
    }
    async authorize() {
        if (this.accessToken && this.expiresAt - Date.now() > 60000)
            return; // 1 minute before expiration
        await this.getAccessToken();
    }
    async getAddress(params) {
        await this.authorize();
        const query = new URLSearchParams(params);
        const response = await fetch(`${this.baseUrl}/addresses/v3/address?${query}`, {
            headers: { Authorization: `Bearer ${this.accessToken}` },
        });
        const data = (await response.json());
        if (data.error)
            return data;
        if (this.useTitleCase) {
            data.address.streetAddress = (0, title_case_1.titleCase)(data.address.streetAddress);
            data.address.streetAddressAbbreviation = (0, title_case_1.titleCase)(data.address.streetAddressAbbreviation);
            data.address.secondaryAddress = (0, title_case_1.titleCase)(data.address.secondaryAddress);
            data.address.cityAbbreviation = (0, title_case_1.titleCase)(data.address.cityAbbreviation);
            data.address.city = (0, title_case_1.titleCase)(data.address.city);
        }
        return data;
    }
    async getCityState(params) {
        await this.authorize();
        const query = new URLSearchParams(params);
        const response = await fetch(`${this.baseUrl}/addresses/v3/city-state?${query}`, {
            headers: { Authorization: `Bearer ${this.accessToken}` },
        });
        const data = (await response.json());
        if (data.error)
            return data;
        if (this.useTitleCase) {
            data.city = (0, title_case_1.titleCase)(data.city);
        }
        return data;
    }
}
exports.USPS = USPS;
