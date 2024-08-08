export interface ITweenPromiseProps {
  config: Phaser.Types.Tweens.TweenBuilderConfig;
  scene: Phaser.Scene;
}

export function tweenPromise({ config, scene }: ITweenPromiseProps): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const oldOnComplete = config.onComplete;
    config.onComplete = (tween: Phaser.Tweens.Tween,
                         targets: unknown[],
                         ...param: unknown[]) => {
      oldOnComplete?.(tween, targets, ...param);
      resolve();
    };
    scene.tweens.add(config);
  });
}