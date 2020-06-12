export default {
    data: function () {
        return {
            name: '',
            dexBonus: 0, strBonus: 0, wisBonus: 0, intBonus: 0, chaBonus: 0,
            dexSave: 0, strSave: 0, wisSave: 0, intSave: 0, chaSave: 0,
            advantageOnInit: 0,
        }
    },

    methods: {
        save() {
            import('./Character.js').then((m) => {
                this.$emit('new-character', new m.Character(
                    this.name, this.dexBonus, this.strBonus,
                    this.wisBonus, this.intBonus, this.chaBonus,
                    this.dexSave, this.strSave, this.wisSave,
                    this.intSave, this.chaSave, this.advantageOnInit))
            });
        }
    },
    template:
            `
        <div class="multi-button">
            <p class="character-form">
                Name:
                <input type="text" class="roundText" placeholder="name" v-model="name">
            </p>
            <div class="character-form" style="float: left">
                Bonuses
                <p>
                    <button class="lined thick" @click="dexBonus--">-</button>
                    Dex: {{dexBonus}}
                    <button class="lined thick" @click="dexBonus++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="strBonus--">-</button>
                    Str: {{strBonus}}
                    <button class="lined thick" @click="strBonus++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="wisBonus--">-</button>
                    Wis: {{wisBonus}}
                    <button class="lined thick" @click="wisBonus++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="intBonus--">-</button>
                    Int: {{intBonus}}
                    <button class="lined thick" @click="intBonus++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="chaBonus--">-</button>
                    Cha: {{chaBonus}}
                    <button class="lined thick" @click="chaBonus++">+</button>
                </p>
            </div>
            <div class="character-form" style="float: right">
                Saves
                <p>
                    <button class="lined thick" @click="dexSave--">-</button>
                    Dex: {{dexSave}}
                    <button class="lined thick" @click="dexSave++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="strSave--">-</button>
                    Str: {{strSave}}
                    <button class="lined thick" @click="strSave++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="wisSave--">-</button>
                    Wis: {{wisSave}}
                    <button class="lined thick" @click="wisSave++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="intSave--">-</button>
                    Int: {{intSave}}
                    <button class="lined thick" @click="intSave++">+</button>
                </p>
                <p>
                    <button class="lined thick" @click="chaSave--">-</button>
                    Cha: {{chaSave}}
                    <button class="lined thick" @click="chaSave++">+</button>
                </p>
                <button class="lined thick" @click="save">Save</button>
            </div>

        </div>
    `
}

