import { Dog } from '../controllers/dogs.controller';

let counter = 0;

export function buildDog(overrides: Partial<Omit<Dog, 'id'>> = {}): Omit<Dog, 'id'> {
  counter++;
  return {
    name: `TestDog-${counter}`,
    breed: 'Labrador',
    age: 2,
    description: `A friendly dog number ${counter}`,
    ...overrides,
  };
}
