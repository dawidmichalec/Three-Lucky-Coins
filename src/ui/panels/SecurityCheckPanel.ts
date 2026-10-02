import { Container, Text } from "pixi.js";

interface SecurityCheckWin {
    id: number;
    amount: number;
}

export class SecurityCheckPanel extends Container {
    private title: Text;

    private winsContainer = new Container();

    private winTexts = new Map<number, Text>();

    private readonly winSpacing = 42;

    constructor() {
        super();

        this.title = new Text({
            text: "SECURITY\nCHECK",
            style: {
                font: "Open Sans",
                fontSize: 38,
                fontWeight: "bold",
                fill: 0xffd21f,
                align: "center",
            },
        });

        this.title.anchor.set(0.5, 0);

        this.winsContainer.position.set(0, 105);

        this.addChild(
            this.title,
            this.winsContainer,
        );
    }

    setWins(
        wins: readonly SecurityCheckWin[],
    ): void {
        const currentIds = new Set(
            wins.map((win) => win.id),
        );

        // Usuń wpisy, których nie ma już w backendzie.

        for (const [id, winText] of this.winTexts) {
            if (currentIds.has(id)) {
                continue;
            }

            this.winsContainer.removeChild(
                winText,
            );

            winText.destroy();

            this.winTexts.delete(id);
        }

        // Dodaj nowe wpisy.

        for (const win of wins) {
            if (this.winTexts.has(win.id)) {
                continue;
            }

            const winText = this.createWinText(
                win.amount,
            );

            this.winTexts.set(
                win.id,
                winText,
            );

            this.winsContainer.addChild(
                winText,
            );
        }

        // Ustaw pozycje według aktualnej
        // kolejności z SecurityCheckManagera.

        wins.forEach((win, index) => {
            const winText =
                this.winTexts.get(win.id);

            if (!winText) {
                return;
            }

            winText.position.set(
                0,
                index * this.winSpacing,
            );
        });
    }

    private createWinText(
        amount: number,
    ): Text {
        const winText = new Text({
            text: amount.toFixed(2),

            style: {
                font: "Open Sans",
                fontSize: 32,
                fontWeight: "bold",
                fill: 0xffffff,
                align: "center",
            },
        });

        winText.anchor.set(0.5, 0);

        return winText;
    }

    clearWins(): void {
        for (const winText of this.winTexts.values()) {
            this.winsContainer.removeChild(
                winText,
            );

            winText.destroy();
        }

        this.winTexts.clear();
    }

    getNextWinGlobalPosition(): {
        x: number;
        y: number;
    } {
        const index =
            this.winsContainer.children.length;

        const localPosition = {
            x: 0,
            y: index * 42 + 16,
        };

        return this.winsContainer.toGlobal(
            localPosition,
        );
    }

    getWinGlobalPosition(
        id: number,
    ): { x: number; y: number } | null {
        const winText = this.winTexts.get(id);

        if (!winText) {
            return null;
        }

        return winText.toGlobal({
            x: 0,
            y: winText.height / 2,
        });
    }

    getWinText(id: number): Text | undefined {
        return this.winTexts.get(id);
    }

    getRemainingWinTargets(resolvedId: number): { text: Text; targetY: number }[] {
        const remainingWins = [...this.winTexts.entries()]
            .filter(([id]) => id !== resolvedId);

        return remainingWins.map(([, text], index) => ({
            text,
            targetY: index * this.winSpacing,
        }));
    }

    removeWin(id: number): void {
        const winText = this.winTexts.get(id);

        if (!winText) {
            return;
        }

        this.winsContainer.removeChild(winText);
        winText.destroy();
        this.winTexts.delete(id);
    }
}