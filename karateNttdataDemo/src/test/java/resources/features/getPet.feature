@petstore
Feature: Consulta de mascotas - GET /pet

  Background:
    * url urlBase
    * def petSchema = read('classpath:resources/schemas/pet.json')

  @getPet
  Scenario: Obtener una mascota existente por su id
    * def creada = call read('classpath:resources/features/common/createPet.feature') { petName: 'Rocky', petStatus: 'available' }
    * def petId = creada.pet.id
    # El servicio es eventualmente consistente: se reintenta hasta que la mascota esté disponible
    Given path 'pet', petId
    And retry until responseStatus == 200
    When method get
    Then status 200
    And match response == petSchema
    And match response.id == petId
    And match response.name == 'Rocky'
    And match response.status == 'available'

  @findByStatus
  Scenario Outline: Listar mascotas con estado <status>
    Given path 'pet', 'findByStatus'
    And param status = '<status>'
    When method get
    Then status 200
    And match response == '#[]'
    And match each response contains { status: '<status>' }

    Examples:
      | status    |
      | available |
      | pending   |
      | sold      |

  @petNotFound
  Scenario: Consultar una mascota eliminada devuelve 404
    * def creada = call read('classpath:resources/features/common/createPet.feature') { petName: 'Temporal', petStatus: 'sold' }
    * def petId = creada.pet.id
    Given path 'pet', petId
    And retry until responseStatus == 200
    When method delete
    Then status 200
    Given path 'pet', petId
    And retry until responseStatus == 404
    When method get
    Then status 404
    And match response == { code: 1, type: 'error', message: 'Pet not found' }
