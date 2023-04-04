/// <reference types="cypress" />

describe('API tests for /cars endpoint', () => {

it('Get car list test.', () => {
    // Step 1
    cy.request({
        method: 'GET',
        url: 'http://localhost:8080/cars'
    }).as('details');
    cy.log('Request was sent.')
    
    // Step 2
    cy.get('@details').its('status').should('eq',200);
    cy.get('@details').its('body').should('not.be.empty');
    cy.log('Request status is correct and response body is not empty.');

    // Debug purpose
    cy.get('@details').then((response) => {
        cy.log('Response was: '+ JSON.stringify(response.body));
    } );
})

it('Add new car: Kia Creed', () => {
    // Step 1
    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/cars',
        body: {
            "manufacturer": "Kia",
            "model": "Ceed"
        }
    }).as('details');
    cy.log('Request was sent.')
    
    // Step 2
    cy.get('@details').its('status').should('eq',200);
    cy.get('@details').its('body').should('not.be.empty');
    cy.log('Request status is correct and response body is not empty.');
      
    // Step 3
    cy.get('@details').then((response) => {
        cy.wrap(JSON.stringify(response.body))
            .should('include', 'Kia')
            .should('include', 'Ceed')
    });
    cy.log('Verify that response includes added payload.')

})

it('Remove car', () => {
    // Set-up
    cy.log('We are creating test data for test.')
    cy.request({
        method: 'POST',
        url: 'http://localhost:8080/cars' ,
        body: {
            "manufacturer": "Tesla",
            "model": "Model S"
        }
    }).as('testData');
    cy.get('@testData').its('status').should('eq',200);

    cy.get('@testData').then((response) => {
        const carId = response.body.length;
        cy.log('Car was created with id = ' + carId); 
        Cypress.env('carId', carId);
        cy.log('Response body:' + JSON.stringify(response.body))
    })
    cy.log('Test data created correctly.')

    // Step 1 
    cy.then(()=>{
        const id = Cypress.env('carId');
        cy.request({
            method: 'DELETE',
            url: `http://localhost:8080/cars/${id}`
        }).as('details');
        cy.log('Request was sent.')
    })
   
    // Step 2
    cy.get('@details').its('status').should('eq',200);
    cy.get('@details').its('body').should('not.be.empty');
    cy.log('Request status is correct and response body is not empty.');

    // Step 3
    cy.get('@details').then((response) => {
        cy.wrap(JSON.stringify(response.body))
            .should('not.include', 'Tesla')
            .should('not.include', 'Model S')
    });
    cy.log('Verify that response excludes payload.')
})
})