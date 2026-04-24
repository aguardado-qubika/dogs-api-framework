import { Dog } from '../controllers/dogs.controller';

let counter = 0;

export function buildDog(overrides: Partial<Omit<Dog, 'id'>> = {}): Omit<Dog, 'id'> {
  counter++;
  return {
    name: overrides.name ?? `TestDog-${counter}`,
    breed: overrides.breed ?? 'Labrador',
    age: overrides.age ?? 2,
    description: overrides.description ?? `A friendly dog number ${counter}`,
    ...overrides,
  };
}

export const dogPayloads = {
  valid: buildDog(),
  withMinAge: buildDog({ age: 0 }),
  withLongName: buildDog({ name: 'Sir Barksalot the Third of the Golden Retriever Clan' }),
  missingName: { breed: 'Poodle', age: 3 } as Partial<Dog>,
};