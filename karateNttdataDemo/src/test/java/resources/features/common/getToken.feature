@ignore
Feature: Helper - obtener token de Restful Booker

  Scenario: Generar token
    * url bookingUrl
    Given path 'auth'
    And header Content-Type = 'application/json'
    And request { username: '#(authUser)', password: '#(authPassword)' }
    When method post
    Then status 200
    And match response.token == '#string'
    * def token = response.token
