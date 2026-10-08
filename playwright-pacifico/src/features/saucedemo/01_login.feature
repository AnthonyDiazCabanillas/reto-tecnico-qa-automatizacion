@saucedemo @login
Feature: Login en SauceDemo
  Como usuario de la tienda SauceDemo
  Quiero iniciar sesión con mis credenciales
  Para acceder al catálogo de productos

  Background:
    Given que el usuario está en la página de login de SauceDemo

  @login_exitoso
  Scenario Outline: Login exitoso con el usuario "<usuario>"
    When inicia sesión con usuario "<usuario>" y contraseña "<password>"
    Then se muestra la página de productos con el título "Products"

    Examples:
      | usuario                 | password     |
      | standard_user           | secret_sauce |
      | problem_user            | secret_sauce |
      | performance_glitch_user | secret_sauce |
      | visual_user             | secret_sauce |

  @login_no_exitoso
  Scenario Outline: Login no exitoso - <caso>
    When inicia sesión con usuario "<usuario>" y contraseña "<password>"
    Then se muestra el mensaje de error de login "<mensaje>"
    And el usuario permanece en la página de login

    Examples:
      | caso                  | usuario         | password      | mensaje                                                                   |
      | usuario bloqueado     | locked_out_user | secret_sauce  | Epic sadface: Sorry, this user has been locked out.                       |
      | contraseña incorrecta | standard_user   | clave_erronea | Epic sadface: Username and password do not match any user in this service |
      | usuario inexistente   | usuario_falso   | secret_sauce  | Epic sadface: Username and password do not match any user in this service |
      | usuario vacío         |                 | secret_sauce  | Epic sadface: Username is required                                        |
      | contraseña vacía      | standard_user   |               | Epic sadface: Password is required                                        |
