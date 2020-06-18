export default {
    props: {lastRollProp: Object},

    data: function () {
        return {
            rolls: [],
            visible: [],
            show: false,
        }
    },
    watch: {
        lastRollProp: function () {
            if (!this.lastRollProp) return
            this.show = true
            this.rolls.push(this.lastRollProp)
            this.visible.push(false)
        }
    },
    computed: {
        lastRoll() {
            return this.lastRollProp ? this.lastRollProp : null;
        },


    },
    methods: {
        click(i) {
            this.$set(this.visible, i, !this.visible[i])
        },
    },
    template:
            `
        <div v-show="show" class="lastRoll" @click.right="show=!show">
            <div id="rollDisplay" v-for="(roll,i) in rolls.slice().reverse()" style="border: solid 2px">
                <div @click="click(i)" v-bind:class="[i===0?'roll':'roll-high']">
                    {{roll.sum}}{{!visible[i] ? '+' : '-'}}
                    <br>
                    <div v-if="visible[i]" v-bind:class="[i===0?'roll':'roll-high']">
                        {{roll.name}}
                        <br>
                        {{roll.display}}
                    </div>
                </div>
            </div>
            <br>
        </div>
    `
};

