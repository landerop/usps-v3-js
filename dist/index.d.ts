type GetAddressParams = {
    firm?: string;
    streetAddress: string;
    secondaryAddress?: string;
    city?: string;
    state: string;
    urbanization?: string;
    ZIPCode?: string;
    ZIPPlus4?: string;
};
type GetCityStateParams = {
    ZIPCode: string;
};
type AddressResponseError = {
    message: string;
    [key: string]: string;
};
type AddressResponse = {
    firm: string;
    address: Record<string, string>;
    additionalInfo: Record<string, string>;
    error?: AddressResponseError;
    [key: string]: string | Record<string, string> | undefined;
};
type CityStateResponse = {
    city: string;
    state: string;
    ZIPCode: string;
    error?: AddressResponseError;
    [key: string]: string | Record<string, string> | undefined;
};
export declare class USPS {
    readonly baseUrl: string;
    readonly clientId: string;
    readonly clientSecret: string;
    readonly useTitleCase: boolean;
    private accessToken;
    private expiresAt;
    constructor({ clientId, clientSecret, useTitleCase, environment, }: {
        clientId?: string;
        clientSecret?: string;
        useTitleCase?: boolean;
        environment?: 'production' | 'testing';
    });
    private getAccessToken;
    private authorize;
    getAddress(params: GetAddressParams): Promise<AddressResponse>;
    getCityState(params: GetCityStateParams): Promise<CityStateResponse>;
}
export {};
