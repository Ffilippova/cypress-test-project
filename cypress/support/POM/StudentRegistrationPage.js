import { FormHelpers } from "../../support/utils";

export class StudentRegistrationPage {
  // Selectors
  get firstNameInput() { return '#firstName'; }
  get lastNameInput() { return '#lastName'; }
  get emailInput() { return '#userEmail'; }
  get maleGenderRadio() { return '#gender-radio-1'; }
  get femaleGenderRadio() { return '#gender-radio-2'; }
  get otherGenderRadio() { return '#gender-radio-3'; }
  get mobileInput() { return '#userNumber'; }
  get dateOfBirthInput() { return '#dateOfBirthInput'; }
  get subjectsInput() { return '#subjectsInput'; }
  get sportsHobbyCheckbox() { return '#hobbies-checkbox-1'; }
  get readingHobbyCheckbox() { return '#hobbies-checkbox-2'; }
  get musicHobbyCheckbox() { return '#hobbies-checkbox-3'; }
  get pictureUpload() { return '#uploadPicture'; }
  get currentAddressTextarea() { return '#currentAddress'; }
  get stateDropdown() { return '#state > div > div.css-1wy0on6'; }
  get cityDropdown() { return '#city > div > div.css-1wy0on6'; }
  get submitButton() { return '#submit'; }
  get confirmationModal() { return '.modal-content'; }
  get confirmationTitle() { return '#example-modal-sizes-title-lg'; }
  get confirmationTable() { return '.table-responsive'; }
  get closeButton() { return '#closeLargeModal'; }

  // Actions
  visit() {
    cy.visit('automation-practice-form');
    FormHelpers.waitForFormLoad();
    // FormHelpers.handleAdsAndOverlays();
  }

  fillPersonalInformation(userData) {
    cy.fillInputField(this.firstNameInput, userData.firstName);
    cy.fillInputField(this.lastNameInput, userData.lastName);
    cy.fillInputField(this.emailInput, userData.email);

    // Select gender
    switch (userData.gender.toLowerCase()) {
      case 'male':
        cy.selectRadioButton(this.maleGenderRadio);
        break;
      case 'female':
        cy.selectRadioButton(this.femaleGenderRadio);
        break;
      case 'other':
        cy.selectRadioButton(this.otherGenderRadio);
        break;
    }

    cy.fillInputField(this.mobileInput, userData.mobile);
  }

  fillDateOfBirth(dateData) {
    cy.selectDatePicker(
      this.dateOfBirthInput,
      dateData.year,
      dateData.month,
      dateData.day
    );
  }

  fillSubjects(subjects) {
    subjects.forEach(subject => {
      cy.get(this.subjectsInput).type(subject);
      cy.contains('.subjects-auto-complete__option', subject).click();
    });
  }

  selectHobbies(hobbies) {
    hobbies.forEach(hobby => {
      switch (hobby.toLowerCase()) {
        case 'sports':
          cy.selectCheckbox(this.sportsHobbyCheckbox);
          break;
        case 'reading':
          cy.selectCheckbox(this.readingHobbyCheckbox);
          break;
        case 'music':
          cy.selectCheckbox(this.musicHobbyCheckbox);
          break;
      }
    });
  }

  uploadPicture(fileName = 'test-image.jpg') {
    cy.uploadFile(this.pictureUpload, fileName);
  }

  fillAddress(address) {
    FormHelpers.scrollToElement(this.currentAddressTextarea);
    cy.fillInputField(this.currentAddressTextarea, address);
  }

  selectStateAndCity(state, city) {
    FormHelpers.scrollToElement(this.stateDropdown);
    cy.selectDropdownOption(this.stateDropdown, state);
    cy.selectDropdownOption(this.cityDropdown, city);
  }

  submitForm() {
    FormHelpers.scrollToElement(this.submitButton);
    cy.get(this.submitButton).click();
  }

  verifySubmissionSuccess() {
    cy.get(this.confirmationModal).should('be.visible');
    cy.get(this.confirmationTitle).should('contain.text', 'Thanks for submitting the form');
  }

  verifySubmittedData(userData) {
    const expectedData = [
      ['Student Name', `${userData.firstName} ${userData.lastName}`],
      ['Student Email', userData.email],
      ['Gender', userData.gender],
      ['Mobile', userData.mobile],
      ['Date of Birth', '15 July,1990'],
      ['Subjects', userData.subjects.join(', ')],
      ['Hobbies', userData.hobbies.join(', ')],
      ['Picture', 'test-image.jpg'],
      ['Address', userData.currentAddress],
      ['State and City', `${userData.state} ${userData.city}`]
    ];

    expectedData.forEach(([label, value]) => {
      cy.get(this.confirmationTable).within(() => {
        cy.contains('td', label).next('td').should('contain.text', value);
      });
    });
  }

  closeConfirmationModal() {
    cy.get(this.closeButton).click();
    cy.get(this.confirmationModal).should('not.exist');
  }

  // Complete form filling method
  fillCompleteForm(userData) {
    this.fillPersonalInformation(userData);
    this.fillDateOfBirth(userData.dateOfBirth);
    this.fillSubjects(userData.subjects);
    this.selectHobbies(userData.hobbies);
    this.uploadPicture();
    this.fillAddress(userData.currentAddress);
    this.selectStateAndCity(userData.state, userData.city);
  }
}