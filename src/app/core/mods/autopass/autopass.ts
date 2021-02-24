import { Logger } from 'app/core/electron/logger.helper';
import { Mod } from '../mod';

export class AutoPass extends Mod {
    private styleTag: HTMLStyleElement;
    private container: HTMLDivElement;
    private input: HTMLInputElement;
    private isActivate: boolean = false;
    private timeOut: any;

    startMod(): void {
        Logger.info('- Enable AutoPass');

        this.insertStyleTag();

        this.on(this.wGame.dofus.connectionManager, 'GameFightStartingMessage', () => this.insertComponent());
        this.on(this.wGame.dofus.connectionManager, 'GameFightEndMessage', () => this.remove());
        this.on(this.wGame.dofus.connectionManager, 'GameFightTurnStartMessage', ({id}) => this.passTurn(id));
    }

    private passTurn(id: number) {
        if (this.isActivate && id == this.wGame.gui.playerData.id) {
            this.timeOut = setTimeout(() => {
                this.wGame.dofus.sendMessage('GameFightTurnFinishMessage', {});
            }, this.getRandomTime(1,3));
        }
    }

    private insertStyleTag() {
        this.styleTag = this.wGame.document.createElement('style');
        this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag);

        this.styleTag.innerHTML += `
        .auto-pass-container {
            position: absolute;
            z-index: 2;
            top: 0;
            right: 0;
            min-height: 20px;
            min-width: 50px;
            background-color: rgba(0,0,0,0.7);
        }`;
    }

    private insertComponent() {
        this.container = this.wGame.document.createElement('div');
        this.input = this.wGame.document.createElement('input');

        this.input.setAttribute('type', 'checkbox');
        this.input.setAttribute('id', 'autoPass');
        this.input.checked = this.isActivate;

        this.container.innerText = 'AutoPass';
        this.container.classList.add('auto-pass-container');
        this.container.append(this.input);

        this.wGame.foreground.rootElement.appendChild(this.container);
        this.input.addEventListener('click', () => {
            if (this.isActivate) clearTimeout(this.timeOut);
            this.isActivate = this.input.checked;
        });
    }

    private remove() {
        if (this.container) this.container.remove();
        if (this.input) this.input.remove();
    }

    public reset() {
        super.reset();
        this.remove();
    }
}