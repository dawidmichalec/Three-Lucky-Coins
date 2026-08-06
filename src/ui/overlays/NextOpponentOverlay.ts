import { Container, Graphics, Text, Sprite, Assets, curveEps } from 'pixi.js';
import { DealerData } from '../../game/dealers/DealerData';
import { LocalizedText } from '../../localization/LocalizedText';
import { LayoutManager } from '../../core/LayoutManager';
import { RoundedButton } from '../buttons/RoundedButton';
import { ButtonTheme } from '../buttons/ButtonTheme';
import { ScrollableContainer } from '../components/ScrollableContainer';


export class NextOpponentOverlay extends Container {
  private bg: Graphics;
  private avatar!: Sprite;
  private photoContainer!: Container;
  private startButton!: RoundedButton;
  private isFading = false;
  private fadeAnimationId?: number;
  private scrollableContainer!: ScrollableContainer;
  private scrollContent!: Container;


  constructor(
    width: number, 
    height: number, 
    private dealer: DealerData,
    private onStart: () => void
    ) {
    super();

    this.bg = new Graphics()
      .rect(0, 0, width, height)
      .fill({ color: 0x000000, });

    this.addChild(this.bg);

    this.eventMode = "static";
    this.cursor = "default";

    const layout = LayoutManager.getInstance();

    const nextOpponentLabel = new LocalizedText(
    "nextOpponent",
    {
            fontFamily: "JackCondensed",
            fontWeight: "bold",
            fontSize: 50,
            fill: 0xffd21f
        }
    );

    nextOpponentLabel.anchor.set(0.5);

    nextOpponentLabel.position.set(
        layout.DESIGN_WIDTH / 2,
        80
    );

    this.addChild(nextOpponentLabel);

    // Container for opponent's photo

    this.photoContainer = new Container();

    this.photoContainer.position.set(284.6, 180);

    // Scrollable Container

    this.scrollableContainer = new ScrollableContainer(520, 1230);
    this.scrollableContainer.position.set(1060.2, 221.1);

    this.scrollContent = new Container();
    this.scrollContent.position.set(0,0);

    this.scrollableContainer.addChild(this.scrollContent);

    this.createScrollContent(dealer);


    // SAYING CONTAINER

    const sayingContainer = new Container();
    sayingContainer.width = 640;
    sayingContainer.height = 80;
    sayingContainer.position.set(287.3, 871.1);

    const saying = new LocalizedText(
        this.dealer.saying,
        {
            fontFamily: "CrimsonPro-Italic",
            fontWeight: "bold",
            fontSize: 38,
            fill: 0xffd21f, 
            wordWrap: true,
            wordWrapWidth: 640
        }
    );


    saying.position.set(sayingContainer.width/2,0);
    sayingContainer.addChild(saying);

    this.startButton = new RoundedButton({
        text: "start",

        theme: ButtonTheme.GOLD,

        onClick: async () => {

            await this.fadeOut(500);

            this.onStart();
        }
    });

    this.startButton.position.set(1100, 867.8);


    this.addChild(
        nextOpponentLabel,
        this.photoContainer,
        this.startButton,
        sayingContainer,
        this.scrollableContainer
    );

  }

  async init(){

    await this.createAvatar();

  }

  private async createAvatar() {
  
          const texture = await Assets.load(
              this.dealer.avatarNormal
          );
  
          this.avatar = new Sprite(texture);
  
          this.avatar.width = 643.4;
          this.avatar.height = 643.4;
  
          this.avatar.position.set(
              0,
              0
          );
  
          this.photoContainer.addChild(this.avatar);
  
    }

