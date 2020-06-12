import {Character} from './Character.js'
import {Dice, roll, RollSet} from './Dice.js'
import charform from "./CharacterForm.js";

const {ipcRenderer} = require('electron')

export default {
    components: {
        'character-form': charform,
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
            showCharForm: false,
        }
    },
    created() {
        this.ipcSetup();
    },
    methods: {
        ipcSetup: function () {
            ipcRenderer.on('button', (event, args) => {
                switch (args) {
                    case 'roll-space':
                        this.roll();
                        break;
                    case 'next-return':
                        this.nextInitiative()
                        break;
                }
            })
        },
        addPlayer(event) {
            this.partyChars.push(event)
        },
        roll() {
            console.log(this)
            const bonus = document.querySelector('input[id=bonus]').value;
            if (bonus.length === 0) {
                this.rolls.bonus = 0;
            }
            switch (bonus) {
                case'str':
                    this.rolls.bonus = this.current.strBonus;
                    break;
                case'dex':
                    this.rolls.bonus = this.current.dexBonus;
                    break;
                case'wis':
                    this.rolls.bonus = this.current.wisBonus;
                    break;
                case'int':
                    this.rolls.bonus = this.current.intBonus;
                    break;
                case'cha':
                    this.rolls.bonus = this.current.chaBonus;
                    break;
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
        <div>
            <div class="initParent" v-show="!showCharForm">
                <div class="multi-button" style="float: top">
                    <input class="roundText" type="text" id="bonus" placeholder="bonus (2 or dex)"
                           v-model="rolls.bonus||null">
                    <button class="lined thick" @click="saveRollSet">Save Roll Set</button>
                    <input class="roundText" type="text" id="setName" placeholder="roll set name" v-model="setName">
                </div>
                <div class="dieButtons" style="float:left">

                    <div class="multi-button">
                        <button class="lined thick" @click="rolls.d4++" @click.right="rolls.d4--">D4 ({{this.rolls.d4}}
                            )
                        </button>
                        <button class="lined thick" @click="rolls.d6++" @click.right="rolls.d6--">D6 ({{this.rolls.d6}}
                            )
                        </button>
                    </div>
                    <div class="multi-button">
                        <button class="lined thick" @click="rolls.d8++" @click.right="rolls.d8--">D8 ({{this.rolls.d8}}
                            )
                        </button>
                        <button class="lined thick" @click="rolls.d10++" @click.right="rolls.d10--">D10
                            ({{this.rolls.d10}})
                        </button>
                    </div>
                    <div class="multi-button">
                        <button class="lined thick" @click="rolls.d12++" @click.right="rolls.d12--">D12
                            ({{this.rolls.d12}})
                        </button>
                        <button class="lined thick" @click="rolls.d100++" @click.right="rolls.d100--">D100
                            ({{this.rolls.d100}})
                        </button>
                    </div>
                </div>
                <div class="dieButtons">

                    <div class="multi-button">
                        <button class="dotted thin" @click="withAdvantage">Advantage</button>
                        <button class="dotted thick" @click="rolls.d20++" @click.right="rolls.d20--">D20
                            ({{this.rolls.d20}})
                        </button>
                        <button class="dotted thin" @click="withDisadvantage">Disadvantage</button>
                    </div>
                    <div class="multi-button">
                        <button class="dotted thick" @click="roll">Roll (space)</button>
                    </div>
                </div>
                <div style="float: right">

                    <div class="multi-button">
                        <button class="lined thick" @click="rollSave('str')">StrSave</button>
                        <button class="lined thick" @click="rollSave('dex')">DexSave</button>
                    </div>
                    <div class="multi-button">
                        <button class="lined thick" @click="rollSave('wis')">WisSave</button>
                        <button class="lined thick" @click="rollSave('int')">IntSave</button>
                    </div>
                    <div class="multi-button">
                        <button class="lined thick" @click="rollSave('cha')">ChaSave</button>
                        <br>
                    </div>
                </div>
            </div>
            <div v-for="(char,i) in partyChars"
                 :class="i===currentInit % partyChars.length ? 'initList highlight' : 'initList'"
            >
                {{char.name}}: {{ char.roll }}
                <input type="checkbox" v-model='char.selected'>
                <span @click="char.showStats=!char.showStats">{{!char.showStats ? '+' : '-'}}</span>
                <span v-show="char.showStats">
                dex: {{ char.dexBonus }}
                    str: {{ char.strBonus }}
                    wis: {{ char.wisBonus }}
                    int: {{ char.intBonus }}
                    cha: {{ char.chaBonus }}
                </span>
            </div>
            <div v-for="set in current.rollSets" class="multi-button">
                <button class="lined thick" @click="loadRollSet(set.name)">{{set.name}}</button>
            </div>


            <div style="color: whitesmoke;font-size: 24px;text-align: center" v-if="showGroupRoll" id="groupRoll">
                <div v-for="roll in groupRolls">
                    {{roll.name}}
                    {{roll.roll}}
                </div>

            </div>
            <div class="initParent">
                <div class="multi-button">
                    <button class="dotted thick" @click="showCharForm =!showCharForm">Show Char Form</button>
                    <button class="dotted thick" @click="nextInitiative">Next Turn (enter)</button>
                </div>
                <div class="multi-button">
                    <button class="dotted thick" @click="rollForInitiative(this.partyChars)">Roll for initiative
                    </button>
                </div>


                <character-form v-show="showCharForm" @new-character="this.addPlayer"></character-form>
            </div>

        </div>
    `
}

