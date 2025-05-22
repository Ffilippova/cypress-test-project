# Cypress E2E and API Test Suite

A comprehensive test automation suite built with Cypress following industry best practices including **Page Object Model (POM)**, **API testing**, and **reusable utility functions**.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Test Coverage](#test-coverage)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Test Data Management](#test-data-management)
- [Best Practices Implemented](#best-practices-implemented)
- [Reporting](#reporting)
- [Contributing](#contributing)

## 🎯 Project Overview

This project contains automated tests for:

1. **E2E Web Form Testing** - DemoQA Student Registration Form
2. **API Testing** - ReqRes Users API endpoints


## 🧪 Test Coverage

### E2E Tests (Web UI)
- **Target Application**: [DemoQA Practice Form](https://demoqa.com/automation-practice-form)
- **Form Fields Tested**:
  - Personal Information (Name, Email, Gender, Mobile)
  - Date of Birth (Date Picker)
  - Subjects (Multi-select with autocomplete)
  - Hobbies (Checkboxes)
  - File Upload
  - Address Information
  - State and City (Dependent dropdowns)

### API Tests
- **Target API**: [ReqRes API](https://reqres.in/api)
- **Endpoints Tested**:
  
  **GET /api/users/{id}**
  - ✅ Valid user retrieval with full validation
  - ✅ Non-existent user (404 handling)
  - ✅ Invalid ID format handling
  - ✅ Schema consistency across different users
  
  **GET /api/users**
  - ✅ Default pagination with comprehensive validation
  - ✅ Custom pagination parameters (multiple test cases)
  - ✅ Out-of-range page handling
  - ✅ Data consistency across pages
  - ✅ Performance requirements validation
  
  **POST /api/users**
  - ✅ User creation with comprehensive data validation
  - ✅ Partial data handling
  - ✅ Complex data types (arrays, objects, primitives)
  - ✅ Concurrent creation with unique ID validation
  - ✅ Malformed JSON handling
  - ✅ Large payload testing
  - ✅ Unicode and special character support
  
  **Security & Error Handling**
  - ✅ API authentication behavior testing
  - ✅ Network timeout scenarios
  - ✅ API contract and schema validation

## 📁 Project Structure

```
cypress/
├── e2e/
│   ├── ui/
│   │   └── student-registration.cy.js  # E2E form tests
│   └── api/
│   │   └── api_tests.cy.js             # Enhanced API tests
├── fixtures/
│   └── test-image.jpg               # Test file for upload
├── pages/
│   └── StudentRegistrationPage.js   # Page Object Model
├── support/
    ├── pages/
│       └── StudentRegistrationPage.js   # Page Object Model      
│   ├── commands.js                  # Custom Cypress commands
│   ├── utils.js                     # Utility functions and test data
│   ├── api-helpers.js              # API testing utilities and constants
│   └── e2e.js                       # Support file
├── cypress.config.js                # Cypress configuration
└── package.json                     # Dependencies and scripts
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cypress-test-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Add test fixtures**
   - Place a small JPG image named `test-image.jpg` in `cypress/fixtures/` directory
   - This file is used for file upload testing

4. **Add cypres.env.json file**
   - Place your reqres api key:
   ```bash
   {
    "REQRES_API_KEY": "your_api_key",
    "BASE_API_URL": "https://reqres.in/api"
   }
    ```
   - This file is used for api auth

5. **Verify installation**
   ```bash
   npx cypress verify
   ```

## 🏃 Running Tests

### Interactive Mode (Cypress Test Runner)
```bash
# Open Cypress Test Runner
npm run cy:open

# Or use yarn
yarn cy:open
```

### Headless Mode
```bash
# Run all tests
npm run cy:run

# Run specific test files
npm run test:e2e          # E2E tests only
npx cypress run --spec "cypress/e2e/api_tests.cy.js"  # API tests only

# Run with specific browser
npm run cy:run:chrome
npm run cy:run:firefox

# Run with browser visible
npm run cy:run:headed
```

### Available NPM Scripts
```json
{
  "cy:open": "cypress open",
  "cy:run": "cypress run",
  "cy:run:chrome": "cypress run --browser chrome",
  "cy:run:firefox": "cypress run --browser firefox",
  "cy:run:headed": "cypress run --headed",
  "test:e2e": "cypress run --spec 'cypress/e2e/student-registration.cy.js'"
}
```
## 📈 Reporting

### Built-in Cypress Reporting
- **Test Runner**: Interactive results during development
- **Videos**: Recorded test execution (enabled by default)
- **Screenshots**: Automatic capture on failures
- **Console Logs**: Detailed command logs and network activity

### Configuration for Reporting
```javascript
// cypress.config.js
module.exports = defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720
  }
});
```

## 🧩 Test Scenarios

### E2E Test Scenarios
1. **Complete Form Submission** - All fields with validation
2. **Minimum Required Fields** - Only mandatory fields
3. **Field Validation** - Error handling for empty required fields
4. **Multiple Gender Options** - Testing all gender selections
5. **Subject Combinations** - Multiple subject selections
6. **Hobby Combinations** - All hobby checkbox combinations

### API Test Scenarios
1. **CRUD Operations** - Create and Read user operations
2. **Pagination Testing** - Various page sizes and page numbers
3. **Error Scenarios** - 404, invalid formats, missing data
4. **Performance Testing** - Response time validation
5. **Data Integrity** - Unicode support, large payloads
6. **Edge Cases** - Boundary conditions and extreme values

## 🤝 Contributing

### Adding New Tests

1. **E2E Tests**: Add new test methods to `student-registration.cy.js` or create new spec files
2. **API Tests**: Extend `api_tests.cy.js` with additional endpoints or scenarios
3. **Page Objects**: Update `StudentRegistrationPage.js` for new UI elements
4. **Utilities**: Add new helper functions to `utils.js`

### Code Standards
- Use descriptive test names
- Follow existing naming conventions
- Add appropriate comments for complex logic
- Ensure tests are independent and can run in any order
- Use the existing custom commands and utilities

### Test Data
- Always use the `TestDataGenerator` for dynamic data
- Avoid hardcoded test data in test files
- Ensure test data is realistic and valid

## 🔧 Troubleshooting

### Common Issues

1. **File Upload Issues**
   ```bash
   # Ensure test-image.jpg exists in cypress/fixtures/
   ls cypress/fixtures/test-image.jpg
   ```

2. **Slow Test Execution**
   ```javascript
   // Adjust timeouts in cypress.config.js
   defaultCommandTimeout: 10000,
   requestTimeout: 10000
   ```

3. **Flaky Tests**
   - Use proper wait strategies
   - Handle overlays and ads with `FormHelpers.handleAdsAndOverlays()`
   - Implement retry logic for unstable elements

4. **API Test Failures**
   - Check network connectivity to reqres.in
   - Verify API endpoints are accessible
   - Review response structure changes

### Debug Mode
```bash
# Run with debug information
DEBUG=cypress:* npm run cy:run

# Run single test for debugging
npx cypress run --spec "cypress/e2e/student-registration.cy.js" --headed --no-exit
```

## 📝 License

This project is available under the MIT License.

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review Cypress documentation: [docs.cypress.io](https://docs.cypress.io)
3. Create an issue in the project repository

---

**Happy Testing! 🚀**