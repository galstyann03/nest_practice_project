# CI/CD Documentation

This project uses GitHub Actions for CI/CD.

The workflow files are inside:

```txt
.github/workflows/
```

Because this folder is inside the `nest-practice` project, the workflow paths are written as if `nest-practice` is the repository root.

## What To Do Next

Current status:

- CI already checks lint, unit tests, build, e2e tests, and Docker image build.
- Docker publish already pushes to GitHub Container Registry after the CI workflow succeeds.
- Local verification passed with `npm run lint`, `npm test -- --runInBand`, and `npm run build`.

Next useful improvements:

- Check GitHub repository secrets for Telegram notifications.
- Run the full pipeline from GitHub Actions after pushing to `main` or opening a pull request.
- Make sure the GitHub package visibility is what you want after the first Docker image is published.
- Add deployment only when you have a real target server or platform.
- Add SMTP/email secrets later when email verification is implemented.

## GitHub Secrets

GitHub Actions secrets are configured in:

```txt
GitHub repository -> Settings -> Secrets and variables -> Actions -> Repository secrets
```

This project currently expects these custom secrets:

```txt
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

They are used by the `notify-telegram` job in `.github/workflows/ci.yml`.

This one does not need to be created manually:

```txt
GITHUB_TOKEN
```

GitHub automatically creates `GITHUB_TOKEN` for every workflow run. The Docker publish workflow uses it to push the image to GitHub Container Registry.

The Mongo values in the CI workflow are not GitHub secrets right now. They are only temporary credentials for the Mongo service container used during tests.

When SMTP/email verification is added, the project will probably need new secrets like:

```txt
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
MAIL_FROM
```

For local development, these belong in `.env`. For GitHub Actions or deployment, they belong in GitHub Secrets or the deployment platform's secret manager.

## CI Workflow

File:

```txt
.github/workflows/ci.yml
```

Full file:

```yaml
name: NestJS CI

on:
  push:
    branches:
      - main
      - master

  pull_request:
    branches:
      - main
      - master


jobs:
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npx eslint "{src,apps,libs,test}/**/*.ts"

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build
```

Line-by-line explanation:

```yaml
name: NestJS CI
```

This is the workflow name shown in the GitHub Actions tab.

```yaml
on:
```

This starts the trigger section. It tells GitHub when to run the workflow.

```yaml
  push:
```

Run the workflow when code is pushed to GitHub.

```yaml
    branches:
      - main
      - master
```

Only run on pushes to the `main` or `master` branch.

```yaml
  pull_request:
```

Run the workflow when a pull request is opened or updated.

```yaml
    branches:
      - main
      - master
```

Only run for pull requests targeting `main` or `master`.

```yaml
jobs:
```

This starts the jobs section. A workflow can have one or many jobs.

```yaml
  build-and-test:
```

This is the job id. GitHub uses it internally.

```yaml
    name: Build and Test
```

This is the readable job name shown in the Actions UI.

```yaml
    runs-on: ubuntu-latest
```

Run this job on a temporary Ubuntu Linux machine.

```yaml
    steps:
```

This starts the list of commands/actions that run inside the job.

```yaml
      - name: Checkout repository
```

This names the step.

```yaml
        uses: actions/checkout@v4
```

This downloads the repository code into the GitHub Actions machine.

```yaml
      - name: Setup Node.js
```

This names the Node setup step.

```yaml
        uses: actions/setup-node@v4
```

This installs and configures Node.js.

```yaml
        with:
```

This passes options to the `setup-node` action.

```yaml
          node-version: 22
```

Use Node.js version 22.

```yaml
          cache: npm
```

Cache npm dependencies to make future workflow runs faster.

```yaml
      - name: Install dependencies
```

This names the dependency installation step.

```yaml
        run: npm ci
```

Install dependencies using `package-lock.json`. This is better for CI than `npm install` because it is stricter and repeatable.

```yaml
      - name: Run lint
```

This names the lint step.

```yaml
        run: npx eslint "{src,apps,libs,test}/**/*.ts"
```

Run ESLint on TypeScript files inside `src`, `apps`, `libs`, and `test`.

```yaml
      - name: Run tests
```

This names the test step.

```yaml
        run: npm test
