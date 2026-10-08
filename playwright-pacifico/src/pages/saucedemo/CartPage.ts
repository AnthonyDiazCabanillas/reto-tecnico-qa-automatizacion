import { expect, Page } from "@playwright/test";

/**
 * Page Object: carrito de compras (cart.html).
 */
export default class CartPage {
    private get page(): Page { return global.page; }

    private Elements = {
        title: '[data-test="title"]',
        cartItem: '[data-test="inventory-item"]',
        itemName: '[data-test="inventory-item-name"]',
        itemPrice: '[data-test="inventory-item-price"]',
        checkoutBtn: '[data-test="checkout"]'
    }

    async validarPaginaCarrito() {
        await expect(this.page).toHaveURL(/cart\.html/);
        await expect(this.page.locator(this.Elements.title)).toHaveText("Your Cart");
    }

    async validarProducto(nombre: string, precio?: string) {
        const item = this.page.locator(this.Elements.cartItem).filter({ hasText: nombre });
        await expect(item).toHaveCount(1);
        await expect(item.locator(this.Elements.itemName)).toHaveText(nombre);
        if (precio) {
            await expect(item.locator(this.Elements.itemPrice)).toHaveText(precio);
        }
    }

    async validarCantidadProductos(cantidad: number) {
        await expect(this.page.locator(this.Elements.cartItem)).toHaveCount(cantidad);
    }

    async irAlCheckout() {
        await this.page.locator(this.Elements.checkoutBtn).click();
    }
}
