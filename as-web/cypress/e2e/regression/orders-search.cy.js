import {
  enterOrderFormRequiredInput,
  selectAnOption,
  setOrderFormAliases
} from "../../helpers/form";
import {deleteFirstItemFromList, typeRangePicker} from "../../helpers/list";
import {setAllOrderReqAliases, waitSuccessReq} from "../../helpers/request";
import moment from "moment/moment";

describe('Orders Search', () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const nextMonthDate = moment(currentDate).add(1, 'months').format('YYYY-MM-DD');
  const endOfNextMonth = moment(nextMonthDate).endOf("month").format('YYYY-MM-DD');

  const nextMonthDate1 = moment(nextMonthDate).add(1, 'days').format('YYYY-MM-DD');
  const nextMonthDate2 = moment(nextMonthDate).add(2, 'days').format('YYYY-MM-DD');
  const nextMonthDate3 = moment(nextMonthDate).add(3, 'days').format('YYYY-MM-DD');

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
      unloadTime: nextMonthDate1,
      driver: 2,
      vehicleNumber: 1,
    },
    // same driver, different vehicle number
    {
      project: 2,
      unloadTime: nextMonthDate2,
      driver: 1,
      vehicleNumber: 1,
    },
    {
      project: 2,
      unloadTime: nextMonthDate3,
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
      typeRangePicker('@orderSearchRange', nextMonthDate, endOfNextMonth);

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
        typeRangePicker('@orderSearchRange', nextMonthDate, endOfNextMonth);
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

    context('order', () => {
      beforeEach(() => {
        cy.get('[data-testid="order-search-unload-time"]').find('input').as('orderSearchRange');
        typeRangePicker('@orderSearchRange', nextMonthDate, endOfNextMonth);

        cy.get('[data-testid="search-order-btn"]').should('be.enabled').click();
        waitSuccessReq('@listOrdersReq');
      });

      it('should be ordered by unload time', () => {
        cy.get('table thead nz-table-sorters').click();
        waitSuccessReq('@listOrdersReq');
        cy.get('nz-table').find('tbody tr:first')
          .contains('td', nextMonthDate)
          .should('be.visible')

        cy.get('table thead nz-table-sorters').click();
        waitSuccessReq('@listOrdersReq');

        cy.get('nz-table').find('tbody tr:first')
          .contains('td', nextMonthDate3)
          .should('be.visible')
      })
    })
  })
})
