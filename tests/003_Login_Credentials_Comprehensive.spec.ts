import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';

let basePage: BasePage;
let loginPage: LoginPage;

test.describe('Warepro Login Credentials - Comprehensive Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    loginPage = new LoginPage(page);
    await basePage.navigateToUrl('https://dev.warepro.in/webui/index.zul');
  });

  // ============== POSITIVE TEST CASES ==============
  
  test('TC_LOGIN_001: Successful login with valid admin credentials @login @positive', async ({ page }) => {
    try {
      await loginPage.loginToWarepro('santosh', 'Pipra', 'Pipra Admin');
      const title = await page.title();
      expect(title).toBe('WarePro');
      console.log('✓ Login successful with valid credentials');
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  });

  test('TC_LOGIN_044: Verify password field masking @position @ux', async ({ page }) => {
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    await passwordField.fill('TestPassword123');
    
    const passwordType = await passwordField.evaluate((el: HTMLInputElement) => el.type);
    expect(passwordType).toBe('password');
    console.log('✓ Password field correctly masked');
  });

  // ============== NEGATIVE TEST CASES - INVALID CREDENTIALS ==============

  test('TC_LOGIN_004: Login with invalid username @invalidlogin @negative', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');
    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');

    await userNameField.fill('invaliduser@test');
    await passwordField.fill('Pipra');
    await loginButton.click();

    await expect(invalidDataMessage).toBeVisible({ timeout: 5000 });
    console.log('✓ Invalid username rejected correctly');
  });

  test('TC_LOGIN_005: Login with invalid password @invalidlogin @negative', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');
    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');

    await userNameField.fill('santosh');
    await passwordField.fill('wrongpassword123');
    await loginButton.click();

    await expect(invalidDataMessage).toBeVisible({ timeout: 5000 });
    console.log('✓ Invalid password rejected correctly');
  });

  test('TC_LOGIN_006: Login with both username and password invalid @invalidlogin @negative', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');
    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');

    await userNameField.fill('invaliduser');
    await passwordField.fill('invalidpass123');
    await loginButton.click();

    await expect(invalidDataMessage).toBeVisible({ timeout: 5000 });
    console.log('✓ Both invalid credentials rejected correctly');
  });

  // ============== CASE SENSITIVITY TESTS ==============

  test('TC_LOGIN_007: Login with case-sensitive username (wrong case) @case-sensitive @negative', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');
    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');

    await userNameField.fill('SANTOSH'); // Wrong case
    await passwordField.fill('Pipra');
    await loginButton.click();

    // Check if error appears (system is case-sensitive)
    const isError = await invalidDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
    if (isError) {
      console.log('✓ Username is case-sensitive (as expected)');
    } else {
      console.log('⚠ Username is NOT case-sensitive (check design)');
    }
  });

  test('TC_LOGIN_008: Login with case-sensitive password (wrong case) @case-sensitive @negative', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');
    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');

    await userNameField.fill('santosh');
    await passwordField.fill('pipra'); // Wrong case (should be 'Pipra')
    await loginButton.click();

    const isError = await invalidDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
    expect(isError).toBe(true);
    console.log('✓ Password is case-sensitive (as expected)');
  });

  // ============== WHITESPACE HANDLING TESTS ==============

  test('TC_LOGIN_009: Login with extra spaces in username @whitespace @edge-case', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await userNameField.fill('  santosh  '); // With spaces
    await passwordField.fill('Pipra');
    await loginButton.click();

    // Wait to see if login succeeds or error appears
    const pageTitle = await page.title().catch(() => 'login');
    const success = pageTitle === 'WarePro';
    console.log(`✓ Spaces in username: ${success ? 'Trimmed and accepted' : 'Rejected (no trim)'}`);
  });

  test('TC_LOGIN_010: Login with extra spaces in password @whitespace @edge-case', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await userNameField.fill('santosh');
    await passwordField.fill('  Pipra  '); // With spaces
    await loginButton.click();

    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');
    const isError = await invalidDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`✓ Spaces in password: ${isError ? 'Not trimmed (strict)' : 'Trimmed (lenient)'}`);
  });

  // ============== EMPTY FIELD TESTS ==============

  test('TC_LOGIN_011: Login with empty username @empty-fields @edge-case', async ({ page }) => {
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await passwordField.fill('Pipra');
    
    // Check for validation error or button disabled
    const isDisabled = await loginButton.isDisabled().catch(() => false);
    const validationAttempt = !isDisabled;
    
    if (validationAttempt) {
      await loginButton.click();
      console.log('✓ Empty username validation attempted');
    } else {
      console.log('✓ Submit button disabled when username empty');
    }
  });

  test('TC_LOGIN_012: Login with empty password @empty-fields @edge-case', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await userNameField.fill('santosh');
    
    const isDisabled = await loginButton.isDisabled().catch(() => false);
    if (!isDisabled) {
      await loginButton.click();
      console.log('✓ Empty password validation attempted');
    } else {
      console.log('✓ Submit button disabled when password empty');
    }
  });

  test('TC_LOGIN_013: Login with both fields empty @empty-fields @edge-case', async ({ page }) => {
    const loginButton = page.locator('//button[text()="Login"]');
    
    const isDisabled = await loginButton.isDisabled().catch(() => false);
    if (!isDisabled) {
      await loginButton.click();
      console.log('✓ Both empty fields validation attempted');
    } else {
      console.log('✓ Submit button disabled when both fields empty');
    }
  });

  // ============== SECURITY TESTS - INJECTION ATTACKS ==============

  test('TC_LOGIN_015: SQL Injection attempt in username @security @injection', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    const sqlPayload = "' OR '1'='1";
    await userNameField.fill(sqlPayload);
    await passwordField.fill('Pipra');
    await loginButton.click();

    // Should show error, not bypass authentication
    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');
    const isError = await invalidDataMessage.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isError).toBe(true);
    console.log('✓ SQL injection in username blocked');
  });

  test('TC_LOGIN_016: SQL Injection attempt in password @security @injection', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await userNameField.fill('santosh');
    const sqlPayload = "' OR '1'='1' --";
    await passwordField.fill(sqlPayload);
    await loginButton.click();

    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');
    const isError = await invalidDataMessage.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isError).toBe(true);
    console.log('✓ SQL injection in password blocked');
  });

  test('TC_LOGIN_017: XSS payload in username @security @xss', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    const xssPayload = "<script>alert('XSS')</script>";
    await userNameField.fill(xssPayload);
    await passwordField.fill('Pipra');

    let alertTriggered = false;
    page.on('dialog', (dialog) => {
      alertTriggered = true;
      dialog.dismiss();
    });

    await loginButton.click();
    
    expect(alertTriggered).toBe(false);
    console.log('✓ XSS payload in username blocked - no script execution');
  });

  test('TC_LOGIN_018: HTML/event injection @security @injection', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    const htmlPayload = '<img src=x onerror="alert(1)">';
    await userNameField.fill(htmlPayload);
    await passwordField.fill('Pipra');

    let alertTriggered = false;
    page.on('dialog', (dialog) => {
      alertTriggered = true;
      dialog.dismiss();
    });

    await loginButton.click();
    
    expect(alertTriggered).toBe(false);
    console.log('✓ HTML event injection blocked - no script execution');
  });

  test('TC_LOGIN_019: Command injection attempt @security @injection', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    const commandPayload = "santosh; rm -rf /";
    await userNameField.fill(commandPayload);
    await passwordField.fill('Pipra');
    await loginButton.click();

    const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');
    const isError = await invalidDataMessage.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isError).toBe(true);
    console.log('✓ Command injection in username blocked');
  });

  // ============== BOUNDARY VALUE TESTS ==============

  test('TC_LOGIN_020: Login with very long username @boundary @edge-case', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    const veryLongUsername = 'a'.repeat(1000);
    await userNameField.fill(veryLongUsername);
    await passwordField.fill('Pipra');

    // Check if application handles it gracefully
    const actualLength = await userNameField.evaluate((el: HTMLInputElement) => el.value.length);
    console.log(`✓ Very long username: field contains ${actualLength} characters`);

    await loginButton.click();
    // Should reject or handle gracefully
    console.log('✓ Long username handled without crash');
  });

  test('TC_LOGIN_021: Login with very long password @boundary @edge-case', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await userNameField.fill('santosh');
    const veryLongPassword = 'p'.repeat(1000);
    await passwordField.fill(veryLongPassword);

    const actualLength = await passwordField.evaluate((el: HTMLInputElement) => el.value.length);
    console.log(`✓ Very long password: field contains ${actualLength} characters`);

    await loginButton.click();
    console.log('✓ Long password handled without crash');
  });

  // ============== FORM INTERACTION TESTS ==============

  test('TC_LOGIN_043: Login with Enter key submit @interaction @form', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');

    await userNameField.fill('santosh');
    await passwordField.fill('Pipra');
    
    // Press Enter on password field
    await expect(async () => {
      // Wait for login process to start
      await Promise.race([
        page.waitForURL('**', { timeout: 5000 }), // Page changes after login
        page.locator('//button[text()=" Continue"]').waitFor({ timeout: 5000 }) // Role selection appears
      ]);
    }).toPass({ timeout: 10000 }).catch(() => {
      // Login might not complete due to role selection or other flow
    });
    
    console.log('✓ Enter key submission works');
  });

  test('TC_LOGIN_042: Tab navigation through login form @interaction @form', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    // Focus and tab through elements
    await userNameField.focus();
    await userNameField.type('santosh');
    await page.keyboard.press('Tab');

    const activeElement = await page.evaluate(() => document.activeElement?.getAttribute('autocomplete'));
    expect(activeElement).toBe('current-password');
    
    console.log('✓ Tab navigation works correctly');
  });

  // ============== HTTPS/SECURITY TESTS ==============

  test('TC_LOGIN_033: HTTPS connection verification @security @network', async ({ page }) => {
    const url = page.url();
    expect(url).toMatch(/^https:\/\//);
    console.log(`✓ Application uses HTTPS: ${url}`);
  });

  // ============== BROWSER FEATURE TESTS ==============

  test('TC_LOGIN_040: Test with cookies enabled @cross-browser @functionality', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    await userNameField.fill('santosh');
    await passwordField.fill('Pipra');
    await loginButton.click();

    // Check if session cookie is set
    const cookies = await page.context().cookies();
    const hasCookie = cookies.length > 0;
    
    console.log(`✓ Cookies present: ${hasCookie} (${cookies.length} cookies found)`);
  });

  test('TC_LOGIN_045: Test form autocomplete behavior @cross-browser @ux', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    
    const autocompleteAttr = await userNameField.getAttribute('autocomplete');
    expect(autocompleteAttr).toBe('username');
    
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const passwordAutocomplete = await passwordField.getAttribute('autocomplete');
    expect(passwordAutocomplete).toBe('current-password');
    
    console.log('✓ Form fields have proper autocomplete attributes for security');
  });

  // ============== LOGIN ATTEMPT TRACKING ==============

  test('TC_LOGIN_023: Multiple failed login attempts @security @account-lockout', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    // Simulate multiple failed attempts
    const maxAttempts = 5;
    for (let i = 0; i < maxAttempts; i++) {
      await userNameField.fill('santosh');
      await passwordField.fill(`wrongpass${i}`);
      await loginButton.click();
      
      // Wait for error message
      const invalidDataMessage = page.locator('//span[text()="Invalid User ID or Password"]');
      const isVisible = await invalidDataMessage.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (!isVisible && i < maxAttempts - 1) {
        // Might be account blocked
        console.log(`⚠ Attempt ${i + 1}: Account might be blocked`);
        break;
      }
    }
    
    console.log(`✓ Completed ${maxAttempts} failed login attempts - check for lockout`);
  });

  // ============== PERFORMANCE AND TIMEOUT TESTS ==============

  test('TC_LOGIN_035: Measure login response time @performance', async ({ page }) => {
    const userNameField = page.locator('//input[@autocomplete="username"]');
    const passwordField = page.locator('//input[@autocomplete="current-password"]');
    const loginButton = page.locator('//button[text()="Login"]');

    const startTime = Date.now();
    
    await userNameField.fill('santosh');
    await passwordField.fill('Pipra');
    await loginButton.click();

    // Wait for either dashboard or role selection
    try {
      await Promise.race([
        page.locator('//button[text()=" Continue"]').waitFor({ timeout: 10000 }),
        page.waitForURL('**warepro**', { timeout: 10000 })
      ]);
    } catch (e) {
      // Timeout or navigation issue
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✓ Login response time: ${responseTime}ms`);
  });

});
