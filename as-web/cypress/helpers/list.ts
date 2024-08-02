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
