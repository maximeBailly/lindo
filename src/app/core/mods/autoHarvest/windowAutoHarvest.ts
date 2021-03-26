import { ShortcutsHelper } from "app/core/helpers/shortcuts.helper";
import { CustomWindowHelper } from "app/core/helpers/windowHelper/customWindow.helper";
import { DraggableWindowHelper } from "app/core/helpers/windowHelper/draggableWindow.helper";
import { InputDtHelper } from "app/core/helpers/windowHelper/inputDtHelper/inputDt.helper";
import { ButtonColor } from "app/core/helpers/windowHelper/inputDtHelper/inputs/button";
import { AutoHarvest } from "./autoHarvest";

export class WindowAutoHarvest {
    private static instance: WindowAutoHarvest;

    private wGame: any|Window;
    private params: any;
    public autoHarvest: AutoHarvest;

    private windowHelper: CustomWindowHelper;
    private window: DraggableWindowHelper;
    private inputHelper: InputDtHelper;
    private shortcutsHelper: ShortcutsHelper;

    private skillsCanUse: Array<number> = [];
    private select: HTMLDivElement;

    public static getInstance(wGame: any|Window, params: any, autoHarvest: AutoHarvest): WindowAutoHarvest {
        if (!this.instance) return new WindowAutoHarvest(wGame, params, autoHarvest);
        return this.instance;
    }

    constructor(wGame: any|Window, params: any, autoHarvest: AutoHarvest) {
        this.wGame = wGame;
        this.params = params;
        this.autoHarvest = autoHarvest;

        // Init global variable
        this.windowHelper = new CustomWindowHelper(this.wGame);
        this.window = this.windowHelper.getWindow();
        this.inputHelper = this.windowHelper.getInputsHelper;

        let autoHarvestCss = document.createElement('style');
        autoHarvestCss.id = 'autoHarvestCss';
        autoHarvestCss.innerHTML = `
            #autoHarvestWindow {
                min-width: 500px; min-height: 400px;
                left: calc(50vw - 250px);
                top: calc(50vh - 200px);
            }
            #atohvt-content {
                flex-direction: column;
            }
            .atohvt-cb-container {
                display: none;
                flex-wrap: wrap;
                margin-bottom: 10px;
            }
            .atohvt-show {
                display: flex !important;
            }
            .atohvt-checkBox {
                min-width: 190px;
            }
            .atohvt-btn {
                width: 100%;
            }
            .atohvt-minTime {
                margin-right: 5px;
            }
        `;
        this.wGame.document.querySelector('head').appendChild(autoHarvestCss);

        this.shortcutsHelper = new ShortcutsHelper(this.wGame);
        this.shortcutsHelper.bind(this.params.auto_harvest_shortcut, () => this.toggle() );

        this.wGame.dofus.connectionManager.on('JobLevelUpMessage', this.onJobLevelUp);

        this.init();
    }

    /**
     * Initialize the window after job skill was get
     * @param tryCount Only for use in function
     */
    private init(tryCount?: number) {
        if (!tryCount) tryCount = 0;
        const listJobs: Array<number> = this.wGame.gui.playerData.jobs.jobOriginalOrder;

        if (tryCount && tryCount > 25) {
            console.log('Error, AutoHarvestWindow can\'t get jobsSkills...');
            return;
        }

        if (listJobs == undefined) setTimeout(() => this.init(tryCount+1), 100);
        else {
            this.getJobsSkills(listJobs);
            this.createWindow();
        }
    }

