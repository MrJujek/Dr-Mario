interface PillPositionInterface {
    x: number;
    y: number;
}

interface PillElementInterface {
    color: string;
    position: PillPositionInterface;
}

interface PillInterface {
    firstElement: PillElementInterface;
    secondElement: PillElementInterface;
}

const pillColors = [
    "red",
    "blue",
    "yellow"
];

export default class Pill {
    pill: PillInterface;
    pillColors: string[];

    constructor() {
        console.log("Pill constructor");

        this.pillColors = []
        for (let i = 0; i < 2; i++) {
            this.pillColors.push(pillColors[Math.floor(Math.random() * pillColors.length)]);
        }

        this.pill = {
            firstElement: {
                color: this.pillColors[0],
                position: {
                    x: 3,
                    y: 0
                }
            },
            secondElement: {
                color: this.pillColors[1],
                position: {
                    x: 4,
                    y: 0
                }
            },
        }

    }

    getPill() {
        console.log("Get pill");

        return this.pill;
    }
}