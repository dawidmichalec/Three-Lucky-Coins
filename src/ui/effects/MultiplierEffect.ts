import { Container, Graphics } from "pixi.js";

interface Particle {
  graphic: Graphics;

  velocityX: number;

  velocityY: number;

  gravity: number;

  rotationSpeed: number;

  lifetime: number;

  maxLifetime: number;

  startScale: number;
}

export class MultiplierEffect extends Container {
  private particles: Particle[] = [];

  private animationFrameId?: number;

  private isAnimating = false;

  constructor() {
    super();

    /*
            Efekt nie powinien blokować
            kliknięć elementów znajdujących się pod nim.
        */

    this.eventMode = "none";
  }

  play(previousMultiplier: number, currentMultiplier: number) {
    const previousMilestone = Math.floor(previousMultiplier / 5);

    const currentMilestone = Math.floor(currentMultiplier / 5);

    /*
            Nie przekroczyliśmy nowego
            progu x5 / x10 / x15 / ...
        */

    if (currentMilestone <= previousMilestone) {
      return;
    }

    const milestoneLevel = currentMilestone;

    this.clearEffect();

    this.createSparkBurst(milestoneLevel);

    if (milestoneLevel >= 2) {
      this.createFlash(milestoneLevel);
    }

    if (milestoneLevel >= 4) {
      this.createFlames(milestoneLevel);
    }

    this.startAnimation();
  }

  private createSparkBurst(milestoneLevel: number) {
    /*
            x5  → około 10 cząsteczek
            x10 → około 16
            x15 → około 22
            x20 → około 28

            Maksymalnie ograniczamy liczbę,
            żeby przy bardzo wysokim multiplierze
            nie tworzyć setek obiektów.
        */

    const particleCount = Math.min(50, 4 + milestoneLevel * 6);

    for (let index = 0; index < particleCount; index++) {
      const particle = new Graphics();

      const radius = this.randomRange(2, 4 + milestoneLevel * 0.4);

      particle.circle(0, 0, radius).fill({
        color: this.getSparkColor(milestoneLevel),
        alpha: 1,
      });

      /*
                Wszystkie cząsteczki startują
                ze środka efektu.
            */

      particle.position.set(0, 0);

      const angle = Math.random() * Math.PI * 2;

      const speed = this.randomRange(3, 6 + milestoneLevel * 0.8);

      const lifetime = this.randomRange(350, 550 + milestoneLevel * 50);

      const startScale = this.randomRange(0.7, 1.2);

      particle.scale.set(startScale);

      this.addChild(particle);

      this.particles.push({
        graphic: particle,

        velocityX: Math.cos(angle) * speed,

        velocityY: Math.sin(angle) * speed,

        gravity: 0.08 + milestoneLevel * 0.005,

        rotationSpeed: this.randomRange(-0.15, 0.15),

        lifetime,

        maxLifetime: lifetime,

        startScale,
      });
    }
  }

  private createFlash(milestoneLevel: number) {
    const flash = new Graphics();

    const radius = Math.min(180, 75 + milestoneLevel * 15);

    flash.circle(0, 0, radius).fill({
      color: milestoneLevel >= 4 ? 0xff8a00 : 0xffd700,

      alpha: 1,
    });

    flash.alpha = Math.min(0.7, 0.3 + milestoneLevel * 0.08);

    flash.scale.set(0.3);

    this.addChildAt(flash, 0);

    const lifetime = 280;

    this.particles.push({
      graphic: flash,

      velocityX: 0,

      velocityY: 0,

      gravity: 0,

      rotationSpeed: 0,

      lifetime,

      maxLifetime: lifetime,

      startScale: 0.3,
    });
  }

