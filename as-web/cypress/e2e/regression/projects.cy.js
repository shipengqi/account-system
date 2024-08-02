import {checkProjectFormRequiredInput, enterProjectFormRequiredInput, setProjectFormAliases} from "../../helpers/form";
import {clickEditFirstItemFromList, deleteFirstItemFromList} from "../../helpers/list";
import {setAllProjectReqAliases, waitSuccessReq} from "../../helpers/request";

describe('Projects', () => {
  const testProject = {
    name: 'testproject',
    comment: 'driver comment'
  }

  const updateProjectName = 'updateProject';

  beforeEach(() => {
    cy.visit('/#/projects');
    setAllProjectReqAliases();
    cy.wait('@listProjectsReq');
  })

  context('Add', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-project-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="project-form-modal"]').should('be.visible');
      setProjectFormAliases();
    })

    it('should be hidden when click cancel', () => {
      cy.get('@projectFormCancel').should('be.enabled').click();
      cy.get('[data-testid="project-form-modal"]').should('not.exist');
    });

    it('save button should be disabled', () => {
      enterProjectFormRequiredInput(testProject);
      cy.get('@projectFormName').clear();
      cy.get('@projectFormSubmit').should('be.disabled');
    });

    context('Add With Clean', () => {
      afterEach(() => {
        deleteFirstItemFromList('[data-testid="project-list-delete"]', '@deleteProjectReq');
      })
      it('should add a new project', () => {
        enterProjectFormRequiredInput(testProject);
        cy.get('@projectFormComment').clear().type(testProject.comment);
        cy.get('@projectFormSubmit').should('be.enabled').click();

        waitSuccessReq('@addProjectReq');
        waitSuccessReq('@listProjectsReq');
      });

      it('should add a new project without comment', () => {
        enterProjectFormRequiredInput(testProject);
        cy.get('@projectFormSubmit').should('be.enabled').click();
        waitSuccessReq('@addProjectReq');
        waitSuccessReq('@listProjectsReq');
      });
    })
  })

  context('Update', () => {
    beforeEach(() => {
      cy.get('[data-testid="add-project-btn"]')
        .should('be.enabled').click();
      cy.get('[data-testid="project-form-modal"]').should('be.visible');
      setProjectFormAliases();
      enterProjectFormRequiredInput(testProject);
      cy.get('@projectFormSubmit').should('be.enabled').click();

      waitSuccessReq('@addProjectReq');
      waitSuccessReq('@listProjectsReq');
    })

    afterEach(() => {
      deleteFirstItemFromList('[data-testid="project-list-delete"]', '@deleteProjectReq');
    })

    it('should update a project', () => {
      clickEditFirstItemFromList('[data-testid="project-list-edit"]');
      cy.get('[data-testid="project-form-modal"]').should('be.visible');
      checkProjectFormRequiredInput(testProject);

      cy.get('@projectFormName').clear().type(updateProjectName);
      cy.get('@projectFormSubmit').should('be.enabled').click();

      waitSuccessReq('@updateProjectReq');
      waitSuccessReq('@listProjectsReq');
    });
  })
})
