import { Logger } from "app/core/electron/logger.helper";
import { Mod } from "../mod";

export class FixeGui extends Mod{

    startMod(): void {
        //this.params = this.settings.option.vip.general.fixeGui;

        if (true /*this.params*/) {
            Logger.info('- enable fixeGui');

            let fixeGuiCss = document.createElement('style');
            fixeGuiCss.id = 'fixeGuiCss';
            fixeGuiCss.innerHTML = `
                .mapCoordinateDisplay .allianceInfo {
                    display: none;
                }

                .chat .formChat {
                    order: 1;
                    min-height: 36px;
                }
            `;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(fixeGuiCss);
        }
    }
}