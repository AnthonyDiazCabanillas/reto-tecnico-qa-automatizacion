import { DataTable, Then, When } from "@cucumber/cucumber";
import InventoryPage from "../../pages/saucedemo/InventoryPage";
import CartPage from "../../pages/saucedemo/CartPage";

const inventoryPage = new InventoryPage();
const cartPage = new CartPage();

When('agrega el producto {string} al carrito', async (producto: string) => {
    await inventoryPage.agregarProducto(producto);
});

When('agrega los siguientes productos al carrito:', async function (tabla: DataTable) {
    const productos = tabla.hashes().map(fila => fila.producto);
    for (const producto of productos) {
        await inventoryPage.agregarProducto(producto);
    }
    this.productosAgregados = productos;
});

Then('el contador del carrito muestra {string}', async (cantidad: string) => {
    await inventoryPage.validarContadorCarrito(cantidad);
});

Then('el carrito contiene el producto {string} con precio {string}', async (producto: string, precio: string) => {
    await inventoryPage.irAlCarrito();
    await cartPage.validarPaginaCarrito();
    await cartPage.validarProducto(producto, precio);
    await cartPage.validarCantidadProductos(1);
});

Then('el carrito contiene todos los productos agregados', async function () {
    const productos: string[] = this.productosAgregados;
    await inventoryPage.irAlCarrito();
    await cartPage.validarPaginaCarrito();
    await cartPage.validarCantidadProductos(productos.length);
    for (const producto of productos) {
        await cartPage.validarProducto(producto);
    }
});
