# Testing Guide

This directory contains the test suite for the Subscription Billing Simulator API.

## Setup

The testing environment is configured to work with ES modules and includes:
- Jest testing framework
- Supertest for HTTP assertions
- Test environment configuration
- Code coverage reporting

## Available Test Scripts

```bash
# Run all tests
npm run test

# Run only API tests
npm run test:api

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.js                    # Global test setup
├── testApp.js                  # Test-specific app (without billing service)
├── unit/
│   └── api/
│       └── apiEndpoints.test.js # API endpoint tests
└── README.md                   # This file
```

## Environment Variables

Test environment variables are configured in `.env.test`:
- `NODE_ENV=test`
- `GEMINI_API_KEY=test-key-for-testing`
- `PORT=3001`

## Writing New Tests

### API Tests
Place new API tests in `tests/unit/api/`. Use the test app:

```javascript
import request from 'supertest';
import app from '../../testApp.js';

describe('Your Feature', () => {
  test('should do something', async () => {
    const response = await request(app)
      .get('/api/your-endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('expectedField');
  });
});
```

### Test App vs Main App
- Use `testApp.js` for testing (excludes billing service)
- Main `app.js` includes billing service for production

## Coverage Report

Coverage reports are generated in the `coverage/` directory and show:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Current Test Coverage

The test suite currently covers:
- Health check endpoint
- Subscription endpoints (GET, POST)
- Transaction endpoints (GET, GET/:id)
- 404 error handling

## Notes

- Tests run with Node.js experimental VM modules for ES module support
- Setup file provides fallback environment variables
- Tests are isolated and don't affect each other
