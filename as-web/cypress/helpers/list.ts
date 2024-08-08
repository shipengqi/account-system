import {waitSuccessReq} from "./request";

export function deleteFirstItemFromList(deleteTestId: string, reqAlias?: string) {
  cy.get(deleteTestId).first().click();
  deleteConfirm(reqAlias);
}

export function clickEditFirstItemFromList(editTestId: string) {
  cy.get(editTestId).first().click();
}

export function deleteConfirm(reqAlias?: string) {
  cy.get('.ant-modal-confirm-body').should('be.visible');
  cy.get('.ant-modal-confirm-body-wrapper .ant-modal-confirm-btns .ant-btn-dangerous').click();
  if (reqAlias && reqAlias !== '') {
    waitSuccessReq(reqAlias);
  }
}

export function checkFirstItemFromList(value: string) {
  cy.get('nz-table')
    .find('tbody tr:first')
    // finds first <td> element with text content matching regular expression
    .contains('td', value)
    .should('be.visible')
}

export function typeRangePicker(alias: string, start: string, end: string) {
  cy.get(alias).first().click().clear().type(`${start}{enter}`, {force: true});
  cy.get(alias).last().click().clear().type(`${end}{enter}`, {force: true});
}
