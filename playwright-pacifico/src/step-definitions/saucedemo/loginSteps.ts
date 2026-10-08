import { Given, Then, When } from "@cucumber/cucumber";
import SauceLoginPage from "../../pages/saucedemo/SauceLoginPage";
import InventoryPage from "../../pages/saucedemo/InventoryPage";

const loginPage = new SauceLoginPage();
const inventoryPage = new InventoryPage();

Given('que el usuario está en la página de login de SauceDemo', async () => {
    await loginPage.navigate();
});

Given('que el usuario inició sesión en SauceDemo como {string}', async (usuario: string) => {
    await loginPage.navigate();
    await loginPage.login(usuario, "secret_sauce");
    await inventoryPage.validarTitulo("Products");
});

When('inicia sesión con usuario {string} y contraseña {string}', async (usuario: string, password: string) => {
    await loginPage.login(usuario, password);
});

Then('se muestra la página de productos con el título {string}', async (titulo: string) => {
    await inventoryPage.validarTitulo(titulo);
});

Then('se muestra el mensaje de error de login {string}', async (mensaje: string) => {
    await loginPage.validarMensajeError(mensaje);
});

Then('el usuario permanece en la página de login', async () => {
    await loginPage.validarQueSigueEnLogin();
});
