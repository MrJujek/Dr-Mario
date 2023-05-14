export interface storateClassInterface {
    previousHighScore: number;
    loadHighScore: () => void;
    updateScore: (score: number) => void;
}

/**
 * Klasa reprezentujaca local storage
 */
export default class Storage implements storateClassInterface {
    previousHighScore = 0;

    /**
     * Wczytywanie najlepszego wyniku
     */
    loadHighScore = () => {
        //console.log("loadHighScore");

        let highScore = localStorage.getItem("highScore");

        if (!highScore) {
            localStorage.setItem("highScore", "0");
            highScore = "0";
        }

        this.previousHighScore = parseInt(highScore);

        const scoreArr = highScore.toString().split("");
        while (scoreArr.length < 7) {
            scoreArr.unshift("0");
        }

        let div = document.getElementById("highScore") as HTMLDivElement;

        div.innerHTML = "";

        for (const num of scoreArr) {
            const scoreNum = document.createElement("div");
            scoreNum.classList.add("digit");
            scoreNum.style.backgroundImage = `url("../img/digits/${num}.png")`;
            div.appendChild(scoreNum);
        }
    };

    /**
     * Aktualizacja wyniku
     * 
     * @param score 
     */
    updateScore = (score: number) => {
        if (score > this.previousHighScore) {
            this.previousHighScore = score;
            localStorage.setItem("highScore", score.toString());
            this.loadHighScore();
        }

        const scoreArr = score.toString().split("");
        while (scoreArr.length < 7) {
            scoreArr.unshift("0");
        }

        let div = document.getElementById("score") as HTMLDivElement;

        div.innerHTML = "";

        for (const num of scoreArr) {
            const scoreNum = document.createElement("div");
            scoreNum.classList.add("digit");
            scoreNum.style.backgroundImage = `url("../img/digits/${num}.png")`;
            div.appendChild(scoreNum);
        }
    }
}
