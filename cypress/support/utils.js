export class TestDataGenerator {
  static firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
    'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Linda', 'Joseph',
    'Elizabeth', 'Thomas', 'Barbara', 'Christopher', 'Susan', 'Daniel',
    'Jessica', 'Matthew', 'Karen', 'Anthony', 'Nancy', 'Mark', 'Betty',
    'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna', 'Andrew',
    'Carol', 'Joshua', 'Ruth', 'Kenneth', 'Sharon', 'Kevin', 'Michelle'
  ];

  static lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
    'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
    'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
    'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell'
  ];

  static generateRandomFirstName() {
    return this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
  }

  static generateRandomLastName() {
    return this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
  }

  static generateRandomEmail(firstName, lastName) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}${timestamp}@example.com`;
  }

  static generateRandomPhoneNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }

  static generateRandomAddress() {
    const streetNumbers = Math.floor(Math.random() * 9999) + 1;
    const streetNames = [
      'Main Street', 'Oak Avenue', 'Park Lane', 'Cedar Drive', 'Elm Street',
      'Maple Avenue', 'Pine Road', 'First Street', 'Second Avenue', 'Third Street',
      'Washington Street', 'Lincoln Avenue', 'Jefferson Road', 'Madison Drive',
      'Jackson Street', 'Franklin Avenue', 'Roosevelt Road', 'Kennedy Drive'
    ];
    const cities = [
      'Springfield', 'Franklin', 'Georgetown', 'Salem', 'Fairview',
      'Madison', 'Oakland', 'Bristol', 'Clinton', 'Greenville'
    ];

    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const cityName = cities[Math.floor(Math.random() * cities.length)];

    return `${streetNumbers} ${streetName}, ${cityName}`;
  }

  static getTestUser() {
    const firstName = this.generateRandomFirstName();
    const lastName = this.generateRandomLastName();

    return {
      firstName: firstName,
      lastName: lastName,
      email: this.generateRandomEmail(firstName, lastName),
      gender: 'Male',
      mobile: this.generateRandomPhoneNumber().toString(),
      dateOfBirth: {
        day: '15',
        month: 'July',
        year: '1990'
      },
      subjects: ['Maths', 'Physics'],
      hobbies: ['Sports', 'Reading'],
      currentAddress: this.generateRandomAddress(),
      state: 'Uttar Pradesh',
      city: 'Lucknow'
    };
  }

  static getTestUserWithGender(gender) {
    const testUser = this.getTestUser();
    return { ...testUser, gender };
  }

  static getMinimalTestUser() {
    const firstName = this.generateRandomFirstName();
    const lastName = this.generateRandomLastName();

    return {
      firstName: firstName,
      lastName: lastName,
      gender: 'Female',
      mobile: this.generateRandomPhoneNumber().toString()
    };
  }
}

export class FormHelpers {
  static waitForFormLoad() {
    cy.get('#userForm').should('be.visible');
    cy.get('.practice-form-wrapper').should('be.visible');
  }

  static scrollToElement(selector) {
    cy.get(selector).scrollIntoView();
  }

  static handleAdsAndOverlays() {
    // Close any ads or overlays that might interfere with the test
    cy.get('body').then(($body) => {
      if ($body.find('#close-fixedban').length > 0) {
        cy.get('#close-fixedban').click();
      }
    });
  }
}