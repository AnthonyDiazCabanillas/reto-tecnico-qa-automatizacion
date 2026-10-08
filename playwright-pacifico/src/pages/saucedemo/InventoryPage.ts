import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object: catálogo de productos (inventory.html) y cabecera con el carrito.
 */
export default class InventoryPage {
    private get page(): Page { return global.page; }

    private Elements = {
        title: '[data-test="title"]',
        inventoryItem: '[data-test="inventory-item"]',
        itemName: '[data-test="inventory-item-name"]',
        cartBadge: '[data-test="shopping-cart-badge"]',
        cartLink: '[data-test="shopping-cart-link"]'
    }

    /** Devuelve la tarjeta del producto cuyo nombre coincide exactamente. */
    private producto(nombre: string): Locator {
        const exacto = new RegExp(`^${nombre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);
        return this.page.locator(this.Elements.inventoryItem)
            .filter({ has: this.page.locator(this.Elements.itemName, { hasText: exacto }) });
    }

    async validarTitulo(titulo: string) {
        // performance_glitch_user tarda varios segundos en iniciar sesión
        await expect(this.page).toHaveURL(/inventory\.html/, { timeout: 15000 });
        await expect(this.page.locator(this.Elements.title)).toHaveText(titulo);
        await expect(this.page.locator(this.Elements.inventoryItem).first()).toBeVisible();
    }

    async agregarProducto(nombre: string) {
        const tarjeta = this.producto(nombre);
        await expect(tarjeta).toHaveCount(1);
        await tarjeta.getByRole("button", { name: "Add to cart" }).click();
        // El botón cambia a "Remove" cuando el producto queda en el carrito
        await expect(tarjeta.getByRole("button", { name: "Remove" })).toBeVisible();
    }

    async validarContadorCarrito(cantidad: string) {
        await expect(this.page.locator(this.Elements.cartBadge)).toHaveText(cantidad);
    }

    async validarCarritoSinContador() {
        await expect(this.page.locator(this.Elements.cartBadge)).toHaveCount(0);
    }

    async irAlCarrito() {
        await this.page.locator(this.Elements.cartLink).click();
    }
}
