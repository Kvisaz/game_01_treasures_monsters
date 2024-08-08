export function soundSafePlay(scene: Phaser.Scene | undefined, sound: string) {
  if (scene == null) {
    console.log("safePlay catch:: null scene");
    return;
  }

  try {
    scene?.sound.play(sound);
  } catch (e) {
    console.log("safePlay catch::", e);
  }
}
