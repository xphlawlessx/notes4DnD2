import init from "./initiative/InitTracker.js";
import lRoll from "./initiative/LastRoll.js";
import sound from "./soundboard/SoundBoard.js";
import lOverlay from "./notes/left-overlay.js";
import rOverlay from "./notes/note-overlay.js";
import {Dungeon, Icon, MapWrapper, Note} from "./notes/data-classes.js"


const {ipcRenderer} = require('electron')

new Vue({
    el: '#app',
    components: {
        'sound-board': sound,
        'left-overlay': lOverlay,
        'note-overlay': rOverlay,
        'init-tracker': init,
        'last-roll': lRoll,
    },
    data: {

        sketch: null,
        canvas: null,
        bgImage: null,
        roomIcons: [],
        mapListParent: null,

        showIcons: false,
        showModal: false,
        xOffset: 0.0,
        yOffset: 0.0,
        resizeOffset: 25,
        selectedIcon: null,
        baseWidth: 0,
        baseHeight: 0,

        dots: [],
        maps: [],
        mapFile: '',

        selectedDot: Note,
        overDot: false,
        dragging: false,

        showInit: true, showSound: true, showCanvas: true, showInitList: false, showCharForm: false,
        lastRollGlobal: null,

        searchResults: [],
        searchStr: '',
        noteIndex: 0,
        matchIndex: 0,
        currentMatch: null,
        isSearching: false,

    },
    computed: {

        mapName() {
            return this.$children.filter((c) => {
                return (c.$data.mapName !== undefined)
            })[0].mapName
        },
        dungeonName() {
            return this.$children.filter((c) => {
                return (c.$data.dungeonName !== undefined)
            })[0].dungeonName
        },
        nameLabelString() {
            return this.$children.filter((c) => {
                return (c.$data.nameLabelString !== undefined)
            })[0].nameLabelString
        },
        noteBodyString() {
            return this.$children.filter((c) => {
                return (c.$data.noteBodyString !== undefined)
            })[0].noteBodyString
        },

    },

    methods: {
        getRoll(e) {
            this.lastRollGlobal = e;
        },
        search() {
            this.searchResults = []
            this.dots.forEach((d) => {
                let _matches = [...d.body.matchAll(this.searchStr.trim())]
                console.log(_matches)
                if (_matches.length > 0) {
                    console.log(d.name)
                    this.searchResults.push({noteName: d.name, matches: _matches});
                }
            });
            //this.searchResults = this.searchResults.reverse()
            this.matchIndex = 0;
            this.noteIndex = 0;
            console.log("new search")
            this.currentMatch = this.searchResults[this.noteIndex];
            console.log(this.currentMatch)
            this.selectedDot = this.dots.filter(d => d.name === this.currentMatch.noteName).reverse()[0]
            console.log(this.selectedDot)
            this.isSearching = true;
            this.openForm();
            this.selectSearchText();

        },
        getNextSearch() {
            const numNotes = this.searchResults.length - 1;
            const numMatchesThisNote = this.currentMatch.matches.length - 1;
            if (this.noteIndex === numNotes && this.matchIndex === numMatchesThisNote) {
                return;
            }
            if (this.matchIndex < numMatchesThisNote) {
                this.matchIndex++;
                console.log("next match")
            }
            if (this.matchIndex === numMatchesThisNote) {
                this.noteIndex++;
                this.matchIndex = 0;
                console.log("next note")
            }

            this.currentMatch = this.searchResults[this.noteIndex];
            this.selectedDot = this.dots.filter(d => d.name === this.currentMatch.noteName)[0]

            console.log(this.currentMatch);
            console.log(`matchIndex ${this.matchIndex}`)
            console.log(`noteIndex ${this.noteIndex}`)
            console.log(`matches len ${this.currentMatch.matches.length}`)
            console.log(`results len ${this.searchResults.length}`)

            this.openForm();
            this.selectSearchText();

        },
        selectSearchText() {
            this.$refs.note_overlay.selectSearchText(this.currentMatch.matches[this.matchIndex].index, this.currentMatch.matches[this.matchIndex].index + this.currentMatch.matches[this.matchIndex].length);
        },

        setup(sketch) {
            window.addEventListener('keypress', (e) => {
                if (e.key === ' ') {
                    e.preventDefault()
                }
            })
            this.sketch = sketch;
            this.bgImage = sketch.loadImage('https://static.tumblr.com/maopbtg/a5emgtoju/inflicted.png');
            this.bgImage.loadPixels();
            this.ipcSetup();
            this.loadIcons();
            let c = sketch.createCanvas(sketch.windowWidth / 2, sketch.windowHeight);
            this.baseWidth = sketch.windowWidth / 2;
            this.baseHeight = sketch.windowHeight;
            sketch.textAlign(sketch.CENTER);
            this.mapListParent = document.getElementById('mapListParent');
            this.canvas = document.getElementById('canvas');
            this.sketch.textSize(16);
            c.drop(this.gotFile);
            this.sketch.background(this.bgImage);
            this.sketch.text('drop map image or json file', this.sketch.width / 2, this.sketch.height / 2);
        },
        loadIcons() {
            let _query = document.querySelectorAll("img.iconButton");
            _query.forEach((i) => {
                let _path = i.src.replace("file:///", "");
                let _name = _path.split('/')[_path.split('/').length - 1].replace('.png', '');
                this.roomIcons.push(new Icon(_name, this.sketch.loadImage(_path)));
            })

            for (let i = 0; i < _query.length; i++) {
                _query[i].addEventListener('click', () => {
                    this.onClick(this.roomIcons[i].name);
                })
            }

        },
        ipcSetup() {
            ipcRenderer.on('button', (event, args) => {
                switch (args) {
                    case 'new-map':
                        this.clearMap();
                        break;
                    case 'new-dungeon':
                        this.clearDungeon();
                        break;
                    case 'save-map':
                        this.saveMap();
                        break;
                    case 'save-dungeon':
                        this.saveDungeon();
                        break;
                    case 'show-init':
                        this.showInitList = !this.showInitList
                        break;
                    case 'show-sound':
                        this.showSound = !this.showSound
                        break;
                    case 'show-canvas':
                        this.showCanvas = !this.showCanvas
                        break;
                    case 'show-char':
                        this.showCharForm = !this.showCharForm
                        break;
                }
            })
            ipcRenderer.on('icon-paths', (event, args) => {
                this.allIcons = args;
                this.setIconImages();
                this.loadIcons()
                this.selectedIcon = this.roomIcons[0];

            });
        },

        onClick(id) {
            let icon = this.roomIcons.filter(icon => icon.name === id)[0]
            this.showIcons = false;
            this.selectedIcon = this.roomIcons[this.roomIcons.indexOf(icon)];
        },
        openForm() {
            this.updateDots(this.sketch);
            this.showModal = true;
            this.$children.forEach((c) => {
                if (c.$data.nameLabelString !== undefined) {
                    c.$data.nameLabelString = this.selectedDot.name;
                }
            })
            this.$children.forEach((c) => {
                if (c.$data.noteBodyString !== undefined) {
                    c.$data.noteBodyString = this.selectedDot.body;
                }
            })
        },
        closeForm() {
            this.selectedDot.name = this.nameLabelString;
            this.selectedDot.body = this.noteBodyString;
            this.selectedDot = null;
            this.showModal = false;
            this.isSearching = false;
        },
        windowresized(sketch) {
            sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
            let xScale = sketch.windowWidth / this.baseWidth;
            let yScale = sketch.windowHeight / this.baseHeight;
            for (const d of this.dots) {
                d.w *= xScale;
                d.h *= yScale;
                d.x *= xScale;
                d.y *= yScale;
            }
            this.baseWidth = sketch.windowWidth;
            this.baseHeight = sketch.windowHeight;
        },
        draw(sketch) {
            if (sketch.img) {
                sketch.image(sketch.img, 0, 0, sketch.windowWidth - this.resizeOffset, sketch.windowHeight - this.resizeOffset);
            } else if (this.bgImage) {
                this.sketch.background(this.bgImage);
                this.sketch.text('drop map image or json file', this.sketch.width / 2, this.sketch.height / 2);
            }
            this.updateDots(sketch);

        },
        updateDots(sketch) {
            if (!this.showModal) {
                this.overDot = false;
                for (const dot of this.dots) {
                    if (
                        sketch.mouseX > dot.x - dot.w &&
                        sketch.mouseX < dot.x + dot.w &&
                        sketch.mouseY > dot.y - dot.h &&
                        sketch.mouseY < dot.y + dot.h
                    ) {
                        dot.isSelected = true;
                        this.selectedDot = dot;
                        this.overDot = true;
                        this.canvas.focus();
                    } else {
                        dot.isSelected = false;
                    }
                    if (!this.overDot && !this.isSearching) {
                        this.selectedDot = null;
                    }
                    dot.show(sketch);
                }
            }
        },
        setIconImages() {
            let ul = document.getElementById("iconList");
            for (const icon of this.allIcons) {
                let li = document.createElement("li");
                let img = document.createElement("img");
                img.src = icon;
                img.className = 'iconButton';
                li.appendChild(img);
                ul.appendChild(li);
            }
            this.loadIcons();
        },
        mouseLClick() {
            let sketch = this.sketch;
            if (sketch.mouseButton === sketch.LEFT) {
                if (this.overDot) {
                    this.dragging = true;
                    this.xOffset = sketch.mouseX - this.selectedDot.x;
                    this.yOffset = sketch.mouseY - this.selectedDot.y;
                } else {
                    this.dragging = false;
                    this.dots.push(new Note("", "", sketch.mouseX, sketch.mouseY, this.selectedIcon.data, this.roomIcons.indexOf(this.selectedIcon)));
                }
            }
        },
        mouseRClick() {
            if (this.showModal) {
                this.closeForm();
                return;
            }
            if (this.overDot) {
                if (!this.showModal) {
                    this.openForm();
                }
            } else {
                this.showIcons = !this.showIcons;
            }
        },
        mousedragged(sketch) {
            if (this.overDot) {
                this.selectedDot.x = sketch.mouseX - this.xOffset;
                this.selectedDot.y = sketch.mouseY - this.yOffset;
            }
        },
        mousereleased() {
            this.dragging = false;
        },
        keypressed(sketch) {
            this.updateDots(sketch);
            if (!this.overDot || sketch.key !== 'Backspace' && sketch.key !== 'Delete' || this.showModal) {
                return;
            }
            let toDel = confirm("Really delete ?");
            if (toDel) {
                this.dots.splice(this.dots.indexOf(this.selectedDot), 1);
            }
        },
        gotFile(file) {
            if (file.subtype === 'json') {
                this.loadDungeon(file)
            } else {
                this.newMap(file)
            }
        },
        clearMap() {
            this.sketch.img = null;
            this.mapData = null;
            this.$children.forEach((c) => {
                if (c.$data.mapName !== undefined) {
                    c.$data.mapName = ''
                }

            })
            this.dots = [];
            this.sketch.background(0);

        },
        clearDungeon() {
            this.sketch.img = null;
            this.dots = [];
            this.maps = []
            this.$children.forEach((c) => {
                if (c.$data.mapName !== undefined) {
                    c.$data.mapName = ''
                }

            })
            this.mapFile = '';
            this.$children.forEach((c) => {
                if (c.$data.dungeonName !== undefined) {
                    c.$data.dungeonName = ''
                }

            })
            this.mapData = '';
            this.sketch.background(this.bgImage);
            this.sketch.text('drop map image or json file', this.sketch.width / 2, this.sketch.height / 2);
        },
        newMap(file) {
            this.sketch.img = this.sketch.createImg(file.data, '').hide();
            this.mapData = file.data;
        },
        loadDungeon(file) {
            let dungeon = this.sketch.loadJSON(file.file.path, () => {
                let maps = []
                for (const m of dungeon.maps) {
                    maps.push(new MapWrapper(m.name, m.data, m.notes));
                }
                for (const m of maps) {
                    this.addButton(m.name);
                }
                this.maps = [...maps];
                this.$children.forEach((c) => {
                    if (c.$data.dungeonName !== undefined) {
                        c.$data.dungeonName = dungeon.name;
                    }

                })
            })
        },
        loadMap(index) {
            this.$children.forEach((c) => {
                if (c.$data.mapName !== undefined) {
                    c.$data.mapName = this.maps[index].name;
                }
            })
            this.sketch.img = this.sketch.createImg(this.maps[index].data, '').hide();
            this.mapData = this.maps[index].data;
            let dots = Object.values(this.maps[index].notes);
            this.dots = [];
            for (const dot of dots) {
                this.dots.push(new Note(dot.name, dot.body, dot.x, dot.y, this.roomIcons[dot.iconIndex], dot.iconIndex))
            }
        },
        addButton(bName) {
            let dropdownChild = document.createElement("a");
            dropdownChild.innerText = bName;
            let index = -1;
            for (const m of this.maps) {
                if (m.name === bName) {
                    index = this.maps.indexOf(m);
                }
            }
            if (index < 0) {
                return;
            }
            dropdownChild.addEventListener("click", function () {
                this.loadMap(index);
            }.bind(this));
            this.mapListParent.appendChild(dropdownChild);
        },
        saveMap() {
            console.log(this.mapName)
            console.log(this.dungeonName)
            if (this.mapName.trim().length === 0) {
                alert("Name the map in the right click menu")
                return;
            }
            //check if map is in list..
            let index = -1;
            this.maps.forEach(map => {
                if (map.name === this.mapName) {
                    index = this.maps.indexOf(map);
                }
            });

            const mapSave = new MapWrapper(this.mapName, this.mapData, [...this.dots])
            if (index < 0) {
                //new map
                this.maps.push(mapSave);
                this.addButton(this.mapName);
            } else {
                //overwrite
                let toOver = confirm(`This will overwrite ${this.maps[index].name}`);
                if (toOver) {
                    this.maps.splice(index, 1, mapSave);
                }
            }
        },
        saveDungeon() {
            if (this.dungeonName.trim().length === 0) {
                alert("Name the Dungeon in the right click menu")
                return;
            }
            let dungeonSave = new Dungeon(this.dungeonName, this.maps)
            ipcRenderer.send('dungeon', dungeonSave);
        },

    }
});


