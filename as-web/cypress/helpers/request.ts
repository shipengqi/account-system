export function setAllDriverReqAliases() {
  cy.intercept('GET', Cypress.config().baseUrl + '/api/v1/drivers*').as('listDriversReq');
  cy.intercept('POST', Cypress.config().baseUrl + '/api/v1/drivers').as('addDriverReq');
  cy.intercept('PUT', Cypress.config().baseUrl + '/api/v1/drivers').as('updateDriverReq');
  cy.intercept('DELETE', Cypress.config().baseUrl + '/api/v1/drivers*').as('deleteDriverReq');
}

export function setAllVehicleReqAliases() {
  cy.intercept('GET', Cypress.config().baseUrl + '/api/v1/vehicles*').as('listVehiclesReq');
  cy.intercept('POST', Cypress.config().baseUrl + '/api/v1/vehicles').as('addVehicleReq');
  cy.intercept('PUT', Cypress.config().baseUrl + '/api/v1/vehicles').as('updateVehicleReq');
  cy.intercept('DELETE', Cypress.config().baseUrl + '/api/v1/vehicles*').as('deleteVehicleReq');
}

export function setAllProjectReqAliases() {
  cy.intercept('GET', Cypress.config().baseUrl + '/api/v1/projects*').as('listProjectsReq');
  cy.intercept('POST', Cypress.config().baseUrl + '/api/v1/projects').as('addProjectReq');
  cy.intercept('PUT', Cypress.config().baseUrl + '/api/v1/projects').as('updateProjectReq');
  cy.intercept('DELETE', Cypress.config().baseUrl + '/api/v1/projects*').as('deleteProjectReq');
}

export function setAllOrderReqAliases() {
  cy.intercept('GET', Cypress.config().baseUrl + '/api/v1/orders*').as('listOrdersReq');
  cy.intercept('POST', Cypress.config().baseUrl + '/api/v1/orders').as('addOrderReq');
  cy.intercept('PUT', Cypress.config().baseUrl + '/api/v1/orders').as('updateOrderReq');
  cy.intercept('DELETE', Cypress.config().baseUrl + '/api/v1/orders*').as('deleteOrderReq');
}

export function setAllExpReqAliases() {
  cy.intercept('GET', Cypress.config().baseUrl + '/api/v1/expenditures*').as('listExpReq');
  cy.intercept('POST', Cypress.config().baseUrl + '/api/v1/expenditures').as('addExpReq');
  cy.intercept('PUT', Cypress.config().baseUrl + '/api/v1/expenditures').as('updateExpReq');
  cy.intercept('DELETE', Cypress.config().baseUrl + '/api/v1/expenditures*').as('deleteExpReq');
}

export function waitSuccessReq(alias: string) {
  cy.wait(alias).its('response.statusCode').should('eq', 200);
}
