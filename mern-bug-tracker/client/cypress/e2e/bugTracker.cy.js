describe('Bug Tracker E2E Tests with Mocked API', () => {
  const title = 'E2E Test Bug';
  const description = 'Testing bug creation';
  const reportedBy = 'Chima Marcel';

  beforeEach(() => {
    // Intercept GET /api/bugs and return the fixture
    cy.intercept('GET', '/api/bugs', { fixture: 'bugs.json' }).as('getBugs');

    // Intercept POST /api/bugs to simulate creating a bug
    cy.intercept('POST', '/api/bugs', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          _id: '2',
          title: req.body.title,
          description: req.body.description,
          status: 'open',
          priority: req.body.priority || 'medium',
          reportedBy: req.body.reportedBy,
          createdAt: new Date().toISOString()
        }
      });
    }).as('createBug');

    // Intercept PATCH /api/bugs/:id to simulate status update
    cy.intercept('PATCH', '/api/bugs/*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          ...req.body,
          _id: req.url.split('/').pop()
        }
      });
    }).as('updateBug');

    // Intercept DELETE /api/bugs/:id
    cy.intercept('DELETE', '/api/bugs/*', { statusCode: 200 }).as('deleteBug');

    // Visit app
    cy.visit('/');
    cy.contains('Report a Bug').should('exist');
  });

  it('creates a new bug', () => {
    cy.get('input[name="title"]').type(title);
    cy.get('textarea[name="description"]').type(description);
    cy.get('input[name="reportedBy"]').type(reportedBy);

    cy.get('button[type="submit"]').click();

    // Wait for API
    cy.wait('@createBug');

    // Check the bug appears in the list
    cy.contains(title).should('exist');
    cy.contains(reportedBy).should('exist');
  });

  it('reads/loads existing bugs', () => {
    // Wait for GET /api/bugs
    cy.wait('@getBugs');

    cy.contains(title).should('exist');
    cy.contains(reportedBy).should('exist');
  });

  it('updates a bug status', () => {
    cy.wait('@getBugs');

    cy.contains(title).closest('.bug-item').within(() => {
      cy.get('select[name="status"]').select('resolved');
    });

    cy.wait('@updateBug');

    cy.contains(title).closest('.bug-item').find('select[name="status"]').should('have.value', 'resolved');
  });

  it('deletes a bug', () => {
    cy.wait('@getBugs');

    // Auto-confirm deletion
    cy.on('window:confirm', () => true);

    cy.contains(title).closest('.bug-item').within(() => {
      cy.get('button[aria-label="Delete bug"]').click();
    });

    cy.wait('@deleteBug');

    cy.contains(title).should('not.exist');
  });
});
