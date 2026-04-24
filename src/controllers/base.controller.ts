import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export class BaseController {
    protected readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    protected async get(endpoint: string): Promise<APIResponse> {
        const response = await this.request.get(endpoint);
        return response;
    }

    protected async post(endpoint: string, payload: unknown): Promise<APIResponse> {
        const response = await this.request.post(endpoint, { data: payload });
        return response;
    }

    protected async patch(endpoint: string, payload: unknown): Promise<APIResponse> {
        const response = await this.request.patch(endpoint, { data: payload });
        return response;
    }

    protected async delete(endpoint: string): Promise<APIResponse> {
        const response = await this.request.delete(endpoint);
        return response;
    }

    /** Asserts status and returns parsed JSON body. Single assertion point. */
    protected async assertAndParse<T>(
        response: APIResponse,
        expectedStatus: number
    ): Promise<T> {
        expect(response.status()).toBe(expectedStatus);
        return response.json() as Promise<T>;
    }
}