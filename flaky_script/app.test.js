const { remote } = require('webdriverio');
const assert = require('assert');

// Constants for test configuration
const TEST_CONFIG = {
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 10000,
  WAIT_INTERVAL: 500,
};

class ElementTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ElementTimeoutError';
  }
}

class LoginTest {
  constructor() {
    this.browser = null;
  }

  // Initialize WebDriver session
  async initializeSession() {
    this.browser = await remote({
      capabilities: {
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:platformVersion': '12.0',
        'appium:automationName': 'UiAutomator2',
        'appium:app': '/path/to/matchify.apk',
        // Added capabilities for better stability
        'appium:noReset': false,
        'appium:fullReset': true,
        'appium:newCommandTimeout': 60000,
        'appium:autoGrantPermissions': true,
      },
      // Added WebDriver configurations
      waitforTimeout: TEST_CONFIG.TIMEOUT,
      connectionRetryTimeout: 120000,
      connectionRetryCount: 3,
    });
  }

  // Custom wait function with timeout
  async waitForElement(selector, timeout = TEST_CONFIG.TIMEOUT) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        const element = await this.browser.$(selector);
        const isDisplayed = await element.isDisplayed();
        if (isDisplayed) {
          return element;
        }
      } catch (err) {
      }
      await new Promise((resolve) =>
        setTimeout(resolve, TEST_CONFIG.WAIT_INTERVAL)
      );
    }
    throw new ElementTimeoutError(
      `Element ${selector} not found after ${timeout}ms`
    );
  }

  async retryAction(action, description) {
    for (let attempt = 1; attempt <= TEST_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        if (attempt === TEST_CONFIG.RETRY_ATTEMPTS) {
          throw new Error(
            `Failed to ${description} after ${TEST_CONFIG.RETRY_ATTEMPTS} attempts: ${error.message}`
          );
        }
        console.log(`Attempt ${attempt} failed, retrying...`);
        await new Promise((resolve) =>
          setTimeout(resolve, TEST_CONFIG.WAIT_INTERVAL)
        );
      }
    }
  }

  // Safe input method with clear and retry
  async safeInput(selector, value) {
    await this.retryAction(async () => {
      const element = await this.waitForElement(selector);
      await element.clearValue();
      await element.setValue(value);
      // Verify input value
      const actualValue = await element.getValue();
      if (actualValue !== value) {
        throw new Error('Input verification failed');
      }
    }, `input value ${value}`);
  }

  // Main test execution
  async runTest() {
    try {
      await this.initializeSession();

      // Wait for app to load and login button to be clickable
      const loginButton = await this.waitForElement('~loginButton');
      await this.retryAction(async () => {
        await loginButton.waitForClickable();
        await loginButton.click();
      }, 'click login button');
      await this.safeInput('~usernameInput', 'testuser');
      await this.safeInput('~passwordInput', 'password123');
      const submitButton = await this.waitForElement('~submitButton');
      await this.retryAction(async () => {
        await submitButton.waitForClickable();
        await submitButton.click();
      }, 'submit login');

      // Validate login success with explicit wait and assertion
      const successMessage = await this.waitForElement('~successMessage');
      const successText = await successMessage.getText();
      assert.strictEqual(
        successText,
        'Login Successful!',
        'Login validation failed'
      );

      console.log('Test completed successfully');
    } catch (error) {
      console.error('Test failed:', error);
      throw error; 
    } finally {
      if (this.browser) {
        await this.browser.deleteSession();
      }
    }
  }
}

// Execute test
if (require.main === module) {
  const loginTest = new LoginTest();
  loginTest.runTest().catch(console.error);
}

module.exports = LoginTest; // Export for integration with test framework
