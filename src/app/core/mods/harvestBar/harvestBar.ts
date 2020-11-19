
export class HarvestBar {
    private wGame: any | Window;
    private container: HTMLDivElement;
    private harvestBar: HTMLDivElement;
    private updateInterval: any;
    private interval: number = 200;

    private cellId: number;
    private duration: number;
    private remainingTime: number;

    constructor(wGame: Window | any) {
        this.wGame = wGame;
    }

    private createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'harvestBarContainer';
        this.container.className = 'harvestBarContainer';

        this.wGame.foreground.rootElement.appendChild(this.container);
    }

    private createBar() {
        this.createContainer();

        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(this.cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* harvestBar */
        this.harvestBar = document.createElement('div');
        this.harvestBar.id = 'harvestBar';
        this.harvestBar.className = 'harvestBar';
        this.container.appendChild(this.harvestBar);

        this.container.style.left = (pos.x - this.container.offsetWidth / 2) + 'px';
        this.container.style.top = (pos.y) + 'px';

        this.update();
    }

    private show() {
        this.createBar();
        this.container.style.visibility = 'visible';

        this.updateInterval = setInterval(()=>{
            this.remainingTime -= this.interval;
            this.update();
        }, this.interval);
    }

    private update() {
         let time: number = this.remainingTime / this.duration * 100;
         this.harvestBar.style.width = (time > 0 ? time : '0') + '%';
    }

    public harvestStarted(cellId: number, duration: number, skillId: number) {
        this.cellId = cellId;
        this.duration = duration * 100;
        this.remainingTime = duration * 100;
        this.show();
    }

    public destroy() {
        setTimeout(() => {
            clearInterval(this.updateInterval);
            if (this.container && this.container.parentElement) this.container.parentElement.removeChild(this.container);
        }, this.interval);
    }
}
