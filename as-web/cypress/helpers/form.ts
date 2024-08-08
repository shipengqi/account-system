// ------------------------------------
// driver form helpers
export function setDriverFormAliases() {
  cy.get('[data-testid="driver-form-name"]').find('input').as("driverFormName");
  cy.get('[data-testid="driver-form-phone"]').find('input').as("driverFormPhone");
  cy.get('[data-testid="driver-form-address"]').find('input').as("driverFormAddress");
  cy.get('[data-testid="driver-form-comment"]').find('textarea').as("driverFormComment");
  cy.get('[data-testid="driver-form-submit"]').as("driverFormSubmit");
  cy.get('[data-testid="driver-form-cancel"]').as("driverFormCancel");
}

export function enterDriverFormRequiredInput(testDriver: any) {
  cy.get('@driverFormSubmit').should('be.disabled');

  inputType('@driverFormName', testDriver.name);
  inputType('@driverFormPhone', testDriver.phone);
  inputType('@driverFormAddress', testDriver.address);

  cy.get('@driverFormSubmit').should('be.enabled');
}

export function checkDriverFormRequiredInput(testDriver: any) {
  cy.get('@driverFormName').should('have.value', testDriver.name);
  cy.get('@driverFormPhone').should('have.value', testDriver.phone);
  cy.get('@driverFormAddress').should('have.value', testDriver.address);
}

// ------------------------------------
// vehicle form helpers
export function setVehicleFormAliases() {
  cy.get('[data-testid="vehicle-form-vehicle-number"]').find('input').as("vehicleFormVehicleNumber");
  cy.get('[data-testid="vehicle-form-brand"]').find('input').as("vehicleFormBrand");
  cy.get('[data-testid="vehicle-form-comment"]').find('textarea').as("vehicleFormComment");
  cy.get('[data-testid="vehicle-form-submit"]').as("vehicleFormSubmit");
  cy.get('[data-testid="vehicle-form-cancel"]').as("vehicleFormCancel");
}

export function enterVehicleFormRequiredInput(testVehicle: any) {
  cy.get('@vehicleFormSubmit').should('be.disabled');

  inputType('@vehicleFormVehicleNumber', testVehicle.name);
  inputType('@vehicleFormBrand', testVehicle.brand);

  cy.get('@vehicleFormSubmit').should('be.enabled');
}

export function checkVehicleFormRequiredInput(testVehicle: any) {
  cy.get('@vehicleFormVehicleNumber').should('have.value', testVehicle.name);
  cy.get('@vehicleFormBrand').should('have.value', testVehicle.brand);
}

// ------------------------------------
// project form helpers
export function setProjectFormAliases() {
  cy.get('[data-testid="project-form-name"]').find('input').as("projectFormName");
  cy.get('[data-testid="project-form-comment"]').find('textarea').as("projectFormComment");
  cy.get('[data-testid="project-form-submit"]').as("projectFormSubmit");
  cy.get('[data-testid="project-form-cancel"]').as("projectFormCancel");
}

export function enterProjectFormRequiredInput(testProject: any) {
  cy.get('@projectFormSubmit').should('be.disabled');

  inputType('@projectFormName', testProject.name);

  cy.get('@projectFormSubmit').should('be.enabled');
}

export function checkProjectFormRequiredInput(testProject: any) {
  cy.get('@projectFormName').should('have.value', testProject.name);
}

// ------------------------------------
// expenditure form helpers
export function setExpFormAliases() {
  cy.get('[data-testid="exp-form-type"]').find('input').as("expFormType");
  cy.get('[data-testid="exp-form-time"]').find('input').as("expFormTime");
  cy.get('[data-testid="exp-form-cost"]').find('input').as("expFormCost");
  cy.get('[data-testid="exp-form-vehicle-number"]').find('input').as("expFormVehicleNumber");
  cy.get('[data-testid="exp-form-comment"]').find('textarea').as("expFormComment");
  cy.get('[data-testid="exp-form-submit"]').as("expFormSubmit");
  cy.get('[data-testid="exp-form-cancel"]').as("expFormCancel");
}

