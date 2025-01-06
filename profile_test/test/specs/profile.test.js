const path = require('path');

describe('Profile Creation Form', () => {
  beforeEach(async () => {
    await browser.url('/');
    await browser.pause(1000); // Wait for form to load
  });

  describe('Negative Scenarios', () => {
    it('should show error for empty name', async () => {
      await $('#age').setValue('25');
      await $('button[type="submit"]').click();

      await browser.waitUntil(
        async () => {
          const error = await $('#nameError');
          return await error.isDisplayed();
        },
        { timeout: 5000, timeoutMsg: 'Name error not displayed' }
      );

      const nameError = await $('#nameError');
      await expect(nameError).toHaveTextContaining('Name is required');
    });

    it('should show error for invalid age', async () => {
      await $('#name').setValue('John');
      await $('#age').setValue('10');
      await $('button[type="submit"]').click();

      await browser.waitUntil(
        async () => {
          const error = await $('#ageError');
          return await error.isDisplayed();
        },
        { timeout: 5000, timeoutMsg: 'Age error not displayed' }
      );

      const ageError = await $('#ageError');
      await expect(ageError).toHaveTextContaining('Age must be 18 or older');
    });

    it('should show error for empty fields', async () => {
      await $('button[type="submit"]').click();

      await browser.waitUntil(
        async () => {
          const errors = await $$('.error-message');
          return errors.length > 0;
        },
        { timeout: 5000, timeoutMsg: 'Error messages not displayed' }
      );

      const errors = await $$('.error-message');
      await expect(errors).toHaveLength(3); 
    });
  });
});
