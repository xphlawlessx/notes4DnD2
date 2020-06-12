export default {
    props: {lastRollProp: Object},


    computed: {
        lastRoll() {
            return this.lastRollProp ? this.lastRollProp : null;
        },
    },
    template:
            `
        <div style="color: #41403E;font-size: 24px;text-align: center" id="rollDisplay">
            {{this.lastRoll ? this.lastRoll.sum : ''}}
            <br>
            {{this.lastRoll ? this.lastRoll.name : ''}}
            <br>
            {{this.lastRoll ? this.lastRoll.display : ''}}
        </div>
    `
};

