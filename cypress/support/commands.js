Cypress.Commands.add('fillInputField', (selector, value) => {
    cy.get(selector).clear().type(value);
  });
  
  Cypress.Commands.add('selectCheckbox', (selector) => {
    cy.get(selector).check({ force: true });
  });
  
  Cypress.Commands.add('selectRadioButton', (selector) => {
    cy.get(selector).check({ force: true });
  });
  
  Cypress.Commands.add('selectDropdownOption', (selector, option) => {
    cy.get(selector).click( {force: true });
    cy.contains(option).click({ force: true });
  });
  
  Cypress.Commands.add('uploadFile', (selector, fileName) => {
    cy.get(selector).selectFile(`cypress/fixtures/${fileName}`, { force: true });
  });
  
  Cypress.Commands.add('selectDatePicker', (dateSelector, year, month, day) => {
    cy.get(dateSelector).click();
    cy.get('.react-datepicker__year-select').select(year);
    cy.get('.react-datepicker__month-select').select(month);
    cy.get(`.react-datepicker__day--0${day.toString().padStart(2, '0')}`).click();
  });