import { Logger } from "app/core/electron/logger.helper";
import { Mod } from "../mod";

export class AutoHarvest extends Mod {
    private waitingInteractives: Map<number, InteractiveElement> = new Map();
    private usedInteractives: Map<number, InteractiveElement> = new Map();
    private skillsToUse: number[] = [6,39,40];

    private checkInterval: any;
    private refresh: number = 3000;
    private isInHarvest: boolean = false;
    private maxWeightInPercent: number = 95;
    private weightLimitReached: boolean = false;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if(/*this.params.auto_harvest*/ true) {
            Logger.info('- enable AutoHarvest');

            //this.skillsToUse = [6,39,40];

            // Start Listener
            this.onGameMapChange();
            this.onInteractiveElementUpdate();
            this.onInteractiveUseEndedMessage();
            this.onInventoryWeightMessage();

            this.checkForAwaitingInteractives();
        }
    }

    private checkForAwaitingInteractives() {
        this.checkInterval = setInterval(() => {
            if (this.waitingInteractives.size > 0 && !this.isInHarvest && !this.weightLimitReached) {

                let interactive: InteractiveElement = this.waitingInteractives.entries().next().value[1];
                this.useInteractiveElement(interactive);
                this.usedInteractives.set(interactive.elementId, interactive);
                this.waitingInteractives.delete(interactive.elementId);

            }
        }, this.refresh);
    }

    private useInteractiveElement(interactive: InteractiveElement) {
        if (!this.isInHarvest) {
            this.isInHarvest = true;
            console.log('UseInteractive -> elementId : ', interactive.elementId);

            setTimeout(() => {
                this.wGame.isoEngine.useInteractive(interactive.elementId, interactive.skillInstanceUid);   
            }, this.getRandomTime(1,3));
        }
    }

    private addInteractiveToWaitingList(interactiveElement: any) {

        if ((interactiveElement.enabledSkills != null && interactiveElement.enabledSkills.length > 0)
            && (!this.waitingInteractives.has(interactiveElement.elementId) || !this.usedInteractives.has(interactiveElement.elementId))) {

            const interactive: InteractiveElement = {elementId: interactiveElement.elementId,
                                                   elementTypeId: interactiveElement.elementTypeId,
                                                   skillId: interactiveElement.enabledSkills[0].skillId,
                                                   skillInstanceUid: interactiveElement.enabledSkills[0].skillInstanceUid}

            if (this.skillsToUse.includes(interactive.skillId)) {
                this.waitingInteractives.set(interactiveElement.elementId, interactive);
                console.log('Add interactive : ', this.waitingInteractives);
            }
        }
    }

    private onGameMapChange() {
        this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: any) => {
            try {
                this.clear();
                e.interactiveElements.forEach((interactiveElement) => {
                    this.addInteractiveToWaitingList(interactiveElement);
                });
            } catch (error) {
                Logger.info(error);
            }
        });
    }

    private onInteractiveElementUpdate() {
        this.on(this.wGame.dofus.connectionManager, 'InteractiveElementUpdatedMessage', (e: any) => {
            try {
                this.addInteractiveToWaitingList(e.interactiveElement);
            } catch (error) {
                Logger.info(error);
            }
        });
    }

    private onInteractiveUseEndedMessage() {
        this.on(this.wGame.dofus.connectionManager, 'InteractiveUseEndedMessage', (e: any) => {
            try {
                if (this.usedInteractives.has(e.elemId)) {
                    console.log('Delete interactive : ', e.elemId);
                    this.usedInteractives.delete(e.elemId);
                    this.isInHarvest = false;
                }
            } catch (error) {
                Logger.info(error);
            }
        });
    }

    private onInventoryWeightMessage() {
        this.on(this.wGame.dofus.connectionManager, 'InventoryWeightMessage', (e: any) => {
            try {
                const weightPercent = Math.round(e.weight / e.weightMax * 100);
                this.weightLimitReached = weightPercent >= this.maxWeightInPercent;
                if(this.weightLimitReached) console.log('Pods supérieur à ' + this.maxWeightInPercent);
            } catch (error) {
                Logger.info(error);
            }
        });
    }

    private clear() {
        this.waitingInteractives.clear();
        this.usedInteractives.clear();
        this.isInHarvest = false; // Use to prevent bug -> sometimes onInteractiveUseEndedMessage isn't call
        console.log('Clear all data');
    }

    public reset() {
        super.reset();
        this.checkInterval.unref();
    }
    
}
export interface InteractiveElement {
    elementId: number;
    elementTypeId: number;
    skillId: number;
    skillInstanceUid: number;
}