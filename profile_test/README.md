# Matchify Testing Suite

## Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Running Tests

1. Install WebDriverIO and dependencies:
```bash
npm install @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter
```

2. Run the test suite:
```bash
npx wdio run wdio.conf.js
```

## Project Structure

```
matchify/
├── src/
│   └── index.html
│       
├── test/
│   ├── specs/
│   │   └── profile.test.js
│   └── fixtures/
│       └── profile-pic.jpg
├── wdio.conf.js
└── package.json
```

## Test Cases

### Positive Tests
- Complete profile creation with valid inputs
- Successful image upload

### Negative Tests
- Form submission with missing fields
- Underage user registration attempt
- Invalid file upload

## Adding New Tests

1. Create new test files in `test/specs/`
2. Add test fixtures in `test/fixtures/`
3. Update `wdio.conf.js` if needed