export function enterExpFormRequiredInput(testExp: any) {
  cy.get('@expFormSubmit').should('be.disabled');

  selectAnOption('@expFormType', testExp.type)
  selectATime('@expFormTime', testExp.time)

  inputType('@expFormCost', testExp.cost);
  selectAnOption('@expFormVehicleNumber', testExp.vehicleNumber)

  cy.get('@expFormSubmit').should('be.enabled');
}

export function checkExpFormRequiredInput(testExp: any) {
  cy.get('@expFormType').should('have.value', testExp.type);
  cy.get('@expFormTime').should('have.value', testExp.time);
  cy.get('@expFormCost').should('have.value', testExp.cost);
  cy.get('@expFormVehicleNumber').should('have.value', testExp.vehicleNumber);
}

export function checkExpFormRequiredInputEmpty() {
  checkExpFormRequiredInput({
    type: '',
    time: '',
    cost: '',
    vehicleNumber: '',
  })
}

// ------------------------------------
// order form helpers
export function setOrderFormAliases() {
  cy.get('[data-testid="order-form-project"]').find('input').as("orderFormProject");
  cy.get('[data-testid="order-form-vehicle-number"]').find('input').as("orderFormVehicleNumber");
  cy.get('[data-testid="order-form-driver"]').find('input').as("orderFormDriver");
  cy.get('[data-testid="order-form-unload-time"]').find('input').as("orderFormUnloadTime");
  cy.get('[data-testid="order-form-freight"]').find('input').as("orderFormFreight");
  cy.get('[data-testid="order-form-weight"]').find('input').as("orderFormWeight");
  cy.get('[data-testid="order-form-payroll"]').find('input').as("orderFormPayroll");
  cy.get('[data-testid="order-form-comment"]').find('textarea').as("orderFormComment");
  cy.get('[data-testid="order-form-submit"]').as("orderFormSubmit");
  cy.get('[data-testid="order-form-cancel"]').as("orderFormCancel");
}

export function enterOrderFormRequiredInput(testOrder: any) {
  cy.get('@orderFormSubmit').should('be.disabled');

  selectAnOption('@orderFormProject', testOrder.project)
  selectAnOption('@orderFormVehicleNumber', testOrder.vehicleNumber)
  selectAnOption('@orderFormDriver', testOrder.driver)
  selectATime('@orderFormUnloadTime', testOrder.unloadTime)

  cy.get('@orderFormSubmit').should('be.enabled');
}

export function checkOrderFormRequiredInput(testOrder: any) {
  cy.get('@orderFormProject').should('have.value', testOrder.project);
  cy.get('@orderFormVehicleNumber').should('have.value', testOrder.vehicleNumber);
  cy.get('@orderFormDriver').should('have.value', testOrder.driver);
  cy.get('@orderFormUnloadTime').should('have.value', testOrder.unloadTime);
}

export function checkOrderFormRequiredInputEmpty() {
  checkOrderFormRequiredInput({
    project: '',
    unloadTime: '',
    driver: '',
    vehicleNumber: ''
  })
}

// -------------------------------
// common helpers

export function selectAnOption(alias: string, optionIndex: number) {
  cy.get(alias).click();
  cy.wait(100);
  cy.get('nz-option-item').each(($el, index) => {
    if ((index+1) === optionIndex) {
      cy.wrap($el).click({force: true});
    }
  });
}

export function selectATime(alias: string, time: string) {
  cy.get(alias).clear();
  inputTypeWithEnter(alias, time);
}

export function clearATimePicker(parent: string) {
  cy.get(parent).find('.ant-picker-clear').click({force: true});
}

export function inputType(alias: string, value: string) {
  cy.get(alias).click().clear().type(value, {force: true});
}

export function inputTypeWithEnter(alias: string, value: string) {
  cy.get(alias).click().clear().type(`${value}{enter}`);
}
