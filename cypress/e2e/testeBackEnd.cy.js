import { faker } from '@faker-js/faker';

describe('API - Reserva de Hotel', () => {
  let bookingId;   
  let token;     

  const futureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const additionalneeds = faker.lorem.words(3);
  const checkin = futureDate(7);
  const checkout = futureDate(15);

  it('Gerar Token de Autenticação', () => {
    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/auth',
      body: {
        username: "admin",
        password: "password123"
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      token = response.body.token
    })
  })

  it('Criar Reserva', () => {
    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/booking',
      headers: { "Content-Type": "application/json" },
      body: {
        firstname,
        lastname,
        totalprice: faker.number.int({ min: 50, max: 500 }),
        depositpaid: faker.datatype.boolean(),
        bookingdates: {
          checkin,
          checkout
        },
        additionalneeds
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body.booking.firstname).to.be.a('string')
      expect(response.body.booking.lastname).to.be.a('string')
      expect(response.body.booking.totalprice).to.be.a('number')
      expect(response.body.booking.depositpaid).to.be.a('boolean')
      expect(response.body.booking.additionalneeds).to.be.a('string')

      bookingId = response.body.bookingid
    })
  })

  it('Consultar Reserva pelo ID', () => {
    cy.request({
      method: 'GET',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.firstname).to.be.a('string')
      expect(response.body.lastname).to.be.a('string')
      expect(response.body.totalprice).to.be.a('number')
      expect(response.body.depositpaid).to.be.a('boolean')
      expect(response.body.additionalneeds).to.be.a('string')

    })
  })

  it('Atualizar Reserva', () => {

    const payload = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 300, max: 1500 }),
      depositpaid: true,
      bookingdates: {
        checkin: futureDate(5),
        checkout: futureDate(12)
      },
      additionalneeds: faker.lorem.words(2)
    };

    cy.request({
      method: 'PUT',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cookie": `token=${token}`
      },
      body: payload
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.firstname).to.eq(payload.firstname);
      expect(response.body.lastname).to.eq(payload.lastname);
      expect(response.body.totalprice).to.eq(payload.totalprice);
      expect(response.body.depositpaid).to.eq(true);
    })
  })

  it('Excluir Reserva', () => {
    cy.request({
      method: 'DELETE',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: { "Cookie": `token=${token}` }
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })

})
