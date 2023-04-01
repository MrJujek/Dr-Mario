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

        let firstPillElement = document.createElement("div");
        firstPillElement.id = "pill_first";
        firstPillElement.classList.add("pill");
        firstPillElement.style.top = `${this.pill.firstElement.position.y * 50}px`;
        firstPillElement.style.left = `${this.pill.firstElement.position.x * 50}px`;
        firstPillElement.style.backgroundColor = this.pill.firstElement.color;

        let secondPillElement = document.createElement("div");
        secondPillElement.id = "pill_second";
        secondPillElement.classList.add("pill");
        secondPillElement.style.top = `${this.pill.secondElement.position.y * 50}px`;
        secondPillElement.style.left = `${this.pill.secondElement.position.x * 50}px`;
        secondPillElement.style.backgroundColor = this.pill.secondElement.color;

        (document.getElementById("main") as HTMLElement).append(firstPillElement);
        (document.getElementById("main") as HTMLElement).append(secondPillElement);

        return this.pill;
    }
};

export { PillInterface };