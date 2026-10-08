import { Then, When } from "@cucumber/cucumber";
import InventoryPage from "../../pages/saucedemo/InventoryPage";
import CartPage from "../../pages/saucedemo/CartPage";
import CheckoutPage from "../../pages/saucedemo/CheckoutPage";

const inventoryPage = new InventoryPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

When('va al carrito y procede al checkout', async () => {
    await inventoryPage.irAlCarrito();
    await cartPage.validarPaginaCarrito();
    await cartPage.irAlCheckout();
});

When('completa sus datos con nombre {string}, apellido {string} y código postal {string}',
    async (nombre: string, apellido: string, codigoPostal: string) => {
        await checkoutPage.completarDatos(nombre, apellido, codigoPostal);
    });

Then('el resumen muestra el producto {string} con {string}', async (producto: string, subtotal: string) => {
    await checkoutPage.validarResumen(producto, subtotal);
});

Then('el total es igual al subtotal más impuestos', async () => {
    await checkoutPage.validarTotalCalculado();
});

When('finaliza la compra', async () => {
    await checkoutPage.finalizarCompra();
});

Then('se muestra la página {string} con el mensaje {string}', async (titulo: string, mensaje: string) => {
    await checkoutPage.validarCompraExitosa(titulo, mensaje);
});

Then('el carrito queda vacío', async () => {
    await inventoryPage.validarCarritoSinContador();
});

Then('se muestra el mensaje de error de checkout {string}', async (mensaje: string) => {
    await checkoutPage.validarMensajeError(mensaje);
});
