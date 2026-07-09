export class CheatManager {

    private cheats: Map<string, () => void> = new Map();


    register(
        code: string,
        action: () => void
    ) {
        this.cheats.set(code, action);
    }


    execute(code: string) {

        const cheat = this.cheats.get(code);

        if (!cheat) {
            console.log(
                "Unknown cheat:",
                code
            );

            return;
        }

        cheat();
    }

}