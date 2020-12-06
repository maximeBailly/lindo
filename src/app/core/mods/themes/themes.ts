import { Logger } from "app/core/electron/logger.helper";
import { Mod } from "../mod";
import { transparentDarkTheme } from "./transparentDarkTheme";

export class Themes extends Mod {
    private cssRules: Map<string, CSSStyleRule>;

    startMod(): void {

        Logger.info('- Enable ThemeMod');

        this.findCssStyleRules(transparentDarkTheme);
        this.applyTheme(transparentDarkTheme);
    }

    private findCssStyleRules(theme: any) {
        if (theme != null) {
            const classNames: string[] = [];

            // Get className from MultiCssRules
            for (let sectionName in theme['MultiCSSRules']) {
                classNames.push(...theme['MultiCSSRules'][sectionName]['selector']);
            }
            // Get className from OneCssRules
            for (let sectionName in theme['OneCSSRules']) {
                for (let className in theme['OneCSSRules'][sectionName]) {
                    classNames.push(className);
                }
            }

            let css: any[] = this.wGame.document.styleSheets[0].cssRules;
            this.cssRules = new Map();
    
            // Map className to classobject
            for(let i = 0; i<css.length; i++) {
                if (css[i].selectorText != null && classNames.includes(css[i].selectorText)) {
                    this.cssRules.set(css[i].selectorText, css[i]);
                }
            }

            css = [];
        }
    }

    private applyTheme(theme: any) {
        if (theme != null) {
            let counter: number = 0;

            // Apply style for each elements in multiCssRules
            for (let sectionName in theme['MultiCSSRules']) {
                theme['MultiCSSRules'][sectionName]['selector'].forEach((className: any) => {
                    if (this.cssRules.has(className)) {
                        const classObj = this.cssRules.get(className);

                        for(let cssRule in theme['MultiCSSRules'][sectionName]['css']) {
                            try {
                                classObj.style[cssRule] = theme['MultiCSSRules'][sectionName]['css'][cssRule];
                            } catch {
                                console.log('Error when trying to applied "' + cssRule + ' = ' + theme['MultiCSSRules'][sectionName]['css'][cssRule] + '" to "' + className + '"');
                            }
                        }
                        counter++;
                    } else {
                        console.log('"' + className + '" is not present in StyleSheet');
                    }
                });
            }

            // Apply style for each element ine OneCssRules
            for (let sectionName in theme['OneCSSRules']) {
                for (let className in theme['OneCSSRules'][sectionName]) {
                    if (this.cssRules.has(className)) {
                        const classObj = this.cssRules.get(className);

                        for (let cssRule in theme['OneCSSRules'][sectionName][className]) {
                            try {
                                classObj.style[cssRule] = theme['OneCSSRules'][sectionName][className][cssRule];
                            } catch {
                                console.log('Error when trying to applied "' + cssRule + ' = ' + theme['OneCSSRules'][sectionName][className][cssRule] + '" to "' + className + '"');
                            }
                        }
                        counter++;
                    } else {
                        console.log('"' + className + '" is not present in StyleSheet');
                    }
                }
            }

            console.log(`${counter} class overrides successfuly !`)
        }
    }
}
