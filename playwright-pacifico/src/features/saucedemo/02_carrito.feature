@saucedemo @carrito
Feature: Agregar productos al carrito
  Como usuario autenticado en SauceDemo
  Quiero agregar productos al carrito
  Para luego poder comprarlos

  Background:
    Given que el usuario inició sesión en SauceDemo como "standard_user"

  @agregar_producto
  Scenario Outline: Agregar el producto "<producto>" al carrito
    When agrega el producto "<producto>" al carrito
    Then el contador del carrito muestra "1"
    And el carrito contiene el producto "<producto>" con precio "<precio>"

    Examples:
      | producto                 | precio |
      | Sauce Labs Backpack      | $29.99 |
      | Sauce Labs Bike Light    | $9.99  |
      | Sauce Labs Bolt T-Shirt  | $15.99 |
      | Sauce Labs Fleece Jacket | $49.99 |

  @agregar_varios_productos
  Scenario: Agregar varios productos al carrito
    When agrega los siguientes productos al carrito:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
      | Sauce Labs Onesie     |
    Then el contador del carrito muestra "3"
    And el carrito contiene todos los productos agregados
