import { expect, Page } from "@playwright/test";

/**
 * Page Object: flujo de checkout (datos del cliente, resumen y confirmación).
 */
export default class CheckoutPage {
    private get page(): Page { return global.page; }

    private Elements = {
        title: '[data-test="title"]',
        firstName: '[data-test="firstName"]',
        lastName: '[data-test="lastName"]',
        postalCode: '[data-test="postalCode"]',
        continueBtn: '[data-test="continue"]',
        finishBtn: '[data-test="finish"]',
        errorMessage: '[data-test="error"]',
        summaryItem: '[data-test="inventory-item"]',
        itemName: '[data-test="inventory-item-name"]',
        subtotal: '[data-test="subtotal-label"]',
        tax: '[data-test="tax-label"]',
        total: '[data-test="total-label"]',
        completeHeader: '[data-test="complete-header"]',
        backHomeBtn: '[data-test="back-to-products"]'
    }

    async completarDatos(nombre: string, apellido: string, codigoPostal: string) {
        await expect(this.page.locator(this.Elements.title)).toHaveText("Checkout: Your Information");
        await this.page.locator(this.Elements.firstName).fill(nombre);
        await this.page.locator(this.Elements.lastName).fill(apellido);
        await this.page.locator(this.Elements.postalCode).fill(codigoPostal);
        await this.page.locator(this.Elements.continueBtn).click();
    }

    async validarMensajeError(mensaje: string) {
        await expect(this.page.locator(this.Elements.errorMessage)).toHaveText(mensaje);
        // No debe avanzar al resumen
        await expect(this.page.locator(this.Elements.title)).toHaveText("Checkout: Your Information");
    }

    async validarResumen(producto: string, subtotal: string) {
        await expect(this.page.locator(this.Elements.title)).toHaveText("Checkout: Overview");
        await expect(this.page.locator(this.Elements.summaryItem).locator(this.Elements.itemName)).toHaveText([producto]);
        await expect(this.page.locator(this.Elements.subtotal)).toHaveText(subtotal);
    }

    /** Verifica que Total = Item total + Tax (redondeado a 2 decimales). */
    async validarTotalCalculado() {
        const monto = async (sel: string) => {
            const texto = (await this.page.locator(sel).textContent()) ?? "";
            return parseFloat(texto.replace(/[^0-9.]/g, ""));
        };
        const subtotal = await monto(this.Elements.subtotal);
        const tax = await monto(this.Elements.tax);
        const total = await monto(this.Elements.total);
        expect(total).toBeCloseTo(subtotal + tax, 2);
    }

    async finalizarCompra() {
        await this.page.locator(this.Elements.finishBtn).click();
    }

    async validarCompraExitosa(titulo: string, mensaje: string) {
        await expect(this.page).toHaveURL(/checkout-complete\.html/);
        await expect(this.page.locator(this.Elements.title)).toHaveText(titulo);
        await expect(this.page.locator(this.Elements.completeHeader)).toHaveText(mensaje);
        await expect(this.page.locator(this.Elements.backHomeBtn)).toBeVisible();
    }
}