    /**
     * Create the window and add event to input
     */
    private createWindow() {
        // Create container
        this.window.createDofusWindow('Récolte Automatique', 'autoHarvestWindow').makeDraggable().hide();
        const contentBox: HTMLDivElement = this.windowHelper.WindowContent.createContentBox('atohvt-content');
        const btnContainer: HTMLDivElement = this.wGame.document.createElement('div');
        btnContainer.style.display = 'flex';
        const timeContainer: HTMLDivElement = this.wGame.document.createElement('div');
        timeContainer.style.display = 'flex';
        timeContainer.style.margin = '0 0 5px 4px';

        // Create input
        const select: HTMLDivElement = this.inputHelper.Select.createSelect('atohvt-select', selectChoices);
        const minTimeInput: HTMLDivElement = this.inputHelper.Input.createNumberInput('atohvt-minTime', 
            {label: 'Temps min : ', value: this.autoHarvest.minTime ? this.autoHarvest.minTime.toString() : '1', inputClassName: 'atohvt-minTime'
        });
        const maxTimeInput: HTMLDivElement = this.inputHelper.Input.createNumberInput('atohvt-maxTime',
            {label: 'Temps max : ', value: this.autoHarvest.maxTime ? this.autoHarvest.maxTime.toString() : '2'});
        const start: HTMLDivElement = this.inputHelper.Button.createTextButton('atohvt-start-btn', {
            text: 'Lancer', color: ButtonColor.PRIMARY, customClassName: 'atohvt-btn'
        });
        const stop: HTMLDivElement = this.inputHelper.Button.createTextButton('atohvt-stop-btn', {
            text: 'Arrêter', color: ButtonColor.SECONDARY, customClassName: 'atohvt-btn'
        });
        this.inputHelper.Button.disabledButton(stop); // Disable stop button


        // Add input to container
        btnContainer.append(start, stop);
        timeContainer.append(minTimeInput, maxTimeInput);
        contentBox.append(timeContainer, btnContainer);
        this.window.addContent(select)
                   .addContent(contentBox);

        // Add all checkBox foreach skill
        this.createCheckBox(contentBox);


        // Add event to input
        this.inputHelper.Button.addButtonEvent(start, () => {
            this.autoHarvest.startAutoHarvest();
            this.inputHelper.Button.disabledButton(start);
            this.inputHelper.Button.enabledButton(stop);
        });
        this.inputHelper.Button.addButtonEvent(stop, () => {
            this.autoHarvest.stopAutoHarvest();
            this.inputHelper.Button.disabledButton(stop);
            this.inputHelper.Button.enabledButton(start);
        });
        this.inputHelper.Select.addSelectEvent(select, (choice) => {
            contentBox.getElementsByClassName('atohvt-show')[0].classList.remove('atohvt-show');
            this.wGame.document.getElementById('atohvt-job-' + choice.id).classList.add('atohvt-show');
        });
        this.inputHelper.Input.addInputEvent(minTimeInput, (time) => {
            this.autoHarvest.minTime = time;
        });
        this.inputHelper.Input.addInputEvent(maxTimeInput, (time) => {
            this.autoHarvest.maxTime = time;
        });

        this.select = select;
    }

    /**
     * Create checkbox for each skill and push to an categories container
     * @param contentBox The global container
     */
    private createCheckBox(contentBox: HTMLDivElement) {
        selectChoices.forEach((choices) => {
            // Create checkbox container
            const checkBoxContainer: HTMLDivElement = this.wGame.document.createElement('div');
            checkBoxContainer.id = 'atohvt-job-' + choices.id;
            checkBoxContainer.className = 'atohvt-cb-container';
            if (choices.ticked) checkBoxContainer.classList.add('atohvt-show');

            // Insert container in contentBox
            contentBox.insertAdjacentElement('afterbegin', checkBoxContainer);

            // Get all skill for the specified "jobId"
            const elmntSkill: Array<any> = elementsSkillList.filter((e) => e.jobId == +choices.id);

            // Create all checkBox for each skill
            elmntSkill.forEach((elmnt) => {
                // Create checkBox and define if enable or disabled
                const checkBox: HTMLDivElement = this.inputHelper.Checkbox.createCheckbox('atohvt-skill-' + elmnt.skillId, {
                    text: elmnt.name, isCheck: false, customClass: 'atohvt-checkBox'
                });
                if (!(+choices.id == 1) && !this.skillsCanUse.includes(+elmnt.skillId)) this.inputHelper.Checkbox.disabledCheckbox(checkBox);

                // Insert in checkBox container
                checkBoxContainer.append(checkBox);

                // Add event to checkBox
                this.inputHelper.Checkbox.addCheckboxEvent(checkBox, (isCheck) => {
                    if (isCheck) this.autoHarvest.addSkillToUse(elmnt.skillId);
                    else this.autoHarvest.removeSkillToUse(elmnt.skillId);
                });
            });
        });
    }

