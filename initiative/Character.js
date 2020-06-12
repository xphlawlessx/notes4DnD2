export class Character {

    constructor(name = '', dexBonus = 0, strBonus = 0,
                wisBonus = 0, intBonus = 0,
                chaBonus = 0, advantageOnInit = 0,
                dexSave = 0, strSave = 0,
                wisSave = 0, intSave = 0,
                chaSave = 0,
    ) {
        this.name = name
        this.dexBonus = dexBonus
        this.strBonus = strBonus
        this.wisBonus = wisBonus
        this.intBonus = intBonus
        this.chaBonus = chaBonus
        this.advantageOnInit = advantageOnInit
        this.dexSave = dexSave
        this.strSave = strSave
        this.wisSave = wisSave
        this.intSave = intSave
        this.chaSave = chaSave

        this.showStats = false;
        this.rollSets = [];
        this.selected = false;
    }

    setRoll(roll) {
        this.roll = roll;
    }
}

