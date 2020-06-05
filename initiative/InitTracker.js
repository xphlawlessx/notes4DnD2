Vue.component('init-tracker', {
    data: function () {
        return {
            partyChars: [],
            encounterChars: [],
            currentInit: -1,
            lastRoll: null,
            rolls: new RollSet(),
            setName: '',
            current: Character,
        }
    },
    created: function () {
        console.log("created")
        this.partyChars.push(new Character(2, 1, 2, 0, 0, 0))
        this.partyChars.push(new Character(1, -1, 1, 0, 0, 0))
        this.partyChars.push(new Character(4, 0, 0, 0, 0, 0))
        this.partyChars.push(new Character(0, 0, 1, 0, 0, 1))
        this.partyChars.push(new Character(-2, 0, 0, 0, 0, -1))
        this.rollForInitiative()
    },
    methods: {
        roll() {
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
    },
    template: `
        <div>
        <button @click="nextInitiative">Next Turn</button>
        <br>
        <input type="text" id="bonus" placeholder="try 2 or dex" v-model="rolls.bonus">
        <label for="bonus">bonus</label>
        <br>
        <button @click="roll">Roll</button>
        <button @click="saveRollSet">Save Roll Set</button>
        <input type="text" id="setName" placeholder="roll set name" v-model="setName">
        <br>
        <button @click="withAdvantage">Advantage</button>
        <button @click="withDisadvantage">Disadvantage
        </button>
        <br>
        <button @click="rolls.d20++" @click.right="rolls.d20--">D20 ({{this.rolls.d20}})</button>
        <button @click="rolls.d4++" @click.right="rolls.d4--">D4 ({{this.rolls.d4}})</button>
        <button @click="rolls.d6++" @click.right="rolls.d6--">D6 ({{this.rolls.d6}})</button>
        <button @click="rolls.d8++" @click.right="rolls.d8--">D8 ({{this.rolls.d8}})</button>
        <button @click="rolls.d10++" @click.right="rolls.d10--">D10 ({{this.rolls.d10}})</button>
        <button @click="rolls.d12++" @click.right="rolls.d12--">D12 ({{this.rolls.d12}})</button>
        <button @click="rolls.d100++" @click.right="rolls.d100--">D100 ({{this.rolls.d100}})</button>
        <br>
        <div v-for="(char,i) in partyChars"
             :class="i===currentInit % partyChars.length ? 'highlight' : 'initList'"
        >
            roll: {{ char.roll }}
            <span @click="char.showStats=!char.showStats">{{!char.showStats? '+':'-'}}</span>
            <span v-show="char.showStats">
                dex: {{ char.dexBonus }}
                str: {{ char.strBonus }}
                wis: {{ char.wisBonus }}
                int: {{ char.intBonus }}
                cha: {{ char.chaBonus }}
                </span>
        </div>
        <br>
        <div v-for="set in current.rollSets">
            <button @click="loadRollSet(set.name)">{{set.name}}</button>
        </div>
        <div style="color: whitesmoke;font-size: 24px;text-align: center" v-if="lastRoll" id="rollDisplay">
            {{this.lastRoll.sum}}
            <br>
            {{this.lastRoll.name}}
            <br>
            {{this.lastRoll.display}}
        </div>
        <br>
        </div>
`
})
