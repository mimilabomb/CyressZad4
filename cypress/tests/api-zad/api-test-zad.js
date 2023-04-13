
// na potrzeby tego zadania założyłam nowe konto - udostępnione tokeny nie są dla mnie istotne (mam na myśli kwestie bezpieczeństwa)
// warunki wstępne: utworzony jeden pusty board o ID = 642c792ad32f88c8b306aeee


describe('TRELLO API TEST', () => {

  const myApiKey = "2a8e157ecf77cbb80828ea00bdc17496";
  const myApiToken = "f9ba150b2269dea61a96bb24011bd292e9682daccf33a524e94a514dd4ba13d9";

  // STEP 1

  it('POSITIVE - all boards', () => {
    
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/members/me/boards?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request1');

      cy.get('@request1').then((response) => {
        expect(response.duration).to.be.lessThan(1000);
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.of.at.least(1);
        })
      })

  // STEP 2

  const idBoard = "64382e4f9d59bd29a1635505";

  it('POSITIVE - get first board', () => {
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/boards/${idBoard}?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request2');

      cy.get('@request2').then((response) => {
        expect(response.duration).to.be.lessThan(500);
        expect(response.status).to.eq(200);
        cy.wrap(JSON.stringify(response.body)).should('include', '64382e4f9d59bd29a1635505');
        })
      })
     // STEP 3

  it('POSITIVE - Change to open board', () => {
    cy.request({
      method: 'PUT',
      url: `https://api.trello.com/1/boards/${idBoard}?key=${myApiKey}&token=${myApiToken}&closed=true`,
      
      }).as('request3');

      cy.get('@request3').then((response) => {
        expect(response.duration).to.be.lessThan(2000);
        expect(response.status).to.eq(200);
        // cy.wrap(JSON.stringify(response.body)).should('include', '"closed":true');
        })
      })
  // STEP 4

  it('POSITIVE - verify that board is open', () => {
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/boards/${idBoard}?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request4');

      cy.get('@request4').then((response) => {
        expect(response.duration).to.be.lessThan(2000);
        expect(response.status).to.eq(200);
        cy.wrap(JSON.stringify(response.body)).should('include', '"closed":true');
        })
      })

  // STEP 5

  it('POSITIVE - verify there is only one member of the board ', () => {
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/boards/${idBoard}/memberships?key=${myApiKey}&token=${myApiToken}`,
      headers: {
        'Accept': 'application/json'
      },
      failOnStatusCode: false
      }).as('request5');
    
      cy.get('@request5').then((response) => {
        expect(response.duration).to.be.lessThan(1000);
        expect(response.status).to.eq(200);
        expect(response.body).to.have.lengthOf(1);
        cy.wrap(JSON.stringify(response.body)).should('include', '"memberType":"admin"');
        })
      })
  
  // STEP 6

  it('POSITIVE - Rename board to "first board - change name"', () => {

    const newName = "first board - change name";

    cy.request({
      method: 'PUT',
      url: `https://api.trello.com/1/boards/${idBoard}?name=${newName}&key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request6');

      cy.get('@request6').then((response) => {
        expect(response.duration).to.be.lessThan(1000);
        expect(response.status).to.eq(200);
        cy.wrap(JSON.stringify(response.body)).should('include', 'change');
        })
      })
     
  // STEP 7

  it('POSITIVE - Create two new lists with random names on board "first board - change name"', () => {

    for(let i = 0; i < 2; i++) {     

      const randomName = getRandomString(10);        
    
        cy.request({
          method: 'POST',
          url: `https://api.trello.com/1/lists?name=${randomName}&idBoard=${idBoard}&key=${myApiKey}&token=${myApiToken}`,
          failOnStatusCode: false
          }).as('request7');
  
          cy.get('@request7').then((response) => {
            expect(response.duration).to.be.lessThan(1000);
            expect(response.status).to.eq(200);
            expect(response.body).to.not.be.empty;
            })
         } 
      })

  // STEP 8

  it('POSITIVE - Get all lists from "first board - change name"', () => {
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/boards/${idBoard}/lists?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request8');

      cy.get('@request8').then((response) => {
        expect(response.duration).to.be.lessThan(300);
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length.of.at.least(2);
        })
      })

  // STEP 9

  it('NEGATIVE - missing token - all boards"', () => {
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/members/me/boards?key=${myApiKey}`,
      failOnStatusCode: false
      }).as('request9');

      cy.get('@request9').then((response) => {
        expect(response.duration).to.be.lessThan(500);
        expect(response.status).to.eq(400);
        cy.wrap(JSON.stringify(response.body)).should('include', 'invalid token');
        })
    })

  // STEP 10

  it('NEGATIVE - wrong ID - get board "first board"', () => {
    cy.request({
      method: 'GET',
      url: `https://api.trello.com/1/boards/0123456789?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request10');

      cy.get('@request10').then((response) => {
        expect(response.duration).to.be.lessThan(200);
        expect(response.status).to.eq(400);
        cy.wrap(JSON.stringify(response.body)).should('include', 'invalid id');
        })
    })

  // STEP 11

  it('NEGATIVE - wrong method - get all boards', () => {
    cy.request({
      method: 'PATCH',
      url: `https://api.trello.com/1/members/me/boards?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request11');

      cy.get('@request11').then((response) => {
        expect(response.duration).to.be.lessThan(200);
        expect(response.status).to.eq(404);
        })
    })

    // STEP 12

  it('POSITIVE - create board', () => {
    cy.request({
      method: 'POST',
      url: `https://api.trello.com/1/boards/?name=Board Created via API&key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request12');
  
      cy.get('@request12').then((response) => {
        expect(response.duration).to.be.lessThan(1000);
        expect(response.status).to.eq(200);
        })
    })

    // STEP 13

  it('NEGATIVE - you can not deletr board', () => {
    cy.request({
      method: 'DELETE',
      url: `https://api.trello.com/1/boards/${idBoard}/lists?key=${myApiKey}&token=${myApiToken}`,
      failOnStatusCode: false
      }).as('request13');
  
      cy.get('@request13').then((response) => {
        expect(response.duration).to.be.lessThan(300);
        expect(response.status).to.eq(404);
        })
    })
})


// --------------------------------------------------------

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function getRandomString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