  private createFlames(milestoneLevel: number) {
    const flameCount = Math.min(18, 4 + milestoneLevel * 2);

    for (let index = 0; index < flameCount; index++) {
      const flame = new Graphics();

      const width = this.randomRange(5, 10);

      const height = this.randomRange(12, 24 + milestoneLevel * 2);

      /*
                Prosty płomień z elipsy.

                To nie będzie realistyczny ogień,
                ale da czytelny pomarańczowo-złoty efekt.
            */

      flame.ellipse(0, 0, width, height).fill({
        color: Math.random() > 0.5 ? 0xff8a00 : 0xffd700,

        alpha: 1,
      });

      flame.position.set(
        this.randomRange(-70, 70),

        this.randomRange(15, 45),
      );

      const lifetime = this.randomRange(400, 700);

      this.addChild(flame);

      this.particles.push({
        graphic: flame,

        velocityX: this.randomRange(-0.5, 0.5),

        velocityY: this.randomRange(-2.5, -1.3),

        gravity: -0.01,

        rotationSpeed: this.randomRange(-0.04, 0.04),

        lifetime,

        maxLifetime: lifetime,

        startScale: this.randomRange(0.8, 1.2),
      });
    }
  }

  private startAnimation() {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    let previousTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaMilliseconds = Math.min(32, currentTime - previousTime);

      previousTime = currentTime;

      /*
                Normalizujemy delta mniej więcej
                do prędkości 60 FPS.
            */

      const delta = deltaMilliseconds / 16.6667;

      this.updateParticles(delta, deltaMilliseconds);

      if (this.particles.length === 0) {
        this.animationFrameId = undefined;

        this.isAnimating = false;

        return;
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private updateParticles(delta: number, deltaMilliseconds: number) {
    for (let index = this.particles.length - 1; index >= 0; index--) {
      const particle = this.particles[index];

      particle.lifetime -= deltaMilliseconds;

      if (particle.lifetime <= 0) {
        this.removeParticle(index);

        continue;
      }

      const lifetimeProgress = particle.lifetime / particle.maxLifetime;

      /*
                Pozycja.
            */

      particle.graphic.x += particle.velocityX * delta;

      particle.graphic.y += particle.velocityY * delta;

      /*
                Grawitacja.

                Iskry powoli opadają,
                a płomienie z ujemną grawitacją
                unoszą się do góry.
            */

      particle.velocityY += particle.gravity * delta;

      particle.graphic.rotation += particle.rotationSpeed * delta;

      /*
                Zanik.
            */

      particle.graphic.alpha = Math.max(0, lifetimeProgress);

      /*
                Flash powiększa się,
                zwykłe cząsteczki maleją.
            */

      const isFlash =
        particle.velocityX === 0 &&
        particle.velocityY === 0 &&
        particle.gravity === 0;

      if (isFlash) {
        const flashProgress = 1 - lifetimeProgress;

        particle.graphic.scale.set(particle.startScale + flashProgress * 1.2);
      } else {
        particle.graphic.scale.set(
          particle.startScale * Math.max(0.2, lifetimeProgress),
        );
      }
    }
  }

  private removeParticle(index: number) {
    const particle = this.particles[index];

    this.removeChild(particle.graphic);

    particle.graphic.destroy();

    this.particles.splice(index, 1);
  }

  private clearEffect() {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);

      this.animationFrameId = undefined;
    }

    for (const particle of this.particles) {
      if (particle.graphic.parent === this) {
        this.removeChild(particle.graphic);
      }

      particle.graphic.destroy();
    }

    this.particles = [];

    this.isAnimating = false;
  }

  private getSparkColor(milestoneLevel: number): number {
    if (milestoneLevel >= 4) {
      /*
                x20+
            */

      return Math.random() > 0.5 ? 0xff8a00 : 0xffd700;
    }

    if (milestoneLevel >= 2) {
      /*
                x10+
            */

      return Math.random() > 0.5 ? 0xffd700 : 0xffffff;
    }

    /*
            x5
        */

    return 0xffd700;
  }

  private randomRange(minimum: number, maximum: number): number {
    return minimum + Math.random() * (maximum - minimum);
  }

  override destroy(options?: Parameters<Container["destroy"]>[0]) {
    this.clearEffect();

    super.destroy(options);
  }
}
