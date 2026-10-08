@saucedemo @checkout
Feature: Proceso de checkout
  Como usuario autenticado en SauceDemo
  Quiero completar el proceso de compra
  Para recibir mi pedido

  Background:
    Given que el usuario inició sesión en SauceDemo como "standard_user"

  @checkout_completo
  Scenario Outline: Checkout completo comprando "<producto>"
    When agrega el producto "<producto>" al carrito
    And va al carrito y procede al checkout
    And completa sus datos con nombre "<nombre>", apellido "<apellido>" y código postal "<codigo_postal>"
    Then el resumen muestra el producto "<producto>" con "<subtotal>"
    And el total es igual al subtotal más impuestos
    When finaliza la compra
    Then se muestra la página "Checkout: Complete!" con el mensaje "Thank you for your order!"
    And el carrito queda vacío

    Examples:
      | producto                 | nombre | apellido | codigo_postal | subtotal           |
      | Sauce Labs Backpack      | Juan   | Pérez    | 15001         | Item total: $29.99 |
      | Sauce Labs Fleece Jacket | María  | López    | 15074         | Item total: $49.99 |

  @checkout_datos_incompletos
  Scenario Outline: Checkout con datos incompletos - falta <campo>
    When agrega el producto "Sauce Labs Backpack" al carrito
    And va al carrito y procede al checkout
    And completa sus datos con nombre "<nombre>", apellido "<apellido>" y código postal "<codigo_postal>"
    Then se muestra el mensaje de error de checkout "<mensaje>"

    Examples:
      | campo         | nombre | apellido | codigo_postal | mensaje                        |
      | nombre        |        | Pérez    | 15001         | Error: First Name is required  |
      | apellido      | Juan   |          | 15001         | Error: Last Name is required   |
      | código postal | Juan   | Pérez    |               | Error: Postal Code is required |
