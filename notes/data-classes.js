export class Note {
    constructor(name, body, x, y, img, iconIndex) {
        this.name = name;
        this.body = body;
        this.x = x;
        this.y = y;
        this.h = 25;
        this.w = 25;
        this.img = img;
        this.isSelected = false;
        this.iconIndex = iconIndex;
    }

    show(sketch) {
        sketch.noFill();
        if (this.isSelected) {
            sketch.stroke(0);
        } else {
            sketch.noStroke();
        }
        sketch.image(this.img, this.x, this.y, this.w, this.h);
        sketch.rect(this.x, this.y, this.w + 1, this.h + 1);
    }

}

export class Icon {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
}

export class MapWrapper {
    constructor(name, data, notes) {
        this.name = name;
        this.data = data;
        this.notes = notes;
    }
}

export class Dungeon {
    constructor(name = '', maps = []) {
        this.name = name;
        this.maps = maps;
    }
}
