import { StudentRegistrationPage } from '../../support/POM/StudentRegistrationPage';
import { TestDataGenerator } from '../../support/utils';

describe('Student Registration Form', () => {
  let studentRegistrationPage;
  let testUser;

  before("Clear cookies and session storage", () => {
    cy.clearAllCookies();
    cy.clearAllSessionStorage();
  });
  
  beforeEach(() => {
    studentRegistrationPage = new StudentRegistrationPage();
    testUser = TestDataGenerator.getTestUser();
    // Visit the form page
    studentRegistrationPage.visit();
  });

  afterEach("CleanUp", () => {
    cy.end();
  });

  it('should successfully submit the complete registration form', () => {
    // Fill out the complete form
    studentRegistrationPage.fillCompleteForm(testUser);

    // Submit the form
    studentRegistrationPage.submitForm();

    // Verify successful submission
    studentRegistrationPage.verifySubmissionSuccess();

    // Verify submitted data
    studentRegistrationPage.verifySubmittedData(testUser);

    // Close the confirmation modal
    studentRegistrationPage.closeConfirmationModal();
  });

  it('should submit form with minimum required fields only', () => {
    const minimalUser = TestDataGenerator.getMinimalTestUser();

    // Fill only required fields
    cy.fillInputField(studentRegistrationPage.firstNameInput, minimalUser.firstName);
    cy.fillInputField(studentRegistrationPage.lastNameInput, minimalUser.lastName);
    cy.selectRadioButton(studentRegistrationPage.femaleGenderRadio);
    cy.fillInputField(studentRegistrationPage.mobileInput, minimalUser.mobile);

    studentRegistrationPage.submitForm();
    studentRegistrationPage.verifySubmissionSuccess();
  });

  it('should validate required field errors', () => {
    // Try to submit empty form
    studentRegistrationPage.submitForm();
    
    // Verify form is not submitted (no modal appears)
    cy.get(studentRegistrationPage.confirmationModal).should('not.exist');
    
    // Verify required field validations
    cy.get(studentRegistrationPage.firstNameInput).should('be.visible').
      and('have.css', 'border-color', 'rgb(220, 53, 69)');
    cy.get(studentRegistrationPage.lastNameInput).should('be.visible')
      .and('have.css', 'border-color', 'rgb(220, 53, 69)');
    cy.get(studentRegistrationPage.mobileInput).should('be.visible')
      .and('have.css', 'border-color', 'rgb(220, 53, 69)');
  });

  it('should handle different gender selections', () => {
    const genders = ['Male', 'Female', 'Other'];
    
    genders.forEach(gender => {
      const userData = TestDataGenerator.getTestUserWithGender(gender);
      
      studentRegistrationPage.fillCompleteForm(userData);
      studentRegistrationPage.submitForm();
      studentRegistrationPage.verifySubmissionSuccess();
      studentRegistrationPage.closeConfirmationModal();
    });
  });

  it('should handle multiple subject selections', () => {
    const userData = {
      ...testUser,
      subjects: ['Maths', 'Physics', 'Chemistry', 'English']
    };

    studentRegistrationPage.fillCompleteForm(userData);
    studentRegistrationPage.submitForm();
    studentRegistrationPage.verifySubmissionSuccess();
    studentRegistrationPage.verifySubmittedData(userData);
  });

  it('should handle all hobby combinations', () => {
    const allHobbies = ['Sports', 'Reading', 'Music'];
    const userData = { ...testUser, hobbies: allHobbies };

    studentRegistrationPage.fillCompleteForm(userData);
    studentRegistrationPage.submitForm();
    studentRegistrationPage.verifySubmissionSuccess();
    studentRegistrationPage.verifySubmittedData(userData);
  });
});