    /**
     * Get all know skill of the player
     * @param listJobs List of job learn by the player
     */
    private getJobsSkills(listJobs: Array<number>) {
        listJobs.forEach(jobId => {
            const job = this.wGame.gui.playerData.jobs.list[jobId];

            job.description.skills.forEach(skill => {
                if (skill._type == 'SkillActionDescriptionCollect') {
                    this.skillsCanUse.push(skill.skillId);
                }
            });
        });
    }

    /**
     * Enable the checkbox associate to jobSkill
     * @param jobSkill The skill to add
     */
    private addJobSkill(jobSkill: number) {
        const checkbox: HTMLDivElement = this.wGame.document.getElementById('atohvt-skill-' + jobSkill);
        this.inputHelper.Checkbox.enabledCheckbox(checkbox);
        this.skillsCanUse.push(jobSkill);
    }


    /**
     * Function to execute when a job level up
     * @param e The receive data
     */
    private onJobLevelUp = (e) => {
        let skills: Array<any> = e.jobsDescription.skills;
        skills = skills.filter((skill) => skill.type == 'SkillActionDescriptionCollect' && skill.max < 4);

        skills.forEach((skill) => {
            if (!this.skillsCanUse.includes(skill.skillId)) this.addJobSkill(skill.skillId);
        });
    };
    

    /**
     * Show or hide window
     */
    private toggle() {
        if (this.window.isVisible()) {
            this.window.hide();
        } else {
            this.window.show();
        }
    }

    public reset() {
        this.inputHelper.Select.removeSelect(this.select);
        this.window.destroy();
        this.wGame.document.getElementById('autoHarvestCss').remove();
        this.wGame.dofus.connectionManager.removeListener('JobLevelUpMessage', this.onJobLevelUp);
        WindowAutoHarvest.instance = null;
    }
}


const selectChoices = 
[
    {id: '1',   text: 'Général', ticked: true},
    {id: '2',   text: 'Bûcheron'},
    {id: '24',  text: 'Mineur'},
    {id: '26',  text: 'Alchimiste'},
    {id: '28',  text: 'Paysan'},
    {id: '36',  text: 'Pêcheur'}
];

