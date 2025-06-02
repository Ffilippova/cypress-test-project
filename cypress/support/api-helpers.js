export class ApiHelpers {
  static makeRequest(options) {
    const defaultOptions = {
      failOnStatusCode: false,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Cypress.env('REQRES_API_KEY')
      }
    };

    return cy.request({
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });
  }

  static validateUserObject(user, fieldValidations = {
    id: 'number',
    email: 'email',
    first_name: 'string',
    last_name: 'string',
    avatar: 'url'
  }) {
    Object.entries(fieldValidations).forEach(([field, validation]) => {
      expect(user).to.have.property(field);
      const value = user[field];

      switch (validation) {
        case 'number':
          expect(value).to.be.a('number');
          expect(value).to.be.greaterThan(0);
          break;
        case 'string':
          expect(value).to.be.a('string');
          expect(value).to.not.be.empty;
          break;
        case 'email':
          expect(value).to.be.a('string');
          expect(value).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
          break;
        case 'url':
          expect(value).to.be.a('string');
          expect(value).to.match(/^https?:\/\/.+/);
          break;
        default:
          expect(value).to.exist;
          expect(value).to.not.be.null;
          expect(value).to.not.be.undefined;
      }
    });
  }

  static validatePaginationResponse(response, expectedPage = 1) {
    expect(response.body).to.have.property('page', expectedPage);
    expect(response.body).to.have.property('per_page').that.is.a('number');
    expect(response.body).to.have.property('total').that.is.a('number');
    expect(response.body).to.have.property('total_pages').that.is.a('number');
    expect(response.body).to.have.property('data').that.is.an('array');
  }

  static validateSupportInfo(response) {
    expect(response.body).to.have.property('support');
    expect(response.body.support).to.have.property('url').that.is.a('string');
    expect(response.body.support).to.have.property('text').that.is.a('string');
  }

  static validateResponseTime(response, maxDuration = 2000) {
    expect(response.duration, `Response time should be less than ${maxDuration}ms`).to.be.lessThan(maxDuration);
  }

  static validateStatusCode(response, expectedStatus) {
    expect(response.status, `Expected status ${expectedStatus} but got ${response.status}`).to.equal(expectedStatus);
  }

  static generateTestUser() {
    const timestamp = Date.now();
    return {
      name: `Test User ${timestamp}`,
      job: `QA Engineer ${timestamp}`,
      email: `test.user${timestamp}@example.com`,
      age: Math.floor(Math.random() * 50) + 20
    };
  }
}

export class ApiConstants {
  static BASE_URL = Cypress.env('BASE_API_URL') || 'https://reqres.in/api';
  static ENDPOINTS = {
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    REGISTER: '/register',
    LOGIN: '/login'
  };

  static STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    PAYLOAD_TOO_LARGE: 413,
    INTERNAL_SERVER_ERROR: 500
  };

  static RESPONSE_TIMES = {
    FAST: 500,
    ACCEPTABLE: 1000,
    SLOW: 2000
  };

  static TEST_DATA = {
    EXISTING_USER_ID: 2,
    NON_EXISTENT_USER_ID: 23,
    INVALID_USER_ID: 'abc',
    LARGE_PAGE_NUMBER: 1000,
    LARGE_DATA_SIZE: 10000
  };
}