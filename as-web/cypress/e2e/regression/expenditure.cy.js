import {
  inputType,
  selectATime,
  setExpFormAliases,
  enterExpFormRequiredInput,
  checkExpFormRequiredInputEmpty
} from "../../helpers/form";
import {
  checkFirstItemFromList,
  deleteFirstItemFromList,
  clickEditFirstItemFromList
} from "../../helpers/list";
import {setAllExpReqAliases, waitSuccessReq} from "../../helpers/request";
import moment from "moment/moment";

describe('Expenditure', () => {
  const currentDate = moment().format('YYYY-MM-DD');

  const testDates = [
    moment(currentDate).subtract(1, 'years').format('YYYY-MM-DD'), // last year
    moment(currentDate).add(1, 'years').format('YYYY-MM-DD'), // next year
    moment(currentDate).subtract(1, 'months').format('YYYY-MM-DD'), // last month
    moment(currentDate).add(1, 'months').format('YYYY-MM-DD'), // next month
    moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD'), // yesterday
    moment(currentDate).add(1, 'days').format('YYYY-MM-DD') // tomorrow
  ]

  const testExp = {
    type: 3,
    time: currentDate,
    cost: 1000,
    vehicleNumber: 2,
    comment: 'expenditure comment'
  }

  beforeEach(() => {
    cy.visit('/#/expenditure');
    setAllExpReqAliases();
    cy.wait('@listExpReq');
  })

  context('Add', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-exp-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="exp-form-modal"]').should('be.visible');
      setExpFormAliases();
    })

    it('should be hidden when click cancel', () => {
      cy.get('@expFormCancel').should('be.enabled').click();
      cy.get('[data-testid="exp-form-modal"]').should('not.exist');
    });

    it('save button should be disabled', () => {
      enterExpFormRequiredInput(testExp);
      cy.get('@expFormCost').clear();
      cy.get('@expFormSubmit').should('be.disabled');
    });

    it('should not be clean when click cancel', () => {
      enterExpFormRequiredInput(testExp);
      cy.get('[data-testid="exp-form-cancel"]').click();
      cy.get('[data-testid="add-exp-btn"]').click();
      cy.get('[data-testid="exp-form-modal"]').should('be.visible');
      cy.get('@expFormSubmit').should('be.enabled');
    });

    context('Add With Clean', () => {
      afterEach(() => {
        deleteFirstItemFromList('[data-testid="exp-list-delete"]', '@deleteExpReq');
      })
      it('should add a new exp', () => {
        enterExpFormRequiredInput(testExp);
        inputType('@expFormComment', testExp.comment);
        cy.get('@expFormSubmit').should('be.enabled').click();

        waitSuccessReq('@addExpReq');
        waitSuccessReq('@listExpReq');
      });

      it('should add a new exp without comment', () => {
        enterExpFormRequiredInput(testExp);
        cy.get('@expFormSubmit').should('be.enabled').click();
        waitSuccessReq('@addExpReq');
        waitSuccessReq('@listExpReq');
      });

      it('should add a new exp with float cost', () => {
        const newExp = Object.assign({}, testExp);
        newExp.cost = 20.05
        enterExpFormRequiredInput(newExp);
        cy.get('@expFormSubmit').should('be.enabled').click();
        waitSuccessReq('@addExpReq');
        waitSuccessReq('@listExpReq');
      });
    })
  })

  context('Update', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-exp-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="exp-form-modal"]').should('be.visible');
      setExpFormAliases();
      enterExpFormRequiredInput(testExp);
      cy.get('@expFormSubmit').should('be.enabled').click();

      waitSuccessReq('@addExpReq');
      waitSuccessReq('@listExpReq');
    })

    afterEach(() => {
      deleteFirstItemFromList('[data-testid="exp-list-delete"]', '@deleteExpReq');
    })

    it('should clean form data after cancel edit.editor', () => {
      clickEditFirstItemFromList('[data-testid="exp-list-edit"]');
      cy.get('[data-testid="exp-form-cancel"]').click();
      cy.get('[data-testid="add-exp-btn"]').click();
      cy.get('[data-testid="exp-form-modal"]').should('be.visible');
      checkExpFormRequiredInputEmpty();
      cy.get('[data-testid="exp-form-cancel"]').click();
    })

    it('should update different dates of exp', () => {
      testDates.forEach((updateDate) => {
        clickEditFirstItemFromList('[data-testid="exp-list-edit"]');
        cy.get('[data-testid="exp-form-modal"]').should('be.visible');

        selectATime('@expFormTime', updateDate);
        cy.get('@expFormSubmit').should('be.enabled').click();

        waitSuccessReq('@updateExpReq');
        waitSuccessReq('@listExpReq');
        checkFirstItemFromList(updateDate);
      })
    });
  })
})
