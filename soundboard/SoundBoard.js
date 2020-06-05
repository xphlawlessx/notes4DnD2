Vue.component('sound-board', {
    data: function () {
        return {
            numSlots: 64,
            sounds: [],
        }
    },

    created: function () {
    },
    methods: {
        getFile(event) {
            let droppedFile = event.dataTransfer.files[0];

            if (!droppedFile) return;
            console.log(droppedFile)
            if (droppedFile.type === 'audio/mp3' || droppedFile.type === 'audio/wav') {
                const nextIndex = this.sounds.push(new Howl({src: [droppedFile.path]})) - 1
                event.target.innerText = droppedFile.name.substring(0, 6)
                event.target.addEventListener('click', function () {
                    this.sounds[nextIndex].play()
                }.bind(this))
            } else if (droppedFile.type === 'image/jpeg' || droppedFile.type === 'image/png') {
                console.log(droppedFile.path)
                let fr = new FileReader()
                fr.addEventListener("load", function () {
                    let img = document.createElement('img')
                    img.className = 'sound-image'
                    img.src = fr.result.toString();
                    event.target.appendChild(img)
                }, false);

                fr.readAsDataURL(droppedFile)


                event.target.appendChild(new HTMLElement())
            }
        },
    },
    template: `
         <div>
        <div class="section-loaded">
            <div v-for="x in numSlots" class="square" @drop.prevent="getFile" @dragend.prevent>
           
</div>

        </div>

    </div>
`
})
