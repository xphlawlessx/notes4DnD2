export default {
    props: ['charList', 'currentInit'],

    template: `
        <div class="initParent">
            <div class="multi-button">
                <br>
                <div v-for="(char,i) in charList"
                     :class="i===currentInit % charList.length ? 'initList highlight' : 'initList'"
                >
                    {{char.name}}: {{ char.roll }}
                    <input type="checkbox" v-model='char.selected'>
                    <span @click="char.showStats=!char.showStats">{{!char.showStats ? '+' : '-'}} </span>
                    <span v-show="char.showStats">
                dex: {{ char.dexBonus }}
                        str: {{ char.strBonus }}
                        wis: {{ char.wisBonus }}
                        int: {{ char.intBonus }}
                        cha: {{ char.chaBonus }}
                </span>
                </div>
            </div>
        </div>
    `
}
