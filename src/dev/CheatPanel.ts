import { Container } from "pixi.js";
import { CheatManager } from "./CheatManager";

export class CheatPanel extends Container {

    private input!: HTMLInputElement;


    constructor(
        private cheatManager: CheatManager
    ) {
        super();

        this.createInput();
    }


    private createInput() {

        this.input = document.createElement("input");

        this.input.style.position = "absolute";
        this.input.style.top = "20px";
        this.input.style.left = "20px";


        this.input.addEventListener(
            "keydown",
            (event) => {

                if(event.key === "Enter") {

                    const command = this.input.value;

                    console.log("CHEAT INPUT:", command);

                    this.cheatManager.execute(command);

                    this.input.value = "";
                }

            }
        );


        document.body.appendChild(this.input);
    }

    destroy(options?: any) {

        if (this.input) {
            this.input.remove();
        }

        super.destroy(options);

    }

}