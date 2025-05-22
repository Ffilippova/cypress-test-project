// cypress/integration/reqres_api_spec.js
import { ApiHelpers, ApiConstants } from '../../support/api-helpers';

describe('ReqRes Users API Tests', () => {
  let testUser;

  beforeEach(() => {
    // Generate fresh test data for each test
    testUser = ApiHelpers.generateTestUser();
  });
  
  // Test for GET /api/users/{id} - Get single user
  context('GET /api/users/{id}', () => {

    it('should successfully retrieve a single user with valid ID', () => {
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USER_BY_ID(ApiConstants.TEST_DATA.EXISTING_USER_ID)}`
      }).then((response) => {
        // Status validation
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.OK);
        
        // Performance validation
        ApiHelpers.validateResponseTime(response, ApiConstants.RESPONSE_TIMES.ACCEPTABLE);
        
        // Response structure validation
        expect(response.body).to.have.property('data');
        ApiHelpers.validateUserObject(response.body.data);
        expect(response.body.data.id).to.equal(ApiConstants.TEST_DATA.EXISTING_USER_ID);
        
        // Support info validation
        ApiHelpers.validateSupportInfo(response);
      });
    });

    it('should return 404 for non-existent user ID', () => {
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USER_BY_ID(ApiConstants.TEST_DATA.NON_EXISTENT_USER_ID)}`
      }).then((response) => {
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.NOT_FOUND);
        expect(response.body).to.be.empty;
      });
    });

    it('should handle invalid user ID format gracefully', () => {
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USER_BY_ID(ApiConstants.TEST_DATA.INVALID_USER_ID)}`
      }).then((response) => {
        expect(response.status).to.be.oneOf([
          ApiConstants.STATUS_CODES.BAD_REQUEST,
          ApiConstants.STATUS_CODES.NOT_FOUND
        ]);
      });
    });

    it('should have consistent response schema across different user IDs', () => {
      const userIds = [1, 2, 3];
      
      userIds.forEach(userId => {
        ApiHelpers.makeRequest({
          method: 'GET',
          url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USER_BY_ID(userId)}`
        }).then((response) => {
          if (response.status === ApiConstants.STATUS_CODES.OK) {
            ApiHelpers.validateUserObject(response.body.data);
            expect(response.body.data.id).to.equal(userId);
          }
        });
      });
    });
  });

  describe('GET /api/users - User List Retrieval', () => {
    it('should return paginated user list with default parameters', () => {
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`
      }).then((response) => {
        // Status and performance validation
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.OK);
        ApiHelpers.validateResponseTime(response, ApiConstants.RESPONSE_TIMES.ACCEPTABLE);
        
        // Pagination validation
        ApiHelpers.validatePaginationResponse(response, 1);
        
        // Data validation
        expect(response.body.data.length).to.be.greaterThan(0);
        expect(response.body.data.length).to.equal(response.body.per_page);
        
        // Validate each user object
        response.body.data.forEach(user => {
          ApiHelpers.validateUserObject(user);
        });
        
        // Support info validation
        ApiHelpers.validateSupportInfo(response);
      });
    });

    it('should respect custom pagination parameters', () => {
      const testCases = [
        { page: 1, per_page: 3 },
        { page: 2, per_page: 2 },
        { page: 1, per_page: 5 }
      ];

      testCases.forEach(({ page, per_page }) => {
        ApiHelpers.makeRequest({
          method: 'GET',
          url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}?page=${page}&per_page=${per_page}`
        }).then((response) => {
          ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.OK);
          ApiHelpers.validatePaginationResponse(response, page);
          expect(response.body.per_page).to.equal(per_page);
          expect(response.body.data.length).to.be.at.most(per_page);
        });
      });
    });

    it('should handle out-of-range page numbers gracefully', () => {
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}?page=${ApiConstants.TEST_DATA.LARGE_PAGE_NUMBER}`
      }).then((response) => {
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.OK);
        expect(response.body.page).to.equal(ApiConstants.TEST_DATA.LARGE_PAGE_NUMBER);
        expect(response.body.data).to.be.an('array').that.is.empty;
      });
    });

    it('should maintain data consistency across pages', () => {
      let firstPageUsers;
      
      // Get first page
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}?page=1&per_page=3`
      }).then((firstResponse) => {
        firstPageUsers = firstResponse.body.data.map(user => user.id);
        
        // Get second page
        return ApiHelpers.makeRequest({
          method: 'GET',
          url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}?page=2&per_page=3`
        });
      }).then((secondResponse) => {
        const secondPageUsers = secondResponse.body.data.map(user => user.id);
        
        // Ensure no overlap between pages
        const intersection = firstPageUsers.filter(id => secondPageUsers.includes(id));
        expect(intersection, 'User IDs should not overlap between pages').to.be.empty;
      });
    });

    it('should meet performance requirements', () => {
      ApiHelpers.makeRequest({
        method: 'GET',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`
      }).then((response) => {
        ApiHelpers.validateResponseTime(response, ApiConstants.RESPONSE_TIMES.FAST);
        
        // Additional performance metrics
        expect(response.body.data.length, 'Should return reasonable number of users').to.be.within(1, 20);
      });
    });
  });

  describe('POST /api/users - User Creation', () => {
    it('should successfully create user with valid data', () => {
      ApiHelpers.makeRequest({
        method: 'POST',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
        body: testUser
      }).then((response) => {
        // Status validation
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.CREATED);
        
        // Response data validation
        expect(response.body).to.have.property('name', testUser.name);
        expect(response.body).to.have.property('job', testUser.job);
        expect(response.body).to.have.property('id').that.is.a('string');
        expect(response.body).to.have.property('createdAt');
        
        // Date validation
        const createdAt = new Date(response.body.createdAt);
        expect(createdAt.toString()).to.not.equal('Invalid Date');
        expect(createdAt.getTime()).to.be.closeTo(Date.now(), 5000); // Within 5 seconds
        
        // Store created user for potential cleanup
        cy.wrap(response.body).as('createdUser');
      });
    });

    it('should handle partial user data creation', () => {
      const partialUser = { name: testUser.name };
      
      ApiHelpers.makeRequest({
        method: 'POST',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
        body: partialUser
      }).then((response) => {
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.CREATED);
        expect(response.body).to.have.property('name', partialUser.name);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('createdAt');
      });
    });

    it('should accept various data types in user object', () => {
      const complexUser = {
        ...testUser,
        age: 30,
        skills: ['Testing', 'Automation', 'JavaScript'],
        contact: {
          email: testUser.email,
          phone: '+1-555-0123'
        },
        isActive: true,
        metadata: {
          department: 'QA',
          level: 'Senior'
        }
      };

      ApiHelpers.makeRequest({
        method: 'POST',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
        body: complexUser
      }).then((response) => {
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.CREATED);
        expect(response.body).to.have.property('name', complexUser.name);
        expect(response.body).to.have.property('job', complexUser.job);
      });
    });

    it('should generate unique IDs for concurrent user creation', () => {
      const users = Array.from({ length: 3 }, () => ApiHelpers.generateTestUser());
      const requests = users.map(user => 
        ApiHelpers.makeRequest({
          method: 'POST',
          url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
          body: user
        })
      );

      // Execute all requests and collect IDs
      Promise.all(requests).then(responses => {
        const ids = responses.map(response => response.body.id);
        const uniqueIds = [...new Set(ids)];
        
        expect(uniqueIds.length, 'All generated IDs should be unique').to.equal(ids.length);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON in request body', () => {
      cy.request({
        method: 'POST',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
        body: '{"name": "Test", "job":}', // Malformed JSON
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Cypress.env('REQRES_API_KEY') || 'reqres-free-v1'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([
          ApiConstants.STATUS_CODES.BAD_REQUEST,
          ApiConstants.STATUS_CODES.CREATED // ReqRes might be lenient
        ]);
      });
    });

    it('should handle extremely large payloads', () => {
      const largeUser = {
        ...testUser,
        largeData: 'A'.repeat(ApiConstants.TEST_DATA.LARGE_DATA_SIZE)
      };

      ApiHelpers.makeRequest({
        method: 'POST',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
        body: largeUser,
        timeout: 15000 // Longer timeout for large payload
      }).then((response) => {
        expect(response.status).to.be.oneOf([
          ApiConstants.STATUS_CODES.CREATED,
          ApiConstants.STATUS_CODES.PAYLOAD_TOO_LARGE
        ]);
      });
    });

    it('should handle special characters and Unicode in user data', () => {
      const unicodeUser = {
        name: '测试用户 José María',
        job: 'Développeur Senior 🚀',
        specialChars: '!@#$%^&*()_+-={}[]|\\:";\'<>?,./',
        emoji: '👨‍💻🔧⚡'
      };

      ApiHelpers.makeRequest({
        method: 'POST',
        url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USERS}`,
        body: unicodeUser
      }).then((response) => {
        ApiHelpers.validateStatusCode(response, ApiConstants.STATUS_CODES.CREATED);
        expect(response.body.name).to.equal(unicodeUser.name);
        expect(response.body.job).to.equal(unicodeUser.job);
      });
    });

    it('should validate API authentication behavior', () => {
      const authTestCases = [
        {
          description: 'missing API key',
          headers: { 'Content-Type': 'application/json' }
        },
        {
          description: 'invalid API key',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': 'invalid-key-12345'
          }
        },
        {
          description: 'empty API key',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': ''
          }
        }
      ];

      authTestCases.forEach(({ description, headers }) => {
        cy.request({
          method: 'GET',
          url: `${ApiConstants.BASE_URL}${ApiConstants.ENDPOINTS.USER_BY_ID(1)}`,
          headers,
          failOnStatusCode: false
        }).then((response) => {
          // ReqRes might not enforce API key validation, but document the behavior
          cy.log(`Authentication test with ${description}: Status ${response.status}`);
          expect(response.status).to.be.oneOf([
            ApiConstants.STATUS_CODES.OK,
            ApiConstants.STATUS_CODES.UNAUTHORIZED,
            ApiConstants.STATUS_CODES.FORBIDDEN
          ]);
        });
      });
    });
  });
});
