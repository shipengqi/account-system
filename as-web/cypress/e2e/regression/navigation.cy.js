context('Navigation', () => {

  const menus = {
    '0': '#/dashboard',
    '1': '#/orders',
    '2': '#/expenditure',
    '3': '#/vehicles',
    '4': '#/drivers',
    '5': '#/project'
  }

  beforeEach(() => {
    cy.visit('');
  })

  it('navigation sider', () => {
    cy.get('app-layout-sider li')
      .should('have.length', 6)
      .each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.url().should('include', menus[`${index}`]);
      });
  })

  it('navigation header', () => {
    cy.get('.layout-header-logo-full')
      .should('have.attr', 'src', './assets/full-logo-white-mid.png');
    cy.get('app-header-user').should('be.visible');
    cy.get('app-header-help').should('be.visible').click();
    cy.get('.header-help-menu .ant-dropdown-menu-item').should('have.length', 2);
  })

  it('should collapse and expand navigation sider', () => {
    cy.get('.layout-header-logo-full')
      .should('have.attr', 'src', './assets/full-logo-white-mid.png');
    cy.get('app-layout-sider .layout-side-trigger span')
      .should('have.class', 'anticon-menu-fold')
      .should('be.visible').click();
    cy.get('.layout-header-logo-full')
      .should('have.attr', 'src', './assets/logo-white.png');

    cy.get('app-layout-sider li')
      .should('have.length', 6)
      .each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.url().should('include', menus[`${index}`]);
      });

    cy.get('app-layout-sider .layout-side-trigger span')
      .should('have.class', 'anticon-menu-unfold')
      .should('be.visible').click();
    cy.get('.layout-header-logo-full')
      .should('have.attr', 'src', './assets/full-logo-white-mid.png');
  })
})

context('Navigation lang', () => {
  let langs = [
    {
      id: 'en',
      lang: 'en-EN',
      menus: {
        '0': {
          title: 'Dashboard',
          url: '#/dashboard'
        },
        '1': {
          title: 'Orders',
          url: '#/orders'
        },
        '2': {
          title: 'Expenditure',
          url: '#/expenditure'
        },
        '3': {
          title: 'Vehicles',
          url: '#/vehicles'
        },
        '4': {
          title: 'Drivers',
          url: '#/drivers'
        },
        '5': {
          title: 'Projects',
          url: '#/project'
        }
      }
    },
    {
      id: 'zh',
      lang: 'zh-CN',
      menus: {
        '0': {
          title: '数据面板',
          url: '#/dashboard'
        },
        '1': {
          title: '运单管理',
          url: '#/orders'
        },
        '2': {
          title: '支出管理',
          url: '#/expenditure'
        },
        '3': {
          title: '车辆管理',
          url: '#/vehicles'
        },
        '4': {
          title: '司机管理',
          url: '#/drivers'
        },
        '5': {
          title: '项目管理',
          url: '#/project'
        }
      }
    }
  ];


  langs.forEach((lang) => {
    describe(lang.id, () => {
      beforeEach(() => {
        cy.visit('/#/dashbaord', {
          onBeforeLoad(win) {
            Object.defineProperty(win.navigator, 'language', { value: lang.lang });
            Object.defineProperty(win.navigator, 'languages', { value: [`${lang.id}`] });
            Object.defineProperty(win.navigator, 'accept_languages', { value: [`${lang.id}`] });
          },
          headers: {
            'Accept-Language': lang.id,
          },
        });
      });

      it('should display menus', () => {
        cy.get('app-layout-sider li')
          .should('have.length', 6)
          .each(($el, index, $list) => {
            cy.wrap($el)
              .should('have.text', lang.menus[`${index}`].title)
              .click();
            cy.url().should('include', lang.menus[`${index}`].url);
          });
      });
    });
  });
});
