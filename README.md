# assessment_QA_automation
The  task is to ensure the quality and reliability of the app by automating the testing process, integrating it into CI/CD pipelines, and monitoring errors.

# Matchify Test Automation Framework Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Setup Instructions](#setup-instructions)
3. [Test Structure](#test-structure)
4. [Frontend Testing](#frontend-testing)
5. [Backend Testing](#backend-testing)
6. [Mobile Testing](#mobile-testing)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Project Structure
```
matchify/
├── src/
│   ├── frontend/
│   │   ├── index.html
│   │   └── tests/
│   │       └── specs
|             └── profile.test.js
│   ├── server/
│   │   ├── app.js
│   │   
│   └── mobile/
│           └── app.test.js
├── tests/
│   ├── api/
│   ├── e2e/
│   └── mobile/
└── config/
    ├── wdio.conf.js
    └── jest.config.js
```

### Technology Stack
- Frontend: HTML + WebDriverIO
- Backend: Express.js + Jest + Supertest
- Mobile: Appium + WebDriverIO
- CI/CD: GitHub Actions

## Setup Instructions

### Prerequisites
```bash
# Node.js and npm
node -v  # Should be >= 14
npm -v   # Should be >= 6

# Android SDK for mobile testing
ANDROID_HOME=/path/to/android-sdk
```

### Installation
```bash
# Install dependencies
npm install

# Install specific test dependencies
npm install --save-dev @wdio/cli @wdio/local-runner jest supertest appium

# Setup mobile testing
npm install -g appium
appium driver install uiautomator2
```

### Configuration Files
1. **WebDriverIO (wdio.conf.js)**
```javascript
exports.config = {
    specs: ['./test/specs/**/*.js'],
    capabilities: [{
        browserName: 'chrome'
    }],
    framework: 'mocha',
    reporters: ['spec']
};
```

2. **Jest (jest.config.js)**
```javascript
module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js']
};
```

## Test Structure

### Frontend Testing (WebDriverIO)
```javascript
describe('Profile Creation', () => {
    it('should create profile with valid inputs', async () => {
        await $('#name').setValue('John Doe');
        await $('#age').setValue('25');
        // ... more test steps
    });
});
```

### Backend Testing (Jest + Supertest)
```javascript
describe('API Tests', () => {
    it('should create new profile', async () => {
        const response = await request(app)
            .post('/profile')
            .send(validProfile);
        expect(response.status).toBe(201);
    });
});
```

### Mobile Testing (Appium)
```javascript
class LoginTest {
    async runTest() {
        await this.waitForElement('~loginButton');
        await this.safeInput('~usernameInput', 'testuser');
        // ... more test steps
    }
}
```

## Error Handling and Reliability

### Frontend Error Handling
```javascript
try {
    await element.waitForDisplayed({ timeout: 5000 });
} catch (error) {
    console.error('Element not displayed:', error);
    throw error;
}
```

### API Error Handling
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
```

### Mobile Test Reliability Features
1. **Custom Wait Function**
```javascript
async waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            const element = await this.browser.$(selector);
            if (await element.isDisplayed()) {
                return element;
            }
        } catch (err) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
    throw new Error(`Element ${selector} not found`);
}
```

2. **Retry Mechanism**
```javascript
async retryAction(action, description, attempts = 3) {
    for (let i = 0; i < attempts; i++) {
        try {
            await action();
            return;
        } catch (error) {
            if (i === attempts - 1) throw error;
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}
```

## Best Practices

### Test Writing
1. **Use Page Objects**
```javascript
class LoginPage {
    get usernameInput() { return $('#username'); }
    get passwordInput() { return $('#password'); }
    
    async login(username, password) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
    }
}
```

2. **Descriptive Test Names**
```javascript
it('should display error message when submitting form with missing required fields', async () => {
    // Test implementation
});
```

3. **Proper Assertions**
```javascript
expect(response.body).toEqual(expect.objectContaining({
    message: 'Profile created successfully',
    userId: expect.any(String)
}));
```

### Code Organization
1. **Separate Test Data**
```javascript
const testData = {
    validProfile: {
        name: 'John Doe',
        age: 25,
        // ... more data
    }
};
```

2. **Reusable Utilities**
```javascript
const utils = {
    generateRandomEmail: () => `test${Date.now()}@example.com`,
    formatDate: (date) => date.toISOString()
};
```

## Troubleshooting

### Common Issues and Solutions

1. **Flaky Tests**
   - Issue: Tests fail intermittently
   - Solution: Implement proper waits and retry mechanisms
   ```javascript
   await browser.waitUntil(
       async () => await element.isDisplayed(),
       { timeout: 5000 }
   );
   ```

2. **Element Not Found**
   - Issue: Elements not located despite being present
   - Solution: Use reliable selectors and explicit waits
   ```javascript
   await element.waitForDisplayed({
       timeout: 5000,
       timeoutMsg: 'Element not found after 5s'
   });
   ```

3. **Session Handling**
   - Issue: Session not properly cleaned up
   - Solution: Use try/finally blocks
   ```javascript
   try {
       // Test steps
   } finally {
       await browser.deleteSession();
   }
   ```

### Debug Techniques

1. **Screenshot Capture**
```javascript
async captureScreenshot(name) {
    await browser.saveScreenshot(`./screenshots/${name}.png`);
}
```

2. **Logging**
```javascript
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Update webdriver
npx webdriver-manager update

# Update Appium
npm install -g appium@latest
```

### Test Reports
```javascript
const reporter = require('@wdio/allure-reporter').default;

reporter.addFeature('Profile Creation');
reporter.addSeverity('critical');
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Automation
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - run: npm ci
      - run: npm test
```