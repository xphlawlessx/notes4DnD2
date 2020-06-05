Vue.component('note-overlay', {
    data: function () {
        return {
            nameLabelString: '',
            noteBodyString: '',
        }
    },
    template:
        `
        <span class="overlay-content">
            <label for="title" style="color: white">Title:</label>
        <input style="color: white" id="title" type="text" name="title" v-model="nameLabelString">
        <textarea placeholder="Describe the encounter." id="text" name="text"
                  style="overflow-y: scroll; word-wrap: break-word; resize: none; font-size: 16px; height: 90%;width:140%"
                  v-model="noteBodyString"></textarea>

        </span>
    `,
});
