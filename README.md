## 🎯 GoalCraft

It is an application designed to **empower you in setting, tracking, and achieving your goals**. It's your personal progress tracker, helping you move from where you are today to where you aspire to be.

With GoalCraft, you define your targets, document your current standing, and visualize your journey from initial state to ultimate success.

## Getting Started

### To run both client and server

```bash
# In root directory of the project 
./start
```

OR

### To run the client:

```bash
# Navigate to client directory
cd okr-client

# Install all the dependencies
pnpm install

# Start the development server
pnpm start
```

### To run the server:

```bash
# Navigate to server directory
cd okr-nest

# Install all the dependencies
pnpm install

# Migrate the prisma
pnpm prisma:migrate

# Start the development server
pnpm start:dev
```

### To run E2E tests:

```bash
# Make sure you're in the server directory
cd okr-nest

# Run e2e tests
pnpm test:e2e
```

### To run all the tests:

```bash
# Make sure you're in the server directory
cd okr-nest

# Run all tests
pnpm test
```

## 🤝 Contribution

You can learn more about [contributing guidelines here](./CONTRIBUTING.md).