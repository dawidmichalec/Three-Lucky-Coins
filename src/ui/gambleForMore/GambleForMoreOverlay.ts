import { Container, Text } from "pixi.js";
import { Overlay } from "../popups/Overlay";
import { LayoutManager } from "../../core/LayoutManager";
import { LocalizedText } from "../../localization/LocalizedText";
import { RoundedButton } from "../buttons/RoundedButton";
import { ButtonTheme } from "../buttons/ButtonTheme";
import { RedBlackCardView } from "./games/RedBlackCardView";

export class GambleForMoreOverlay extends Container {

    private layoutManager = LayoutManager.getInstance();
    private redBlackCardView: RedBlackCardView;

    constructor(){
        super();

        this.visible = false;

        const overlay = new Overlay(this.layoutManager.DESIGN_WIDTH, this.layoutManager.DESIGN_HEIGHT);

        // HEADER

        const header = new LocalizedText(
            "wouldYouLikeToGambleForMore",
            {
                fontFamily: "JackCondensed",
                fontWeight: "bold",
                fontSize: 50,
                fill: 0xffd21f
            }
        );

        header.position.set(this.layoutManager.DESIGN_WIDTH/2, 56.5);
        header.anchor.set(0.5);

        // RED BLACK CARD VIEW

        this.redBlackCardView =
            new RedBlackCardView(
                1200,
                472.4
            );

        this.redBlackCardView.position.set(
            364.8,
            162
        );

        const currentWinLabel = new LocalizedText(
            "currentWin",
            {
                font: "Open Sans",
                fontSize: 28,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        );

        currentWinLabel.position.set(595.3, 673.4);
        currentWinLabel.anchor.set(0);


        const currentWinValue = new Text({
            text: '120.10',
            style: {
                font: "Open Sans",
                fontSize: 28,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        });

        currentWinValue.position.set(1190, 673.4);
        currentWinValue.anchor.set(0);


        const potentialWinLabel = new LocalizedText(
            "potentialWin",
            {
                font: "Open Sans",
                fontSize: 28,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        );

        potentialWinLabel.position.set(595.3, 710.4);
        potentialWinLabel.anchor.set(0);


        const potentialWinValue = new Text({
            text: "520.40",
            style: {
                font: "Open Sans",
                fontSize: 28,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        })

        potentialWinValue.position.set(1190, 710.4);
        potentialWinValue.anchor.set(0);


        const disclaimer = new LocalizedText(
            "disclaimer",
            {
                font: "Open Sans",
                fontSize: 24,
                fontWeight: "bold",
                fill: 0xffd21f
            }
        );

        disclaimer.position.set(this.layoutManager.DESIGN_WIDTH/2, 807.2);
        disclaimer.anchor.set(0.5);


        const yesButton =
            new RoundedButton({

                text: "yesButtonText",

                theme:ButtonTheme.GREEN,

                onClick:()=>{

                }

            });

        yesButton.position.set(550, 907.4);

        const noButton =
            new RoundedButton({

                text: "noButtonText",

                theme:ButtonTheme.RED,

                onClick:()=>{

                }

            });

        noButton.position.set(1071.3, 907.4);


        this.addChild(
            overlay,
            header,
            this.redBlackCardView,
            currentWinLabel,
            currentWinValue,
            potentialWinLabel,
            potentialWinValue,
            disclaimer,
            yesButton,
            noButton
        );
    }

    async init():
        Promise<void> {

        await this.redBlackCardView
            .init();
    }
    
}