import { expect, Page } from "@playwright/test";

/**
 * Page Object: pantalla de Login de SauceDemo.
 * Usa selectores estables basados en el atributo data-test.
 */
export default class SauceLoginPage {
    private get page(): Page { return global.page; }

    private Elements = {
        usernameInput: '[data-test="username"]',
        passwordInput: '[data-test="password"]',
        loginBtn: '[data-test="login-button"]',
        errorMessage: '[data-test="error"]'
    }

    async navigate() {
        if (!process.env.BASEURL) throw new Error("BASEURL no está definida en src/helper/env/.env.<ENV>");
        await this.page.goto(process.env.BASEURL);
        await expect(this.page.locator(this.Elements.loginBtn)).toBeVisible();
    }

    async login(username: string, password: string) {
        await this.page.locator(this.Elements.usernameInput).fill(username);
        await this.page.locator(this.Elements.passwordInput).fill(password);
        await this.page.locator(this.Elements.loginBtn).click();
    }

    async validarMensajeError(mensaje: string) {
        await expect(this.page.locator(this.Elements.errorMessage)).toBeVisible();
        await expect(this.page.locator(this.Elements.errorMessage)).toHaveText(mensaje);
    }

    async validarQueSigueEnLogin() {
        await expect(this.page.locator(this.Elements.loginBtn)).toBeVisible();
        await expect(this.page).not.toHaveURL(/inventory\.html/);
    }
}
