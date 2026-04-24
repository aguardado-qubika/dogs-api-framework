import { BaseController } from './base.controller';
import { APIRequestContext, expect } from '@playwright/test';

export interface Dog {
    id?: number;
    name: string;
    breed: string;
    age: number;
    description?: string;
}

export class DogsController extends BaseController {
    private readonly basePath = '/dogs';

    constructor(request: APIRequestContext) {
        super(request);
    }

    async createDog(payload: Omit<Dog, 'id'>): Promise<Dog> {
        const response = await this.post(this.basePath, payload);
        return this.assertAndParse<Dog>(response, 201);
    }

    async getDog(id: number): Promise<Dog> {
        const response = await this.get(`${this.basePath}/${id}`);
        return this.assertAndParse<Dog>(response, 200);
    }

    async getAllDogs(): Promise<Dog[]> {
        const response = await this.get(this.basePath);
        return this.assertAndParse<Dog[]>(response, 200);
    }

    async updateDog(id: number, payload: Partial<Dog>): Promise<Dog> {
        const response = await this.patch(`${this.basePath}/${id}`, payload);
        return this.assertAndParse<Dog>(response, 200);
    }

    async deleteDog(id: number): Promise<void> {
        const response = await this.delete(`${this.basePath}/${id}`);
        expect(response.status()).toBe(200);
    }
}