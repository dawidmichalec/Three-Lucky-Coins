import {
  Assets,
  Container,
  Graphics,
  Sprite,
} from "pixi.js";

import { PerkReward } from "../../game/perks/reward/PerkReward";

interface ActiveIcon {
  id: string;
  sprite: Sprite;
}

export class PerkContainer extends Container {
  private readonly perkRow = new Container();
  private readonly bonusEffectRow = new Container();

  private perkIcons: ActiveIcon[] = [];
  private bonusEffectIcons: ActiveIcon[] = [];

  private readonly iconSize = 50;

  private readonly horizontalGap = 10;

  constructor(
    private readonly containerWidth: number,
    private readonly containerHeight: number,
    private readonly onPerkClick: (
      reward: PerkReward,
      icon: Sprite,
    ) => void,
  ) {
    super();

    /*
      ROW 1
      Perki.
    */

    this.perkRow.position.set(
      0,
      0,
    );

    /*
      ROW 2
      Bonusy + efekty.
    */

    this.bonusEffectRow.position.set(
      0,
      60,
    );

    this.addChild(
      this.perkRow,
      this.bonusEffectRow,
    );
  }

  async addPerk(
    reward: PerkReward,
  ): Promise<void> {
    const texture = await Assets.load(
      reward.variant.assets.small,
    );

    const perkIcon = new Sprite(
      texture,
    );

    perkIcon.anchor.set(0.5);

    perkIcon.width =
      this.iconSize;

    perkIcon.height =
      this.iconSize;

    perkIcon.eventMode =
      "static";

    perkIcon.cursor =
      "pointer";

    perkIcon.on(
      "pointertap",
      (event) => {
        event.stopPropagation();

        this.onPerkClick(
          reward,
          perkIcon,
        );
      },
    );

    const index =
      this.perkIcons.length;

    const position =
      this.getRowIconPosition(
        index,
      );

    perkIcon.position.set(
      position.x,
      position.y,
    );

    perkIcon.alpha = 0;

    perkIcon.scale.set(0.3);

    const flash =
      new Graphics()
        .circle(
          0,
          0,
          this.iconSize * 0.8,
        )
        .fill({
          color: 0xffde59,
          alpha: 0.8,
        });

    flash.position.copyFrom(
      perkIcon.position,
    );

    flash.scale.set(0.35);

    /*
      Flash + ikona trafiają
      wyłącznie do perkRow.
    */

    this.perkRow.addChild(
      flash,
      perkIcon,
    );

    this.perkIcons.push({
      id: reward.perk.id,
      sprite: perkIcon,
    });

    await Promise.all([
      this.animateIcon(
        perkIcon,
      ),

      this.animateFlash(
        flash,
      ),
    ]);

    flash.destroy();

    perkIcon.alpha = 1;

    perkIcon.scale.set(1);
  }

  async removePerk(
    perkId: string,
  ): Promise<void> {
    const index =
      this.perkIcons.findIndex(
        (entry) =>
          entry.id === perkId,
      );

    if (index === -1) {
      return;
    }

    const entry =
      this.perkIcons[index];

    await this.animateIconRemoval(
      entry.sprite,
    );

    this.perkRow.removeChild(
      entry.sprite,
    );

    entry.sprite.destroy();

    this.perkIcons.splice(
      index,
      1,
    );

    await this.repositionPerks();
  }

  private async repositionPerks(): Promise<void> {
    await Promise.all(
      this.perkIcons.map(
        (entry, index) =>
          this.animateIconMove(
            entry.sprite,
            this.getRowIconPosition(
              index,
            ),
          ),
      ),
    );
  }

  private getRowIconPosition(
    index: number,
  ): {
    x: number;
    y: number;
  } {
    const x =
      this.iconSize / 2 +
      index *
        (
          this.iconSize +
          this.horizontalGap
        );

    return {
      x,
      y: this.iconSize / 2,
    };
  }

  private animateIconRemoval(
    icon: Sprite,
  ): Promise<void> {
    return this.animate(
      350,

      (progress) => {
        icon.alpha =
          1 - progress;

        const scale =
          1 -
          progress * 0.5;

        icon.scale.set(
          scale,
        );
      },
    );
  }

  private animateIconMove(
    icon: Sprite,
    target: {
      x: number;
      y: number;
    },
  ): Promise<void> {
    const startX =
      icon.x;

    const startY =
      icon.y;

    return this.animate(
      300,

      (progress) => {
        const easedProgress =
          1 -
          Math.pow(
            1 - progress,
            3,
          );

        icon.x =
          startX +
          (
            target.x -
            startX
          ) *
            easedProgress;

        icon.y =
          startY +
          (
            target.y -
            startY
          ) *
            easedProgress;
      },
    );
  }

  private animateIcon(
    icon: Sprite,
  ): Promise<void> {
    return this.animate(
      420,

      (progress) => {
        const easedProgress =
          1 -
          Math.pow(
            1 - progress,
            3,
          );

        const punch =
          Math.sin(
            progress *
              Math.PI,
          );

        const scale =
          0.3 +
          easedProgress *
            0.7 +
          punch *
            0.18;

        icon.scale.set(
          scale,
        );

        icon.alpha =
          easedProgress;
      },
    );
  }

  private animateFlash(
    flash: Graphics,
  ): Promise<void> {
    return this.animate(
      500,

      (progress) => {
        const scale =
          0.35 +
          progress *
            1.5;

        flash.scale.set(
          scale,
        );

        flash.alpha =
          0.8 *
          (
            1 -
            progress
          );
      },
    );
  }

  private animate(
    duration: number,
    update: (
      progress: number,
    ) => void,
  ): Promise<void> {
    return new Promise(
      (resolve) => {
        const startTime =
          performance.now();

        const frame = (
          currentTime: number,
        ) => {
          const elapsed =
            currentTime -
            startTime;

          const progress =
            Math.min(
              1,
              elapsed /
                duration,
            );

          update(
            progress,
          );

          if (
            progress >= 1
          ) {
            resolve();

            return;
          }

          requestAnimationFrame(
            frame,
          );
        };

        requestAnimationFrame(
          frame,
        );
      },
    );
  }
}