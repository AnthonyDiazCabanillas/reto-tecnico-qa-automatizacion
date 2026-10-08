@petstore
Feature: Creación de mascotas - POST /pet

  Background:
    * url urlBase
    * def petSchema = read('classpath:resources/schemas/pet.json')

  @createPet
  Scenario Outline: Crear la mascota <petName> con estado <status>
    * def json = read('classpath:resources/request/createPet.json')
    * set json.id = Math.floor(Math.random() * 900000000) + 100000000
    * set json.name = '<petName>'
    * set json.status = '<status>'
    * set json.category.name = '<category>'
    Given path '/pet'
    And request json
    When method post
    Then status 200
    And match response == petSchema
    And match response.id == json.id
    And match response.name == '<petName>'
    And match response.status == '<status>'
    And match response.category.name == '<category>'
    And print 'Mascota creada: ', response.name, ' id: ', response.id

    Examples:
      | petName  | status    | category |
      | Vaguito  | available | dogs     |
      | Firulais | pending   | dogs     |
      | Michi    | sold      | cats     |
