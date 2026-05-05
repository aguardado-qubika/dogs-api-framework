# DOGS-001: Test spec for POST /dogs (create dog)

## User Story

**As a** QA engineer maintaining the dogs-api-framework
**I want** an automated test spec for the `POST /dogs` endpoint
**So that** the create-dog operation is regression-protected and the spec demonstrates the framework's controller/fixture pattern

---

## Stakeholders

| Role | Responsibility |
|------|---------------|
| QA Engineer | Author, acceptance |
| API Consumer | Benefits from verified behavior |

---

## Success Criteria

1. `tests/dogs/create-dog.spec.ts` exists and passes with `npm test`
2. All scenarios use `dogsController.createDog()` — no raw `request.post()` calls in specs
3. `buildDog()` is used for all payload generation
4. `StateManager.trackCreated()` is called after each successful create
5. No assertions on `response.status()` inside spec — controller owns that

**Metrics**: All 4 BDD scenarios appear as passing in `npm run test:report`

---

## Acceptance Criteria

### Scenario 1: Create a dog with all fields

```gherkin
Given the dogs database is in its seeded state (ids 1–10)
When I call createDog with name, breed, age, and description
Then the response status is 201 (asserted inside controller)
And the returned dog has an auto-assigned numeric id greater than 0
And the returned dog body matches the submitted payload fields
```

### Scenario 2: Create a dog with only required fields

```gherkin
Given the dogs database is in its seeded state
When I call createDog with only name, breed, and age (no description)
Then the response status is 201
And the returned dog has a valid id
And name, breed, and age match the submitted values
```

### Scenario 3: Created dog is persisted and retrievable

```gherkin
Given I have successfully created a dog via createDog
When I call getDog with the returned dog's id
Then the response status is 200
And the retrieved dog matches the originally created dog
```

### Scenario 4: Multiple dogs can be created independently

```gherkin
Given the dogs database is in its seeded state
When I call createDog twice with distinct payloads from buildDog()
Then each returned dog has a unique id
And each dog's fields match its respective payload
```

---

## Technical Context

### Current State

- `DogsController.createDog(payload)` exists — sends `POST /dogs`, asserts 201, returns `Dog`
- `buildDog(overrides?)` generates unique payloads via an in-memory counter
- `tests/dogs/` directory exists but contains no spec files
- json-server v1 beta does not enforce required-field validation — no 4xx negative cases are meaningful

### Proposed Changes

- Create `tests/dogs/create-dog.spec.ts`

### Technical Constraints

- Import `test` and `expect` from `@fixtures/api.fixture` — never from `@playwright/test` directly
- `workers: 1`, `fullyParallel: false` — tests run serially
- Do not call `request.post()` directly in specs; all HTTP goes through `dogsController`
- Do not modify `db.json` directly — use `createDog()` and rely on teardown

### Integration Points

- `DogsController.createDog()` → `POST /dogs` on json-server
- `DogsController.getDog()` used in Scenario 3 to verify persistence
- `StateManager.trackCreated(dog.id)` called after each successful create
- `global-teardown` restores `db.json` — no manual cleanup required in spec

### Architecture Decisions

- **One spec file per HTTP verb / feature area**: `create-dog.spec.ts` isolates POST behavior from GET/PATCH/DELETE specs added later
- **No `afterEach` cleanup**: teardown handles restoration globally; per-test cleanup would be redundant and brittle

---

## Out of Scope

1. Field-level validation / 4xx error scenarios (json-server does not enforce schema)
2. Duplicate-name conflict handling (not a json-server constraint)
3. Pagination or listing behavior
4. Authentication / authorization

**Future Considerations**: If a real API backend replaces json-server, validation scenarios (missing required fields, invalid types) should be added at that point.

---

## Edge Cases & Error Handling

### Edge Cases

1. **`description` is optional**: Scenario 2 explicitly omits it to confirm the field is not required by json-server
2. **Counter reset between runs**: `buildDog()` counter resets each run — unique within a run, not globally

### Error Scenarios

- Not applicable: json-server accepts any well-formed JSON body and responds 201

### Data Validation Rules

- `name`: string, required by convention (not enforced by json-server)
- `breed`: string, required by convention
- `age`: number, required by convention
- `description`: string, optional

---

## Dependencies

### Blocking

- None

### Related

- None yet — future GET/PATCH/DELETE specs will follow the same pattern

---

## Definition of Done

### Code Quality

- [ ] No raw `request.post()` calls in spec
- [ ] No `expect(response.status())` in spec body
- [ ] `buildDog()` used for all payloads

### Testing

- [ ] All 4 BDD scenarios pass with `npm test`
- [ ] `StateManager.trackCreated()` called after each create
- [ ] `npm run test:report` shows 4 passing tests under `create-dog.spec.ts`

### Review & Deployment

- [ ] Code reviewed and approved
- [ ] PR merged to `main`

---

## Implementation Notes

File to create: `tests/dogs/create-dog.spec.ts`

```typescript
import { test, expect } from '@fixtures/api.fixture';
import { buildDog } from '@data/dogs.data';
import { StateManager } from '@utils/state-manager';

test.describe('POST /dogs — create dog', () => {
  // Scenario 1, 2, 3, 4 go here
});
```

`StateManager.trackCreated(dog.id)` should be called after each `createDog()` call per the opt-in audit pattern in CLAUDE.md.

---

## References

- `src/controllers/dogs.controller.ts` — `DogsController.createDog()`
- `src/data/dogs.data.ts` — `buildDog()`
- `src/fixtures/api.fixture.ts` — fixture setup
- `src/utils/state-manager.ts` — opt-in state tracking
- `db.json` — seed data (ids 1–10)

---

**Created**: 2026-05-04
**Created By**: Claude (create-sdd-ticket skill)
**INVEST Validated**: ✅ 6/6
**BDD Scenarios**: 4
**Autonomous Inference**: 100% (0 questions asked)
**Estimated Effort**: 1–2 hours
**Priority**: Medium
