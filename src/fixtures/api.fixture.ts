import { test as base, APIRequestContext } from '@playwright/test';
import { DogsController } from '../controllers/dogs.controller';

type ApiFixtures = {
    dogsController: DogsController;
};

export const test = base.extend<ApiFixtures>({
    dogsController: async ({ request }, use) => {
        const controller = new DogsController(request);
        await use(controller);
        // No teardown here — tests own their own cleanup
    },
});

export { expect } from '@playwright/test';