# BEN: Fitness Tracker App (working name)

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=17758508&assignment_repo_type=AssignmentRepo)

## Building and Deploying

### Using Docker Compose

> [!IMPORTANT]
> Requires Docker Compose 2.22.0 or later.

#### Start a development server using:
Development servers are launched locally. Begin by installing the necessary packages:
```bash
cd go_pulse
npm install
```

Run peripheral services, like the database, locally by running:

```bash
docker-compose --profile dev up
```

Finally, launch the app by running 
```bash 
npm run dev
```

Environment variables can be passed into the app using a `.env` file at the project root. An example .env file with the necessary variables is shown below (sensitive environment variables have been removed).

```
POSTGRES_HOST=localhost
POSTGRES_DB=testdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres 
DB_LOCAL_PORT=50432
DB_REMOTE_PORT=5432
JWT_SECRET=

NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
NEXT_PUBLIC_VAPID_PRIVATE_KEY=
NEXT_PUBLIC_NINJA_API_KEY=
```

The app automatically launches to port `3000`, but this can be modified by providing a `DEV_LOCAL_PORT` environment variable.

Databases within the postgres container can be accessed from a terminal by running
```bash
psql postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:{POSTGRES_LOCAL_PORT}/{POSTGRES_DB}
```
For example, if you launch docker compose with the following environment variables:
```bash
POSTGRES_HOST=localhost
POSTGRES_DB=testdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres 
DB_LOCAL_PORT=50432
DB_REMOTE_PORT=5432
```
This database can be connected to directly using:
```bash
psql postgresql://postgres:postgres@localhost:50432/testdb
```

#### Start a production server using:

```bash
docker-compose --profile prod up --build
```

This launches a production app, along with any necessary peripheral services.

## Branch policies

We are developing with 4 types of branches:

### Main Branch (`main`)

The main production branch. Commits to the main branch should only happen via pull request, any commits made to the main branch should be tagged as a release (something like `v1.0.1`).

The main branch is currently protected from pushes. To add a tag, create a [release from a commit on `main`](https://github.com/UTSC-CSCC01-Software-Engineering-I/term-group-project-ben/releases).

### Dev branch (`dev`)

The developer branch. 
Commits to the branch should only happen via pull request.

### Release branches (`release/[VERSION]`)

Release branches are branched off of `main` when a release is desired.
Commits to release branches should only happen via pull request.

### Issue branches (`feature/[ISSUE ID]-[Description]`)

Issue branches should be branched off of `dev` or `main`. 
Branch names should contain the issue id and a few words of description to explain what the branch is about.

For example: `feature/SCRUM-2-set-up-repo`

Commits to this branch should happen directly, we don't need any pull requests to merge anything into an issue branch.

## Commit style

Commits to `main`, `dev` and release branches should only be squash merge commits from pull requests following the style defined by GitHub. 

Commits to issue branches are more freeform, but be clear, and write full sentences starting with a capital, NOT ending with a period.

For example, prefer commits of the style: 
> Adjust "Share" button styling

Avoid commits of the style:

> i'm adjusting styles. 

> feat: adjust style. 

## Unit Tests (Frontend)

### 1. Running Unit Tests

Frontend unit tests are designed to test individual functions or modules of your app to ensure they behave as expected.

To run all tests, use the following command:

```bash
npm test
```

This will run all tests using Vitest.

To run a specific test file, use:

```bash
npx vitest run src/path/to/test/file.test.ts
```

### 2. Creating Unit Tests

Unit tests are typically placed in a __tests__ folder or alongside the code they test (using the .test.ts or .test.tsx extension). Here's an example of a unit test for a utility function:
```ts
// Example: utils.test.ts
import { sum } from './utils'; // Import the function you want to test

test('adds two numbers correctly', () => {
  expect(sum(1, 2)).toBe(3);
});
```
In this example, sum is the function being tested. The test checks if calling sum(1, 2) returns 3.

Here’s another example for testing a React component:
```ts
// Example: Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from './Button'; // Import the Button component

test('renders Button component correctly', () => {
  render(<Button label="Click me" />);
  
  // Check if the button is rendered with the correct label
  expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
});
```

## Pull Requests

Pull requests should always use the "squash merge" strategy and require two reviews before being merge. 

Titles should be a short-form summary of the issue(s) being resolved.

Descriptions should follow the template provided in `.github/pull_request_template.md`.
- Within the request, link to the relevant issue(s) that you are resolving.
- Provide a small summary of the changes made, and any justification if needed. 
- Make sure the pull request checklist is completed.

Ideally, someone should be able to look at the pull request and the issue to understand the reasoning behind the changes you're making, without having to contact you.

### Example Pull Request

> ## Changes Made
> [Linked Issue](https://risheitmunshi.atlassian.net/browse/SCRUM-2)
> 
> This PR:
> - Adds necessary documentation.
> - Sets up the initial state of the GitHub repository
> 
> ## Pull Request Checklist
> - [x] The build launches successfully.
> - [x] Code has been cleaned up (commented-out code, TODO comments, etc. are removed).
> - [x] The PR is unit-tested adequately.