    private createScrollContent(
        dealer: DealerData
    ) {

        let currentY = 0;

        const nameLabel =
            new Text({
                text: dealer.name,
                style: {
                    font: "Open Sans",
                    fontWeight: "bold",
                    fontSize: 38,
                    fill: 0xffd21f
                }
            });

        nameLabel.position.set(
            0,
            currentY
        );

        currentY =
            nameLabel.y +
            nameLabel.height +
            6;


        const titleLabel =
            new LocalizedText(
                dealer.title,
                {
                    font: "Open Sans",
                    fontWeight: "bold",
                    fontSize: 24,
                    fill: 0xffd21f
                }
            );

        titleLabel.position.set(
            0,
            currentY
        );

        currentY =
            titleLabel.y +
            titleLabel.height +
            24;


        const descriptionLabel =
            new LocalizedText(
                "dealerDescription",
                {
                    font: "Open Sans",
                    fontWeight: "bold",
                    fontSize: 38,
                    fill: 0xffd21f
                }
            );

        descriptionLabel.position.set(
            0,
            currentY
        );

        currentY =
            descriptionLabel.y +
            descriptionLabel.height +
            12;


        const dealerDescription =
            new LocalizedText(
                dealer.dealerDescription,
                {
                    font: "Open Sans",
                    fontSize: 24,
                    fill: 0xffffff,
                    wordWrap: true,
                    wordWrapWidth: 520
                }
            );

        dealerDescription.position.set(
            0,
            currentY
        );

        currentY =
            dealerDescription.y +
            dealerDescription.height +
            24;


        const skillsLabel =
            new LocalizedText(
                "skills",
                {
                    font: "Open Sans",
                    fontWeight: "bold",
                    fontSize: 38,
                    fill: 0xffd21f
                }
            );

        skillsLabel.position.set(
            0,
            currentY
        );

        currentY =
            skillsLabel.y +
            skillsLabel.height +
            12;


        this.scrollContent.addChild(
            nameLabel,
            titleLabel,
            descriptionLabel,
            dealerDescription,
            skillsLabel
        );


        if (dealer.skills.length === 0) {

            const noSkillsText =
                new LocalizedText(
                    "noSkills",
                    {
                        font: "Open Sans",
                        fontSize: 24,
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: 520
                    }
                );

            noSkillsText.position.set(
                0,
                currentY
            );

            this.scrollContent.addChild(
                noSkillsText
            );

            return;
        }


        for (const skill of dealer.skills) {

            const skillName =
                new LocalizedText(
                    skill.name,
                    {
                        font: "Open Sans",
                        fontSize: 24,
                        fontWeight: "bold",
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: 500
                    }
                );

            skillName.position.set(
                0,
                currentY
            );


            const skillDescription =
                new LocalizedText(
                    skill.description,
                    {
                        font: "Open Sans",
                        fontSize: 22,
                        fill: 0xffffff,
                        wordWrap: true,
                        wordWrapWidth: 500
                    }
                );

            skillDescription.position.set(
                0,
                skillName.y +
                skillName.height +
                6
            );


            this.scrollContent.addChild(
                skillName,
                skillDescription
            );


            currentY =
                skillDescription.y +
                skillDescription.height +
                24;
        }
    }


  show() {

        if (
            this.fadeAnimationId !==
            undefined
        ) {
            cancelAnimationFrame(
                this.fadeAnimationId
            );

            this.fadeAnimationId =
                undefined;
        }

        this.visible = true;
        this.alpha = 1;

        this.eventMode = "static";
        this.isFading = false;
    }

  hide() {

        this.visible = false;
        this.alpha = 0;
        this.eventMode = "none";
    }

  private fadeOut(
        duration: number = 500
    ): Promise<void> {

        return new Promise(resolve => {

            if (this.isFading) {
                resolve();
                return;
            }

            this.isFading = true;

            /*
                Blokujemy kolejne kliknięcia
                podczas zanikania.
            */
            this.eventMode = "none";

            const startAlpha =
                this.alpha;

            const startTime =
                performance.now();

            const animate = (
                currentTime: number
            ) => {

                const progress =
                    Math.min(
                        1,
                        (
                            currentTime -
                            startTime
                        ) / duration
                    );

                /*
                    1 → 0
                */
                this.alpha =
                    startAlpha *
                    (1 - progress);

                if (progress < 1) {

                    this.fadeAnimationId =
                        requestAnimationFrame(
                            animate
                        );

                    return;
                }

                this.alpha = 0;
                this.visible = false;

                this.isFading = false;
                this.fadeAnimationId = undefined;

                resolve();
            };

            this.fadeAnimationId =
                requestAnimationFrame(
                    animate
                );
        });
    }
}