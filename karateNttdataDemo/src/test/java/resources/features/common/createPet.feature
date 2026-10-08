@ignore
Feature: Helper - crear una mascota y devolverla
  Uso: call read('classpath:resources/features/common/createPet.feature') { petName: 'Rocky', petStatus: 'available' }

  Scenario: Crear mascota
    * url urlBase
    * def body = read('classpath:resources/request/createPet.json')
    * set body.id = Math.floor(Math.random() * 900000000) + 100000000
    * set body.name = petName
    * set body.status = petStatus
    Given path 'pet'
    And request body
    When method post
    Then status 200
    * def pet = response
