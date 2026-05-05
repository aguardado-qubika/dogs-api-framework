import { test, expect } from '@fixtures/api.fixture';
import { buildDog } from '@data/dogs.data';
import { StateManager } from '@utils/state-manager';

test.describe('POST /dogs — create dog', () => {

    test('Scenario 1: Create a dog with all fields', async ({ dogsController }) => {
        const payload = buildDog();

        const dog = await dogsController.createDog(payload);

        expect(dog.id).toBeTruthy();
        expect(dog.name).toBe(payload.name);
        expect(dog.breed).toBe(payload.breed);
        expect(dog.age).toBe(payload.age);
        expect(dog.description).toBe(payload.description);

        StateManager.trackCreated(dog.id!);
    });

    test('Scenario 2: Create a dog with only required fields', async ({ dogsController }) => {
        const { description, ...requiredOnly } = buildDog();

        const dog = await dogsController.createDog(requiredOnly);

        expect(dog.id).toBeTruthy();
        expect(dog.name).toBe(requiredOnly.name);
        expect(dog.breed).toBe(requiredOnly.breed);
        expect(dog.age).toBe(requiredOnly.age);

        StateManager.trackCreated(dog.id!);
    });

    test('Scenario 3: Created dog is persisted and retrievable', async ({ dogsController }) => {
        const payload = buildDog();

        const created = await dogsController.createDog(payload);
        StateManager.trackCreated(created.id!);

        const retrieved = await dogsController.getDog(created.id!);

        expect(retrieved.id).toBe(created.id);
        expect(retrieved.name).toBe(created.name);
        expect(retrieved.breed).toBe(created.breed);
        expect(retrieved.age).toBe(created.age);
    });

    test('Scenario 4: Multiple dogs can be created independently', async ({ dogsController }) => {
        const payload1 = buildDog({ breed: 'Labrador' });
        const payload2 = buildDog({ breed: 'Poodle' });

        const dog1 = await dogsController.createDog(payload1);
        const dog2 = await dogsController.createDog(payload2);

        StateManager.trackCreated(dog1.id!);
        StateManager.trackCreated(dog2.id!);

        expect(dog1.id).not.toBe(dog2.id);
        expect(dog1.name).toBe(payload1.name);
        expect(dog1.breed).toBe(payload1.breed);
        expect(dog2.name).toBe(payload2.name);
        expect(dog2.breed).toBe(payload2.breed);
    });

});
