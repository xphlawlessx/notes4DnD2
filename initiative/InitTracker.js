import {Character} from './Character.js'
import {Dice, roll, RollSet} from './Dice.js'
import charform from "./CharacterForm.js";
import initList from "./init-list.js";

const {ipcRenderer} = require('electron')

export default {
    components: {
        'character-form': charform,
        'init-list': initList
    },
    data: function () {
        return {
            partyChars: [],
            encounterChars: [],
            currentInit: -1,
            lastRoll: null,
            rolls: new RollSet(),
            setName: '',
            current: Character,
            groupRolls: [],
            showGroupRoll: false,
            settings: null,
            holdingCtrl: false,
        }
    },
    props: ['showCharForm', 'showInitList'],
    created() {
        this.ipcSetup();
    },
    methods: {
        ipcSetup: function () {
            ipcRenderer.on('settings', (event, args) => {
                this.settings = args;
            })
            window.addEventListener('mouseup', (e) => {
                if (e.target instanceof HTMLButtonElement) {
                    const _name = e.target.innerText.trim().toUpperCase().split("[")[0]
                    switch (_name) {
                        case "D4":
                            e.ctrlKey ? this.rolls.d4++ : this.roll("d4")
                            break;
                        case "D6":
                            e.ctrlKey ? this.rolls.d6++ : this.roll("d6")
                            break;
                        case "D8":
                            e.ctrlKey ? this.rolls.d8++ : this.roll("d8")
                            break;
                        case "D10":
                            e.ctrlKey ? this.rolls.d10++ : this.roll("d10")
                            break;
                        case "D12":
                            e.ctrlKey ? this.rolls.d12++ : this.roll("d12")
                            break;
                        case "D20":
                            e.ctrlKey ? this.rolls.d20++ : this.roll("d20")
                            break;
                        case "D100":
                            e.ctrlKey ? this.rolls.d100++ : this.roll("d100")
                            break;
                    }
                } else if (e.button === 0 && this.rolls.notEmpty()) this.roll()
            })

            ipcRenderer.on('button', (event, args) => {
                switch (args) {
                    case 'roll-space':
                        this.roll();
                        break;
                    case 'next-return':
                        this.nextInitiative()
                        break;
                    case 'inc-bonus':
                        this.rolls.bonus++;
                        break;
                    case 'd4-plus':
                        this.rolls.d4++;
                        break;
                    case 'd4-roll':
                        this.rolls.d4++;
                        break;
                    case 'd6-plus':
                        this.rolls.d6++;
                        break;
                    case 'd6-roll':
                        this.rolls.d6++;
                        break;
                    case 'd8-plus':
                        this.rolls.d8++;
                        break;
                    case 'd8-roll':
                        this.rolls.d8++;
                        break;
                    case 'd10-plus':
                        this.rolls.d10++;
                        break;
                    case 'd10-roll':
                        this.rolls.d10++;
                        break;
                    case 'd12-plus':
                        this.rolls.d12++;
                        break;
                    case 'd12-roll':
                        this.rolls.d12++;
                        break;
                    case 'd20-plus':
                        this.rolls.d20++;
                        break;
                    case 'd20-roll':
                        this.rolls.d20++;
                        break;
                    case 'd100-plus':
                        this.rolls.d100++;
                        break;
                    case 'd100-roll':
                        this.rolls.d100++;
                        break;

                }
                if (args.includes('-roll')) {
                    this.roll();
                }
            })
        },
        addPlayer(event) {
            this.partyChars.push(event)
        },
        roll(_roll = null) {
            if (_roll) {
                switch (_roll) {
                    case "d4":
                        this.rolls.d4++
                        break;
                    case "d6":
                        this.rolls.d6++
                        break;
                    case "d8":
                        this.rolls.d8++
                        break;
                    case "d10":
                        this.rolls.d10++
                        break;
                    case "d12":
                        this.rolls.d12++
                        break;
                    case "d20":
                        this.rolls.d20++
                        break;
                    case "d100":
                        this.rolls.d100++
                        break;
                }
            }
            this.$emit('roll-event', roll(this.rolls))
            this.lastRoll = roll(this.rolls)
            this.rolls = new RollSet()
        },
        saveRollSet() {
            if (this.setName.length < 1) {
                alert("name the set to save")
                return;
            }
            if (!this.current) {
                alert("need a character to save a roll set")
                return;
            }
            this.rolls.name = this.setName
            this.current.rollSets.push(this.rolls)
        },
        loadRollSet(name) {
            this.rolls = this.current.rollSets.filter(r => r.name === name)[0]
        },
        withAdvantage() {
            this.lastRoll = Dice.withAdvantage(this.current, this.rolls.bonus)
        },
        withDisadvantage() {
            this.lastRoll = Dice.withDisadvantage(this.current, this.rolls.bonus)
        },
        rollForInitiative() {
            this.currentInit = -1;
            this.partyChars = Dice.initiative(this.partyChars);
            this.nextInitiative();

        },
        nextInitiative() {
            this.currentInit++;
            this.current = this.partyChars[this.currentInit % this.partyChars.length]
        },
        rollSave(stat) {
            let rolls = []
            this.partyChars.forEach((c) => {
                if (c.selected) {
                    let bonus = 0;
                    switch (stat) {
                        case 'dex':
                            if (c.dexSave > 0) {
                                console.log("!")
                                bonus = c.dexSave
                            } else {
                                bonus = c.dexBonus
                            }
                            break;
                        case 'str':
                            if (c.strSave > 0) {
                                bonus = c.strSave
                            } else {
                                bonus = c.strBonus
                            }
                            break;
                        case 'wis':
                            if (c.wisSave > 0) {
                                bonus = c.wisSave
                            } else {
                                bonus = c.wisBonus
                            }
                            break;
                        case 'int':
                            if (c.intSave > 0) {
                                bonus = c.intSave
                            } else {
                                bonus = c.intBonus
                            }
                            break;
                        case 'cha':
                            if (c.chaSave > 0) {
                                bonus = c.chaSave
                            } else {
                                bonus = c.chaBonus
                            }
                            break;
                    }
                    rolls.push({name: c.name, roll: Dice.nDxObject(1, 20).sum + bonus})
                    c.selected = false
                }
            })
            this.groupRolls.splice(0, this.groupRolls.length)
            rolls.forEach((r) => {
                this.groupRolls.push(r)
            })
            this.showGroupRoll = true;
        },

    },
    template:
            `
        <div class="initParent">
            <div class="multi-button" style="float: top">
                <button class="lined thin" @click="saveRollSet">Save Roll Set</button>
                <input class="roundText" type="text" id="setName" placeholder="roll set name" v-model="setName">
            </div>
            <div class="dieButtons" style="float:left;">
                <h1>Bonus: {{rolls.bonus}}</h1>
                <br>
                <div class="multi-button">
                    <button class="lined thin">D4[{{this.rolls.d4}}]({{this.settings ? this.settings.d4r : ''}})
                    </button>
                    <button class="lined thin">D6[{{this.rolls.d6}}]({{this.settings ? this.settings.d6r : ''}})
                    </button>
                    <button class="lined thin">D8[{{this.rolls.d8}}]({{this.settings ? this.settings.d8r : ''}})
                    </button>
                    <button class="lined thin">D10[{{this.rolls.d10}}]({{this.settings ? this.settings.d10r : ''}})
                    </button>
                    <button class="lined thin">D12[{{this.rolls.d12}}]({{this.settings ? this.settings.d12r : ''}})
                    </button>
                    <button class="lined thin">D100[{{this.rolls.d100}}]({{this.settings ? this.settings.d100r : ''}})
                    </button>
                </div>
                <div class="dieButtons">
                    <div class="multi-button">
                        <button class="lined thin" @click="rollSave('str')">StrSave</button>
                        <button class="lined thin" @click="rollSave('dex')">DexSave</button>
                    </div>
                    <div class="multi-button">
                        <button class="lined thin" @click="rollSave('wis')">WisSave</button>
                        <button class="lined thin" @click="rollSave('int')">IntSave</button>
                    </div>
                    <div class="multi-button">
                        <button class="lined thin" @click="rollSave('cha')">ChaSave</button>
                        <br>
                    </div>
                </div>

                <div>
                    <div class="multi-button">
                        <button class="dotted thin" @click="withAdvantage">Advantage</button>
                        <button class="dotted thick">D20[{{this.rolls.d20}}]({{this.settings ? this.settings.d20p : ''}}
                            )
                        </button>
                        <button class="dotted thin" @click="withDisadvantage">Disadvantage</button>
                    </div>
                    <div class="multi-button">
                        <button class="dotted thick" @click="roll">Roll ({{this.settings ? this.settings.roll : ''}})
                        </button>
                    </div>
                </div>

                <div v-for="set in current.rollSets" class="multi-button">
                    <button class="lined thin" @click="loadRollSet(set.name)">{{set.name}}</button>
                </div>

                <div style="color: whitesmoke;font-size: 24px;text-align: center" v-if="showGroupRoll" id="groupRoll">
                    <div v-for="roll in groupRolls">
                        {{roll.name}}
                        {{roll.roll}}
                    </div>
                </div>
                <br>
                <div class="multi-button">
                    <button class="dotted thick" @click="nextInitiative">Next Turn
                        ({{this.settings ? this.settings.next : ''}})
                    </button>
                </div>

                <div class="multi-button">
                    <button class="dotted thick" @click="rollForInitiative(this.partyChars)">Roll for initiative
                    </button>
                </div>
                <br>
                <div class="initParent">
                    <character-form v-show="showCharForm" @new-character="this.addPlayer"
                                    style="float: left"></character-form>
                    <init-list v-show="showInitList"
                               v-bind:char-list="partyChars"
                               v-bind:current-init="currentInit" style="float: right"></init-list>
                </div>
            </div>
        </div>
    `
}

