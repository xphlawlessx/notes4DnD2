exports.Settings = function (roll = 'Space', next = 'Return',
                             d4 = 'Q', d6 = 'W', d8 = 'E', d10 = 'R',
                             d12 = 'T', d100 = 'Y', d20 = 'X',
                             advantage = '1', disadvantage = '2',
                             showInit = 'I', showChar = 'C',
                             showSound = 'S', showCanvas = 'M', incrementBonus='B') {
    this.roll = roll;
    this.next = next;
    this.d4r = d4;
    this.d6r = d6;
    this.d8r = d8;
    this.d10r = d10;
    this.d12r = d12;
    this.d100r = d100;
    this.d20r = d20;
    this.d4p = `CmdOrCtrl+${d4}`
    this.d6p = `CmdOrCtrl+${d6}`
    this.d8p = `CmdOrCtrl+${d8}`
    this.d10p = `CmdOrCtrl+${d10}`
    this.d12p = `CmdOrCtrl+${d12}`
    this.d100p = `CmdOrCtrl+${d100}`
    this.d20p = `CmdOrCtrl+${d20}`
    this.advantage = advantage;
    this.disadvantage = disadvantage;
    this.showInit = showInit;
    this.showSound = showSound;
    this.showChar = showChar;
    this.showCanvas = showCanvas;
    this.incrementBonus = incrementBonus;
}