const elementsSkillList = 
[
    // Général
    { jobId: 1,     skillId: '102', name: 'Puits' },
    { jobId: 1,     skillId: '42',  name: 'Tas de patates' },
    { jobId: 1,     skillId: '193', name: 'Coquillage Ité' },
    { jobId: 1,     skillId: '195', name: 'Coquillage Accio' },
    { jobId: 1,     skillId: '196', name: 'Coquillage Enstouriste' },
    { jobId: 1,     skillId: '210', name: 'Marron Glacé' },
    { jobId: 1,     skillId: '214', name: 'Cristal de Roche' },
    { jobId: 1,     skillId: '215', name: 'Perle de Sable' },
    { jobId: 1,     skillId: '237', name: 'Cawotte fraîche'},
    // Bûcheron
    { jobId: 2,     skillId: '6',   name: 'Frêne'},
    { jobId: 2,     skillId: '10',  name: 'Chêne'},
    { jobId: 2,     skillId: '33',  name: 'If' },
    { jobId: 2,     skillId: '34',  name: 'Ebène' },
    { jobId: 2,     skillId: '35',  name: 'Orme' },
    { jobId: 2,     skillId: '37',  name: 'Erable' },
    { jobId: 2,     skillId: '38',  name: 'Charme' },
    { jobId: 2,     skillId: '39',  name: 'Châtaignier' },
    { jobId: 2,     skillId: '40',  name: 'Noyer' },
    { jobId: 2,     skillId: '139', name: 'Bombu' },
    { jobId: 2,     skillId: '141', name: 'Oliviolet' },
    { jobId: 2,     skillId: '154', name: 'Bambou' },
    { jobId: 2,     skillId: '155', name: 'Bambou sombre' },
    { jobId: 2,     skillId: '158', name: 'Bambou sacré' },
    { jobId: 2,     skillId: '41',  name: 'Merisier' },
    { jobId: 2,     skillId: '174', name: 'Kaliptus' },
    { jobId: 2,     skillId: '190', name: 'Tremble' },
    // Mineur
    { jobId: 24,    skillId: '24',  name: 'Fer'},
    { jobId: 24,    skillId: '25',  name: 'Pierre Cuivrée'},
    { jobId: 24,    skillId: '26',  name: 'Bronze'},
    { jobId: 24,    skillId: '28',  name: 'Pierre de Kobalte'},
    { jobId: 24,    skillId: '29',  name: 'Argent'},
    { jobId: 24,    skillId: '30',  name: 'Or'},
    { jobId: 24,    skillId: '31',  name: 'Pierre de Bauxite' },
    { jobId: 24,    skillId: '55',  name: 'Etain' },
    { jobId: 24,    skillId: '56',  name: 'Manganèse' },
    { jobId: 24,    skillId: '161', name: 'Dolomite' },
    { jobId: 24,    skillId: '162', name: 'Silicate' },
    { jobId: 24,    skillId: '192', name: 'Obsidienne'},
    // Alchimiste
    { jobId: 26,    skillId: '68',  name: 'Lin' },
    { jobId: 26,    skillId: '69',  name: 'Chanvre' },
    { jobId: 26,    skillId: '71',  name: 'Trèfle à 5 feuilles' },
    { jobId: 26,    skillId: '72',  name: 'Menthe Sauvage' },
    { jobId: 26,    skillId: '73',  name: 'Orchidée Freyesque' },
    { jobId: 26,    skillId: '74',  name: 'Edelweiss' },
    { jobId: 26,    skillId: '160', name: 'Pandouille' },
    { jobId: 26,    skillId: '188', name: 'Perce-neige' },
    // Paysan
    { jobId: 28,    skillId: '45',  name: 'Blé' },
    { jobId: 28,    skillId: '46',  name: 'Houblon' },
    { jobId: 28,    skillId: '50',  name: 'Lin' },
    { jobId: 28,    skillId: '52',  name: 'Seigle' },
    { jobId: 28,    skillId: '53',  name: 'Orge' },
    { jobId: 28,    skillId: '54',  name: 'Chanvre' },
    { jobId: 28,    skillId: '57',  name: 'Avoine' },
    { jobId: 28,    skillId: '58',  name: 'Malt' },
    { jobId: 28,    skillId: '159', name: 'Riz' },
    { jobId: 28,    skillId: '191', name: 'Frostiz',},
    //Pêcheur
    { jobId: 36,    skillId: '124', name: 'Petits poissons (rivière)' },
    { jobId: 36,    skillId: '125', name: 'Poissons (rivière)' },
    { jobId: 36,    skillId: '126', name: 'Gros poissons (rivière)' },
    { jobId: 36,    skillId: '127', name: 'Poissons géants (rivière)' },
    { jobId: 36,    skillId: '128', name: 'Petits poissons (mer)' },
    { jobId: 36,    skillId: '129', name: 'Poissons (mer)' },
    { jobId: 36,    skillId: '130', name: 'Gros poissons (mer)' },
    { jobId: 36,    skillId: '131', name: 'Poissons géants (mer)' },
    { jobId: 36,    skillId: '136', name: 'Pichon' },
    { jobId: 36,    skillId: '189', name: 'Poisson de Frigost' }
  ];