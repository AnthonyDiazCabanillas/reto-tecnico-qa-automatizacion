@booking
Feature: Reservas con autenticación por token - Restful Booker

  Background:
    * url bookingUrl
    * configure headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    * def auth = callonce read('classpath:resources/features/common/getToken.feature')
    * def token = auth.token
    * def bookingSchema = read('classpath:resources/schemas/booking.json')

  @token
  Scenario: Obtener un token de autenticación con credenciales válidas
    Given path 'auth'
    And request { username: '#(authUser)', password: '#(authPassword)' }
    When method post
    Then status 200
    And match response == { token: '#string' }
    And match response.token == '#? _.length > 0'

  @token @negativo
  Scenario: Credenciales inválidas no generan token
    Given path 'auth'
    And request { username: 'admin', password: 'clave_incorrecta' }
    When method post
    Then status 200
    And match response == { reason: 'Bad credentials' }

  @patchBooking
  Scenario Outline: Actualizar parcialmente una reserva con PATCH - <campo>
    * def creada = call read('classpath:resources/features/common/createBooking.feature')
    Given path 'booking', creada.bookingId
    And header Cookie = 'token=' + token
    And request <cambio>
    When method patch
    Then status 200
    And match response == bookingSchema
    And match response contains <cambio>

    Examples:
      | campo       | cambio                                   |
      | nombre      | { firstname: 'Tony', lastname: 'Di Ca' } |
      | precio      | { totalprice: 450 }                      |
      | necesidades | { additionalneeds: 'Late checkout' }     |

  @patchBooking @negativo
  Scenario: PATCH sin token es rechazado con 403
    * def creada = call read('classpath:resources/features/common/createBooking.feature')
    Given path 'booking', creada.bookingId
    And request { firstname: 'SinPermiso' }
    When method patch
    Then status 403

  @putBooking
  Scenario: Reemplazar una reserva completa con PUT
    * def creada = call read('classpath:resources/features/common/createBooking.feature')
    * def nueva = read('classpath:resources/request/booking.json')
    * set nueva.firstname = 'Sheccid'
    * set nueva.lastname = 'Di Ca'
    * set nueva.totalprice = 999
    * set nueva.depositpaid = false
    Given path 'booking', creada.bookingId
    And header Cookie = 'token=' + token
    And request nueva
    When method put
    Then status 200
    And match response == bookingSchema
    And match response == nueva

  @getBooking
  Scenario: Consultar una reserva por su id
    * def creada = call read('classpath:resources/features/common/createBooking.feature')
    Given path 'booking', creada.bookingId
    When method get
    Then status 200
    And match response == bookingSchema
    And match response == creada.booking

  @bookingNotFound
  Scenario: Consultar una reserva eliminada devuelve 404
    * def creada = call read('classpath:resources/features/common/createBooking.feature')
    Given path 'booking', creada.bookingId
    And header Cookie = 'token=' + token
    When method delete
    Then status 201
    Given path 'booking', creada.bookingId
    When method get
    Then status 404
