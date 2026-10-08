import { Browser, BrowserContext, Page } from "@playwright/test";

export {};

declare global {
    var browser: Browser;
    var context: BrowserContext;
    var page: Page;

    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit";
            ENV: "dev" | "uat";
            BASEURL: string;
            HEADLESS?: "true" | "false";
            RETRY?: string;
            SLOWMO?: string;
            TRACE?: "always";
            CI?: string;
        }
    }
}
