export class Dice {
    static initiative(characters) {
        for (const character of characters) {
            let roll = 0
            const advantage = character.advantageOnInit
            if (!advantage) {
                roll = (Math.floor(Math.random() * 20) + 1) + character.dexBonus;
            } else {

                const r1 = (Math.floor(Math.random() * 20) + 1) + character.dexBonus;
                const r2 = (Math.floor(Math.random() * 20) + 1) + character.dexBonus;
                if (advantage > 0) {
                    roll = Math.max(r1, r2)
                }
                if (advantage < 0) {
                    roll = Math.min(r1, r2)
                }
            }
            character.setRoll(roll);
        }
        characters.sort((a, b) => (a.roll < b.roll) ? 1 : -1)
        return characters;
    }

    static withAdvantage(bonus) {
        bonus = Number(bonus)
        const r1 = (Math.floor(Math.random() * 20) + 1)
        const r2 = (Math.floor(Math.random() * 20) + 1)
        let sum = Math.max(r1, r2)
        let display = ''
        if (bonus > 0) {
            display = `[${r1},${r2}]+${bonus}`
            sum += bonus
        } else {
            display = `[${r1},${r2}]`
        }
        const name = 'Advantage'
        return {name, sum, display};
    }

    static withDisadvantage(bonus) {
        bonus = Number(bonus)
        const r1 = (Math.floor(Math.random() * 20) + 1);
        const r2 = (Math.floor(Math.random() * 20) + 1);
        let sum = Math.min(r1, r2)
        let display = ''
        if (bonus > 0) {
            display = `[${r1},${r2}]+${bonus}`
            sum += bonus
        } else {
            display = `[${r1},${r2}]`
        }
        const name = 'Disadvantage'
        return {name, sum, display};

    }

    static nDxObject(n, x) {
        let sum = 0;
        let display = '['
        const name = `${n}D${x}`
        for (let i = 0; i < n; i++) {
            let roll = (Math.floor(Math.random() * x) + 1)
            display += `${roll},`
            sum += roll
        }
        display = display.replace(/.$/, "]")
        return {name, sum, display};
    }

}

export const roll = function (rollSet) {
    let {d20 = 0, d4 = 0, d6 = 0, d8 = 0, d10 = 0, d12 = 0, d100 = 0, bonus = 0} = rollSet
    let sum = 0;
    let display = ''
    let name = ''
    if (d4 === 0 && d6 === 0 &&
        d8 === 0 && d10 === 0 &&
        d12 === 0 && d20 === 0 &&
        d100 === 0) {
        d20 = 1;
    }
    if (d20 > 0) {
        const d20r = Dice.nDxObject(d20, 20);
        name += ` ${d20r.name}`;
        display += ` ${d20r.display}`;
        sum += d20r.sum;
    }
    if (d4 > 0) {
        const d4r = Dice.nDxObject(d4, 4);
        name += ` ${d4r.name}`;
        display += ` ${d4r.display}`;
        sum += d4r.sum;
    }
    if (d6 > 0) {
        const d6r = Dice.nDxObject(d6, 6);
        name += ` ${d6r.name}`;
        display += ` ${d6r.display}`;
        sum += d6r.sum;
    }
    if (d8 > 0) {
        const d8r = Dice.nDxObject(d8, 8);
        name += ` ${d8r.name}`;
        display += ` ${d8r.display}`;
        sum += d8r.sum;
    }
    if (d10 > 0) {
        const d10r = Dice.nDxObject(d10, 10);
        name += ` ${d10r.name}`;
        display += ` ${d10r.display}`;
        sum += d10r.sum;
    }
    if (d12 > 0) {
        const d12r = Dice.nDxObject(d12, 12);
        name += ` ${d12r.name}`;
        display += ` ${d12r.display}`;
        sum += d12r.sum;
    }
    if (d100 > 0) {
        const d100r = Dice.nDxObject(d100, 100);
        name += ` ${d100r.name}`;
        display += ` ${d100r.display}`;
        sum += d100r.sum;
    }
    if (bonus > 0) {

        name += ` + ${bonus}`
        display += ` + ${bonus}`
    }
    return {name, sum, display};
}

export class RollSet {
    constructor(d20 = 0, d4 = 0, d6 = 0, d8 = 0, d10 = 0, d12 = 0, d100 = 0, bonus = 0) {
        this.d20 = d20
        this.d4 = d4
        this.d6 = d6
        this.d8 = d8
        this.d10 = d10
        this.d12 = d12
        this.d100 = d100
        this.bonus = bonus
        this.name = ''
    }
}


