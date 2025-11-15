describe('API - Reserva de Hotel', () => {
  let bookingId;   
  let token;       
  it('Gerar Token de Autenticação', () => {
    cy.request({
      method: 'POST',
      url: 'https://restful-booker.herokuapp.com/auth',
      headers: {
        'Content-Type': 'application/json'
      },
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
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        "firstname": "Joãozinho",
        "lastname": "Silva",
        "totalprice": 100,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2025-11-12",
          "checkout": "2025-12-23"
        },
        "additionalneeds": "Sou maluco"
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      bookingId = response.body.bookingid
    })
  })
  it('Consultar Reserva pelo ID', () => {
    cy.request({
      method: 'GET',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
  it('Atualizar Reserva', () => {
    cy.request({
      method: 'PUT',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Cookie": `token=${token}`
      },
      body: {
        "firstname": "Pedro",
        "lastname": "Dela",
        "totalprice": 1000,
        "depositpaid": true,
        "bookingdates": {
          "checkin": "2025-11-14",
          "checkout": "2025-12-21"
        },
        "additionalneeds": "Sou Maluco"
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
  it('Excluir Reserva', () => {
    cy.request({
      method: 'DELETE',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(201)
    })
  })
})
