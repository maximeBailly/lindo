import { Logger } from "app/core/electron/logger.helper";
import { Mod } from "../mod";

export class AutoHarvest extends Mod {
    private readonly STATE_USE: number = 2;

    private waitingInteractives: Map<number, InteractiveElement> = new Map();
    private usedInteractives: Map<number, InteractiveElement> = new Map();
    private skillsToUse: number[] = [];

    private checkInterval: any;
    private delayedUseInteractive: ReturnType<typeof setTimeout>;
    private refresh: number = 3000;
    private isInHarvest: {status: boolean, startTime: number, elemId: number} = {status: false, startTime: -1, elemId: 0}; // add elemId
    private maxWeightInPercent: number = 95;
    private weightLimitReached: boolean = false;

    startMod(): void {
        this.params = this.settings.option.vip.general;

        if(/*this.params.auto_harvest*/ true) {
            Logger.info('- enable AutoHarvest');

            setTimeout(() => {
                this.getJobsSkills();
            }, 4000);

            // Start Listener
            this.onGameMapChange();
            this.onInteractiveElementUpdate();
            this.onInteractiveUseEndedMessage();
            this.onInventoryWeightMessage();
            this.onStatedElementUpdatedMessage()

            this.checkForAwaitingInteractives();
        }
    }

    private checkForAwaitingInteractives() {
        this.checkInterval = setInterval(() => {
            // Reset harvest
            if (this.isInHarvest.status && (new Date().getTime() - this.isInHarvest.startTime) >= 20000) {

                this.deleteUseInteractiveAtEnd(this.isInHarvest.elemId);
                console.log('Force "isInHarvest" reinitialization -> ', this.isInHarvest);
            }

            // Triggers the use of interactive
            if (this.waitingInteractives.size > 0 && this.checkAllCondition()) {

                let interactive: InteractiveElement = this.waitingInteractives.entries().next().value[1];
                this.useInteractiveElement(interactive);
                this.usedInteractives.set(interactive.elementId, interactive);
                this.waitingInteractives.delete(interactive.elementId);
            }
        }, this.refresh);
    }

    // TODO Move in autoHarvest gestionnaire
    private getJobsSkills() {
        const listJobs: Array<number> = this.wGame.gui.playerData.jobs.jobOriginalOrder;
        listJobs.forEach(jobId => {
            const job = this.wGame.gui.playerData.jobs.list[jobId];

            job.description.skills.forEach(skill => {
                if (skill._type == 'SkillActionDescriptionCollect') {
                    this.skillsToUse.push(skill.skillId);
                }
            });
        });
    }

    // TODO Check with wgame if interactive already use
    private useInteractiveElement(interactive: InteractiveElement) {
        if (!this.isInHarvest.status) {
            this.isInHarvest = {status: true, startTime: new Date().getTime(), elemId: interactive.elementId};

            this.delayedUseInteractive = setTimeout(() => {
                console.log('UseInteractive -> elementId : ', interactive.elementId);
                this.wGame.isoEngine.queueUseInteractive(interactive.elementId, interactive.skillInstanceUid);   
            }, this.getRandomTime(2,4));
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

    private deleteUseInteractiveAtEnd(elemId: number) {
        if (this.usedInteractives.has(elemId)) {
            console.log('Delete interactive : ', elemId);
            this.usedInteractives.delete(elemId);
            this.isInHarvest = {status: false, startTime: -1, elemId: 0};
        }
    }

    private loadInteractiveList(interactiveElements: any) {
        this.clear();
        interactiveElements.forEach((interactiveElement) => {
            this.addInteractiveToWaitingList(interactiveElement);
        });
    }

    private checkAllCondition(): boolean {
        return !this.isInHarvest.status                     // If player is already in harvest
            && !this.weightLimitReached                     // If weight limit reached
            && !this.wGame.gui.playerData.isFighting;       // If player is in fight
    }


    /* Listener function */

    private onStatedElementUpdatedMessage() {
        this.on(this.wGame.dofus.connectionManager, 'StatedElementUpdatedMessage', (e: any) => {
            if (this.waitingInteractives.has(e.statedElement.elementId) && e.statedElement.elementState == this.STATE_USE) {
                console.log('StatedElementUpdatedMessage -> Remove element ' + e.statedElement.elementId + ' already used...');
                this.waitingInteractives.delete(e.statedElement.elementId);
            }
        });
    }

    private onInventoryWeightMessage() {
        this.on(this.wGame.dofus.connectionManager, 'InventoryWeightMessage', (e: any) => {
            try {
                const weightPercent = Math.round(e.weight / e.weightMax * 100);
                this.weightLimitReached = weightPercent >= this.maxWeightInPercent;
                if(this.weightLimitReached) console.log('Pods supérieur à ' + this.maxWeightInPercent + '%');
            } catch (error) {
                Logger.info(error);
            }
        });
    }

    private onInteractiveElementUpdate() {
        this.on(this.wGame.dofus.connectionManager, 'InteractiveElementUpdatedMessage', (e: any) => this.addInteractiveToWaitingList(e.interactiveElement));
    }

    private onInteractiveUseEndedMessage() {
        this.on(this.wGame.dofus.connectionManager, 'InteractiveUseEndedMessage', (e: any) => this.deleteUseInteractiveAtEnd(e.elemId));
    }

    private onGameMapChange() {
        this.on(this.wGame.dofus.connectionManager, 'MapComplementaryInformationsDataMessage', (e: any) => this.loadInteractiveList(e.interactiveElements));
    }


    /* Clear and reset function */

    private clear() {
        this.waitingInteractives.clear();
        this.usedInteractives.clear();
        if (this.delayedUseInteractive) clearTimeout(this.delayedUseInteractive);
        this.isInHarvest = {status: false, startTime: -1, elemId: 0};
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