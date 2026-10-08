@petstore
Feature: Actualización de mascotas - PUT /pet

  Background:
    * url urlBase
    * def petSchema = read('classpath:resources/schemas/pet.json')

  @updatePet
  Scenario Outline: Actualizar el nombre a <nuevoNombre> y el estado a <nuevoEstado>
    * def creada = call read('classpath:resources/features/common/createPet.feature') { petName: 'Original', petStatus: 'available' }
    * def body = creada.pet
    * set body.name = '<nuevoNombre>'
    * set body.status = '<nuevoEstado>'
    Given path 'pet'
    And request body
    When method put
    Then status 200
    And match response == petSchema
    And match response.id == body.id
    And match response.name == '<nuevoNombre>'
    And match response.status == '<nuevoEstado>'
    # Verificación con GET (se reintenta hasta ver el cambio)
    Given path 'pet', body.id
    And retry until responseStatus == 200 && response.name == '<nuevoNombre>'
    When method get
    Then status 200
    And match response.status == '<nuevoEstado>'

    Examples:
      | nuevoNombre | nuevoEstado |
      | Max         | pending     |
      | Luna        | sold        |
