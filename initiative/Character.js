class Character {

    constructor(dexBonus = 0, strBonus = 0, wisBonus = 0, intBonus = 0, chaBonus = 0, advantageOnInit = 0) {
        this.dexBonus = dexBonus
        this.strBonus = strBonus
        this.wisBonus = wisBonus
        this.intBonus = intBonus
        this.chaBonus = chaBonus
        this.advantageOnInit = advantageOnInit
        this.roll = 0;
        this.showStats = false;
        this.rollSets = [];
    }

    setRoll(roll) {
        this.roll = roll;
    }
}
