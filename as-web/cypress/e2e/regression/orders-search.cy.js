import {
  clearATimePicker,
  enterOrderFormRequiredInput,
  selectAnOption,
  selectATime,
  setOrderFormAliases
} from "../../helpers/form";
import {clickEditFirstItemFromList, deleteConfirm, deleteFirstItemFromList} from "../../helpers/list";
import {setAllOrderReqAliases, waitSuccessReq} from "../../helpers/request";
import moment from "moment/moment";

describe('Orders Search', () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const nextMonthDate = moment(currentDate).add(1, 'months').format('YYYY-MM-DD');
  const endOfNextMonth = moment(nextMonthDate).endOf("month").format('YYYY-MM-DD');

  const testOrders = [
    // same vehicle number, different driver
    {
      project: 1,
      unloadTime: nextMonthDate,
      driver: 1,
      vehicleNumber: 1,
    },
    {
      project: 1,
      unloadTime: nextMonthDate,
      driver: 2,
      vehicleNumber: 1,
    },
    // same driver, different vehicle number
    {
      project: 2,
      unloadTime: nextMonthDate,
      driver: 1,
      vehicleNumber: 1,
    },
    {
      project: 2,
      unloadTime: nextMonthDate,
      driver: 1,
      vehicleNumber: 2,
    },
  ]

  context('Search With Filters', () => {
    beforeEach(() => {
      cy.visit('/#/orders');
      setAllOrderReqAliases();
      cy.wait('@listOrdersReq');
    })

    after(() => {
      cy.reload();
      cy.wait('@listOrdersReq');
      cy.get('[data-testid="order-search-unload-time"]').find('input').as('orderSearchRange');
      cy.get('@orderSearchRange').first().click().clear().type(`${nextMonthDate}{enter}`);
      cy.get('@orderSearchRange').last().click().clear().type(`${endOfNextMonth}{enter}`);
      cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
      waitSuccessReq('@listOrdersReq');
      cy.get('tbody tr').should('have.length', 4);

      for (let i = 0; i < 4; i ++) {
        deleteFirstItemFromList('[data-testid="order-list-delete"]', '@deleteOrderReq');
        waitSuccessReq('@listOrdersReq');
      }
    })

    context('prepare', () => {
      it('should add all orders', () => {
        testOrders.forEach((order) => {
          cy.get('[data-testid="add-order-btn"]')
            .should('be.enabled').click();
          cy.get('[data-testid="order-form-modal"]').should('be.visible');
          setOrderFormAliases();
          enterOrderFormRequiredInput(order);
          cy.get('@orderFormSubmit').should('be.enabled').click();

          waitSuccessReq('@addOrderReq');
          waitSuccessReq('@listOrdersReq');
        })
      });
    })

    context('search', () => {
      beforeEach(() => {
        cy.get('[data-testid="order-search-unload-time"]').find('input').as('orderSearchRange');
        cy.get('@orderSearchRange').first().click().type(`${nextMonthDate}{enter}`);
        cy.get('@orderSearchRange').last().type(`${endOfNextMonth}{enter}`);
      });

      it('should search four orders only with date filter', () => {
        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('tbody tr').should('have.length', 4);
      });

      it('should search two orders if project equal to 1', () => {
        selectAnOption('[data-testid="order-search-project"]', 1);
        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('tbody tr').should('have.length', 2);
      });

      it('should search three orders if driver equal to 1', () => {
        selectAnOption('[data-testid="order-search-driver"]', 1);
        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('tbody tr').should('have.length', 3);
      });

      it('should search one order if driver equal to 2', () => {
        selectAnOption('[data-testid="order-search-driver"]', 2);
        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('tbody tr').should('have.length', 1);
      });


      it('should search three orders if vehicle equal to 1', () => {
        selectAnOption('[data-testid="order-search-vehicle-number"]', 1);
        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('tbody tr').should('have.length', 3);
      });

      it('should search one order if vehicle equal to 2', () => {
        selectAnOption('[data-testid="order-search-vehicle-number"]', 2);
        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('tbody tr').should('have.length', 1);
      });

      context('multi filters', () => {
        beforeEach(() => {
          selectAnOption('[data-testid="order-search-project"]', 1)
        });

        it('should show two orders if vehicle equal to 1', () => {
          selectAnOption('[data-testid="order-search-vehicle-number"]', 1)
          cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
          waitSuccessReq('@listOrdersReq');

          cy.get('tbody tr').should('have.length', 2);
        });

        it('should show one order if vehicle/driver equal to 1', () => {
          selectAnOption('[data-testid="order-search-vehicle-number"]', 1);
          selectAnOption('[data-testid="order-search-driver"]', 1)
          cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
          waitSuccessReq('@listOrdersReq');

          cy.get('tbody tr').should('have.length', 1);
        });

        it('should show no data if vehicle/driver equal to 2', () => {
          selectAnOption('[data-testid="order-search-vehicle-number"]', 2);
          selectAnOption('[data-testid="order-search-driver"]', 2)
          cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
          waitSuccessReq('@listOrdersReq');

          cy.get('tbody nz-empty').should('be.visible');
        });
      })
    })
  })
})