```

Run the `test` script from `package.json`. In this project, that runs Jest.

```yaml
      - name: Build project
```

This names the build step.

```yaml
        run: npm run build
```

Run the `build` script from `package.json`. In this project, that builds the NestJS app.

The CI workflow checks that the app can install dependencies, pass lint, pass tests, and build successfully.

## Docker Publish Workflow

File:

```txt
.github/workflows/docker-publish.yml
```

Full file:

```yaml
name: Docker Publish

on:
  push:
    branches:
      - main
      - master

jobs:
  docker-publish:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set lowercase image name
        run: |
          echo "IMAGE_NAME=ghcr.io/${GITHUB_REPOSITORY,,}/nest-practice" >> $GITHUB_ENV

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: |
            ${{ env.IMAGE_NAME }}:latest
            ${{ env.IMAGE_NAME }}:${{ github.sha }}
```

Line-by-line explanation:

```yaml
name: Docker Publish
```

This is the workflow name shown in GitHub Actions.

```yaml
on:
```

This starts the trigger section.

```yaml
  push:
```

Run the workflow when code is pushed.

```yaml
    branches:
      - main
      - master
```

Only run on pushes to `main` or `master`.

```yaml
jobs:
```

This starts the jobs section.

```yaml
  docker-publish:
```

This is the job id.

```yaml
    name: Build and Push Docker Image
```

This is the readable job name in GitHub Actions.

```yaml
    runs-on: ubuntu-latest
```

Run the job on a temporary Ubuntu Linux machine.

```yaml
    permissions:
```

This defines what the workflow is allowed to do.

```yaml
      contents: read
```

Allow the workflow to read the repository contents.

```yaml
      packages: write
```

Allow the workflow to push packages, including Docker images, to GitHub Container Registry.

```yaml
    steps:
```

This starts the list of steps.

```yaml
      - name: Checkout repository
```

This names the checkout step.

```yaml
        uses: actions/checkout@v4
```

Download the project code into the GitHub Actions machine.

```yaml
      - name: Login to GitHub Container Registry
```

This names the registry login step.

```yaml
        uses: docker/login-action@v3
```

Use Docker's official login action.

```yaml
        with:
```

Pass options to the Docker login action.

```yaml
          registry: ghcr.io
```

Log in to GitHub Container Registry.

```yaml
          username: ${{ github.actor }}
```

Use the GitHub user or bot that triggered the workflow.

```yaml
          password: ${{ secrets.GITHUB_TOKEN }}
```

Use the automatic GitHub Actions token. GitHub creates this token for the workflow run.

```yaml
      - name: Set lowercase image name
```

This names the image-name step.

```yaml
        run: |
```

Run a multi-line shell command.

```yaml
          echo "IMAGE_NAME=ghcr.io/${GITHUB_REPOSITORY,,}/nest-practice" >> $GITHUB_ENV
```

Create an environment variable named `IMAGE_NAME`.

`GITHUB_REPOSITORY` usually looks like this:

```txt
username/repository-name
```

`${GITHUB_REPOSITORY,,}` converts it to lowercase because Docker image names must be lowercase.

`>> $GITHUB_ENV` saves the variable so later steps can use it.

```yaml
      - name: Build and push Docker image
```

This names the Docker build and push step.

```yaml
        uses: docker/build-push-action@v6
```

Use Docker's official build/push action.

```yaml
        with:
```

Pass options to the Docker build/push action.

```yaml
          context: .
```

Use the current project folder as the Docker build context. Here, `.` means the `nest-practice` repository root.

```yaml
          file: ./Dockerfile
```

Use the `Dockerfile` in the project root.

```yaml
          push: true
```

Push the image to the registry after building it.

```yaml
          tags: |
```

Define multiple image tags.

```yaml
            ${{ env.IMAGE_NAME }}:latest
```

Tag the image as `latest`.

```yaml
            ${{ env.IMAGE_NAME }}:${{ github.sha }}
```

Also tag the image with the exact Git commit SHA.

The Docker publish workflow builds the project's Docker image and pushes it to GitHub Container Registry.

## Result

The CI workflow answers:

```txt
Does the code install, lint, test, and build?
```

The Docker publish workflow answers:

```txt
Can this project be packaged as a Docker image and pushed to a registry?
```

