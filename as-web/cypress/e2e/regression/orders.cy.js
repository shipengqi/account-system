import {
  inputType,
  selectATime,
  clearATimePicker,
  setOrderFormAliases,
  enterOrderFormRequiredInput,
  checkOrderFormRequiredInputEmpty
} from "../../helpers/form";
import {
  checkFirstItemFromList,
  deleteFirstItemFromList,
  clickEditFirstItemFromList
} from "../../helpers/list";
import {setAllOrderReqAliases, waitSuccessReq} from "../../helpers/request";
import moment from "moment/moment";

describe('Orders', () => {
  const currentDate = moment().format('YYYY-MM-DD');

  const testDates = [
    moment(currentDate).subtract(1, 'years').format('YYYY-MM-DD'), // last year
    moment(currentDate).add(1, 'years').format('YYYY-MM-DD'), // next year
    moment(currentDate).subtract(1, 'months').format('YYYY-MM-DD'), // last month
    moment(currentDate).add(1, 'months').format('YYYY-MM-DD'), // next month
    moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD'), // yesterday
    moment(currentDate).add(1, 'days').format('YYYY-MM-DD') // tomorrow
  ]

  const testOrder = {
    project: 2,
    unloadTime: currentDate,
    driver: 2,
    vehicleNumber: 1,
    freight: 1000,
    weight: 20.5,
    payroll: 200,
    comment: 'order comment'
  }

  beforeEach(() => {
    cy.visit('/#/orders');
    setAllOrderReqAliases();
    cy.wait('@listOrdersReq');
  })

  context('Add', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-order-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="order-form-modal"]').should('be.visible');
      setOrderFormAliases();
    })

    it('should be hidden when click cancel', () => {
      cy.get('@orderFormCancel').should('be.enabled').click();
      cy.get('[data-testid="order-form-modal"]').should('not.exist');
    });

    it('save button should be disabled', () => {
      enterOrderFormRequiredInput(testOrder);
      clearATimePicker('.ant-modal-body');
      cy.get('@orderFormSubmit').should('be.disabled');
    });

    it('should not be clean when click cancel', () => {
      enterOrderFormRequiredInput(testOrder);
      cy.get('[data-testid="order-form-cancel"]').click();
      cy.get('[data-testid="add-order-btn"]').click();
      cy.get('[data-testid="order-form-modal"]').should('be.visible');
      cy.get('@orderFormSubmit').should('be.enabled');
    });

    context('Add With Clean', () => {
      afterEach(() => {
        deleteFirstItemFromList('[data-testid="order-list-delete"]', '@deleteOrderReq');
      })
      it('should add a new order', () => {
        enterOrderFormRequiredInput(testOrder);
        inputType('@orderFormComment', testOrder.comment);
        cy.get('@orderFormSubmit').should('be.enabled').click();

        waitSuccessReq('@addOrderReq');
        waitSuccessReq('@listOrdersReq');
      });

      it('should add a new order with float weight', () => {
        const newOrder = Object.assign({}, testOrder);
        newOrder.weight = 20.15
        enterOrderFormRequiredInput(newOrder);
        cy.get('@orderFormSubmit').should('be.enabled').click();
        waitSuccessReq('@addOrderReq');
        waitSuccessReq('@listOrdersReq');
      });
    })
  })

  context('Update', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-order-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="order-form-modal"]').should('be.visible');
      setOrderFormAliases();
      enterOrderFormRequiredInput(testOrder);
      cy.get('@orderFormSubmit').should('be.enabled').click();

      waitSuccessReq('@addOrderReq');
      waitSuccessReq('@listOrdersReq');
    })

    afterEach(() => {
      deleteFirstItemFromList('[data-testid="order-list-delete"]', '@deleteOrderReq');
    })

    it('should clean form data after cancel edit.editor', () => {
      clickEditFirstItemFromList('[data-testid="order-list-edit"]');
      cy.get('[data-testid="order-form-cancel"]').click();
      cy.get('[data-testid="add-order-btn"]').click();
      cy.get('[data-testid="order-form-modal"]').should('be.visible');
      checkOrderFormRequiredInputEmpty();
      cy.get('[data-testid="order-form-cancel"]').click();
    })

    it('should update different dates of order', () => {
      testDates.forEach((updateDate) => {
        clickEditFirstItemFromList('[data-testid="order-list-edit"]');
        cy.get('[data-testid="order-form-modal"]').should('be.visible');

        selectATime('@orderFormUnloadTime', updateDate);
        cy.get('@orderFormSubmit').should('be.enabled').click();

        waitSuccessReq('@updateOrderReq');
        waitSuccessReq('@listOrdersReq');
        checkFirstItemFromList(updateDate);
      })
    });
  })
})
