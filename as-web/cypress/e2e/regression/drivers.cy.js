import {
  inputType,
  setDriverFormAliases,
  checkDriverFormRequiredInput,
  enterDriverFormRequiredInput
} from "../../helpers/form";
import {checkFirstItemFromList, clickEditFirstItemFromList, deleteFirstItemFromList} from "../../helpers/list";
import {setAllDriverReqAliases, waitSuccessReq} from "../../helpers/request";

describe('Drivers', () => {
  const testDriver = {
    name: 'testdriver',
    phone: '15672369544',
    address: 'ShangHai',
    comment: 'driver comment'
  }

  const updateDriverName = 'updateDriver';

  beforeEach(() => {
    cy.visit('/#/drivers');
    setAllDriverReqAliases();
    cy.wait('@listDriversReq');
  })

  context('Add', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-driver-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="driver-form-modal"]').should('be.visible');
      setDriverFormAliases();
    })

    it('should be hidden when click cancel', () => {
      cy.get('@driverFormCancel').should('be.enabled').click();
      cy.get('[data-testid="driver-form-modal"]').should('not.exist');
    });

    it('save button should be disabled', () => {
      enterDriverFormRequiredInput(testDriver);
      cy.get('@driverFormAddress').clear();
      cy.get('@driverFormSubmit').should('be.disabled');
    });

    context('Add With Clean', () => {
      afterEach(() => {
        deleteFirstItemFromList('[data-testid="driver-list-delete"]', '@deleteDriverReq');
      })
      it('should add a new driver', () => {
        enterDriverFormRequiredInput(testDriver);
        inputType('@driverFormComment', testDriver.comment);
        cy.get('@driverFormSubmit').should('be.enabled').click();

        waitSuccessReq('@addDriverReq');
        waitSuccessReq('@listDriversReq');
      });

      it('should add a new driver without comment', () => {
        enterDriverFormRequiredInput(testDriver);
        cy.get('@driverFormSubmit').should('be.enabled').click();
        waitSuccessReq('@addDriverReq');
        waitSuccessReq('@listDriversReq');
      });
    })
  })

  context('Update', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-driver-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="driver-form-modal"]').should('be.visible');
      setDriverFormAliases();
      enterDriverFormRequiredInput(testDriver);
      cy.get('@driverFormSubmit').should('be.enabled').click();

      waitSuccessReq('@addDriverReq');
      waitSuccessReq('@listDriversReq');
    })

    afterEach(() => {
      deleteFirstItemFromList('[data-testid="driver-list-delete"]', '@deleteDriverReq');
    })

    it('should update a driver', () => {
      clickEditFirstItemFromList('[data-testid="driver-list-edit"]');
      cy.get('[data-testid="driver-form-modal"]').should('be.visible');
      checkDriverFormRequiredInput(testDriver);

      inputType('@driverFormName', updateDriverName);
      cy.get('@driverFormSubmit').should('be.enabled').click();

      waitSuccessReq('@updateDriverReq');
      waitSuccessReq('@listDriversReq');
      checkFirstItemFromList(updateDriverName);
    });
  })
})
