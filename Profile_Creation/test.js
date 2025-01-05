// wdio.conf.js
exports.config = {
  specs: ['./test/specs/**/*.js'],
  maxInstances: 10,
  capabilities: [
    {
      browserName: 'chrome',
    },
  ],
  logLevel: 'info',
  baseUrl: 'http://localhost:3000',
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};

// test/specs/profile-creation.test.js
describe('Profile Creation', () => {
  beforeEach(async () => {
    await browser.url('/');
  });

  it('should create profile with valid inputs', async () => {
    // Fill in form fields
    await $('#name').setValue('John Doe');
    await $('#age').setValue('25');
    await $('#gender').selectByAttribute('value', 'male');
    await $('#location').setValue('New York');
    await $('#interests').setValue('hiking, reading, travel');

    // Upload profile picture
    const filePath = path.join(__dirname, '../fixtures/profile-pic.jpg');
    const remoteFilePath = await browser.uploadFile(filePath);
    await $('#profilePicture').setValue(remoteFilePath);

    // Submit form
    await $('[data-testid="submit-button"]').click();

    // Verify success message
    const successAlert = await $('.bg-green-50');
    await expect(successAlert).toBeDisplayed();
    await expect(successAlert).toHaveTextContaining(
      'Profile created successfully'
    );
  });

  it('should show validation errors for missing fields', async () => {
    // Submit empty form
    await $('[data-testid="submit-button"]').click();

    // Verify error messages
    const errorMessages = await $$('.text-red-500');
    await expect(errorMessages).toHaveLength(6); // One for each required field

    // Verify specific error messages
    const nameError = await $('div:nth-child(1) .text-red-500');
    await expect(nameError).toHaveText('Name is required');
  });

  it('should validate age requirement', async () => {
    await $('#age').setValue('15');
    await $('[data-testid="submit-button"]').click();

    const ageError = await $('div:nth-child(2) .text-red-500');
    await expect(ageError).toHaveText('Valid age is required (18+)');
  });

  it('should validate image upload', async () => {
    const invalidFile = path.join(__dirname, '../fixtures/invalid.txt');
    const remoteFilePath = await browser.uploadFile(invalidFile);
    await $('#profilePicture').setValue(remoteFilePath);

    const fileError = await $('div:nth-child(6) .text-red-500');
    await expect(fileError).toHaveText('Please upload a valid image file');
  });
});
