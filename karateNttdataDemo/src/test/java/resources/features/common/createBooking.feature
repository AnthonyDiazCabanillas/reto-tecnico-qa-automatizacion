@ignore
Feature: Helper - crear una reserva y devolver su id

  Scenario: Crear reserva
    * url bookingUrl
    * configure headers = { Accept: 'application/json', 'Content-Type': 'application/json' }
    * def body = read('classpath:resources/request/booking.json')
    Given path 'booking'
    And request body
    When method post
    Then status 200
    * def bookingId = response.bookingid
    * def booking = response.booking
