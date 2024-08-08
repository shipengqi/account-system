import {
  selectAnOption,
  setExpFormAliases,
  enterExpFormRequiredInput
} from "../../helpers/form";
import {setAllExpReqAliases, waitSuccessReq} from "../../helpers/request";
import {deleteFirstItemFromList, typeRangePicker} from "../../helpers/list";

import moment from "moment/moment";

describe('Expenditure Search', () => {
  const currentDate = moment().format('YYYY-MM-DD');
  const nextMonthDate = moment(currentDate).add(1, 'months').format('YYYY-MM-DD');
  const endOfNextMonth = moment(nextMonthDate).endOf("month").format('YYYY-MM-DD');

  const nextMonthDate1 = moment(nextMonthDate).add(1, 'days').format('YYYY-MM-DD');
  const nextMonthDate2 = moment(nextMonthDate).add(2, 'days').format('YYYY-MM-DD');


  const testExps = [
    // same vehicle number, different driver
    {
      type: 1,
      time: nextMonthDate,
      cost: 1000,
      vehicleNumber: 1,
    },
    {
      type: 1,
      time: nextMonthDate1,
      cost: 1000,
      vehicleNumber: 2,
    },
    {
      type: 2,
      time: nextMonthDate2,
      cost: 1000,
      vehicleNumber: 1,
    }
  ]

  context('Search With Filters', () => {
    beforeEach(() => {
      cy.visit('/#/expenditure');
      setAllExpReqAliases();
      cy.wait('@listExpReq');
    })

    after(() => {
      cy.reload();
      cy.wait('@listExpReq');

      cy.get('[data-testid="exp-search-time"]').find('input').as('expSearchRange');
      typeRangePicker('@expSearchRange', nextMonthDate, endOfNextMonth);
      cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
      waitSuccessReq('@listExpReq');
      cy.get('tbody tr').should('have.length', 3);

      for (let i = 0; i < 3; i ++) {
        deleteFirstItemFromList('[data-testid="exp-list-delete"]', '@deleteExpReq');
        waitSuccessReq('@listExpReq');
      }
    })

    context('prepare', () => {
      it('should add all exps', () => {
        testExps.forEach((exp) => {
          cy.get('[data-testid="add-exp-btn"]')
            .should('be.enabled').click();
          cy.get('[data-testid="exp-form-modal"]').should('be.visible');
          setExpFormAliases();
          enterExpFormRequiredInput(exp);
          cy.get('@expFormSubmit').should('be.enabled').click();

          waitSuccessReq('@addExpReq');
          waitSuccessReq('@listExpReq');
        })
      });
    })

    context('search', () => {
      beforeEach(() => {
        cy.get('[data-testid="exp-search-time"]').find('input').as('expSearchRange');
        typeRangePicker('@expSearchRange', nextMonthDate, endOfNextMonth);
      });

      it('should search three exps only with date filter', () => {
        cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
        waitSuccessReq('@listExpReq');

        cy.get('tbody tr').should('have.length', 3);
      });

      it('should search two exps if type equal to 1', () => {
        selectAnOption('[data-testid="exp-search-type"]', 1);
        cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
        waitSuccessReq('@listExpReq');

        cy.get('tbody tr').should('have.length', 2);
      });

      it('should search one exp if type equal to 2', () => {
        selectAnOption('[data-testid="exp-search-type"]', 2);
        cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
        waitSuccessReq('@listExpReq');

        cy.get('tbody tr').should('have.length', 1);
        cy.get('tbody nz-empty').should('not.exist');
      });


      it('should search two exps if vehicle equal to 2', () => {
        selectAnOption('[data-testid="exp-search-vehicle-number"]', 1);
        cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
        waitSuccessReq('@listExpReq');

        cy.get('tbody tr').should('have.length', 2);
      });

      context('multi filters', () => {
        beforeEach(() => {
          selectAnOption('[data-testid="exp-search-type"]', 1)
        });

        it('should one exp if vehicle equal to 1', () => {
          selectAnOption('[data-testid="exp-search-vehicle-number"]', 1);
          cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
          waitSuccessReq('@listExpReq');

          cy.get('tbody tr').should('have.length', 1);
          cy.get('tbody nz-empty').should('not.exist');
        });
      })
    })

    context('order', () => {
      beforeEach(() => {
        cy.get('[data-testid="exp-search-time"]').find('input').as('expSearchRange');
        typeRangePicker('@expSearchRange', nextMonthDate, endOfNextMonth);

        cy.get('[data-testid="search-exp-btn"]').should('be.enabled').click();
        waitSuccessReq('@listExpReq');
      });

      it('should be ordered by expend time', () => {
        cy.get('table thead nz-table-sorters').click();
        waitSuccessReq('@listExpReq');
        cy.get('nz-table').find('tbody tr:first')
          .contains('td', nextMonthDate)
          .should('be.visible')

        cy.get('table thead nz-table-sorters').click();
        waitSuccessReq('@listExpReq');

        cy.get('nz-table').find('tbody tr:first')
          .contains('td', nextMonthDate2)
          .should('be.visible')
      })
    })
  })
})
