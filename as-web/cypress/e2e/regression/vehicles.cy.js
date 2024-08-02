import {
  checkVehicleFormRequiredInput,
  enterVehicleFormRequiredInput,
  setVehicleFormAliases
} from "../../helpers/form";
import {clickEditFirstItemFromList, deleteFirstItemFromList} from "../../helpers/list";
import {setAllVehicleReqAliases, waitSuccessReq} from "../../helpers/request";

describe('Vehicles', () => {
  const testVehicle = {
    name: '沪A66666',
    brand: 'TEST',
    comment: 'vehicle comment'
  }

  const updateVehicleName = '沪A88888';

  beforeEach(() => {
    cy.visit('/#/vehicles');
    setAllVehicleReqAliases();
    cy.wait('@listVehiclesReq');
  })

  context('Add', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-vehicle-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="vehicle-form-modal"]').should('be.visible');
      setVehicleFormAliases();
    })

    it('should be hidden when click cancel', () => {
      cy.get('@vehicleFormCancel').should('be.enabled').click();
      cy.get('[data-testid="vehicle-form-modal"]').should('not.exist');
    });

    it('save button should be disabled', () => {
      enterVehicleFormRequiredInput(testVehicle);
      cy.get('@vehicleFormVehicleNumber').clear();
      cy.get('@vehicleFormSubmit').should('be.disabled');
    });

    context('Add With Clean', () => {
      afterEach(() => {
        deleteFirstItemFromList('[data-testid="vehicle-list-delete"]', '@deleteVehicleReq');
      })
      it('should add a new vehicle', () => {
        enterVehicleFormRequiredInput(testVehicle);
        cy.get('@vehicleFormComment').clear().type(testVehicle.comment);
        cy.get('@vehicleFormSubmit').should('be.enabled').click();

        waitSuccessReq('@addVehicleReq');
        waitSuccessReq('@listVehiclesReq');
      });

      it('should add a new vehicle without comment', () => {
        enterVehicleFormRequiredInput(testVehicle);
        cy.get('@vehicleFormSubmit').should('be.enabled').click();
        waitSuccessReq('@addVehicleReq');
        waitSuccessReq('@listVehiclesReq');
      });
    })
  })

  context('Update', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-vehicle-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="vehicle-form-modal"]').should('be.visible');
      setVehicleFormAliases();
      enterVehicleFormRequiredInput(testVehicle);
      cy.get('@vehicleFormSubmit').should('be.enabled').click();

      waitSuccessReq('@addVehicleReq');
      waitSuccessReq('@listVehiclesReq');
    })

    afterEach(() => {
      deleteFirstItemFromList('[data-testid="vehicle-list-delete"]', '@deleteVehicleReq');
    })

    it('should update a vehicle', () => {
      clickEditFirstItemFromList('[data-testid="vehicle-list-edit"]');
      cy.get('[data-testid="vehicle-form-modal"]').should('be.visible');
      checkVehicleFormRequiredInput(testVehicle);

      cy.get('@vehicleFormVehicleNumber').clear().type(updateVehicleName);
      cy.get('@vehicleFormSubmit').should('be.enabled').click();

      waitSuccessReq('@updateVehicleReq');
      waitSuccessReq('@listVehiclesReq');
    });
  })
})
