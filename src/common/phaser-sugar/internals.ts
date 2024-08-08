import { TextStyle } from "./interfaces";
import { defaulTextStyle, defaultPhaserConfig } from "./defaults";

enum Scenes {
  GAME = "GAME",
  UI = "UI",
}

const PhaserSugarInternal: IPhaserSugarInternal = {
  config: { ...defaultPhaserConfig },
  textStyle: { ...defaulTextStyle },
};

const VarSceneCurrentKey = "sceneCurrent";

interface IPhaserSugarInternal {
  config: Phaser.Types.Core.GameConfig;
  [VarSceneCurrentKey]?: Phaser.Scene;
  worldScene?: Phaser.Scene;
  uiScene?: Phaser.Scene;
  game?: Phaser.Game;
  textStyle: TextStyle;
}

type Key = keyof IPhaserSugarInternal;

function useVar<T>(propName: Key, value?: T): T | undefined {
  if (value != null) setVar(propName, value);
  return (PhaserSugarInternal as any)[propName];
}

function setVar<T>(propName: Key, value: T): void {
  (PhaserSugarInternal as any)[propName] = value;
}

function getVar<T>(propName: Key): T {
  return (PhaserSugarInternal as any)[propName];
}

function resetVar<T>(propName: Key): void {
  delete (PhaserSugarInternal as any)[propName];
}


export function useScene(
  scene?: Phaser.Scene,
  propName: Key = VarSceneCurrentKey
): Phaser.Scene {
  if (scene) setCurrentScene(scene);
  scene = useVar<Phaser.Scene>(propName);
  if (scene == null) {
    console.log("PhaserSugarInternal", PhaserSugarInternal);
    throw "useScene null error";
  } else {
    return scene;
  }
}

export function getCurrentScene(): Phaser.Scene {
  return getVar(VarSceneCurrentKey);
}

function setCurrentScene(scene: Phaser.Scene) {
  setVar(VarSceneCurrentKey, scene);
}

function resetCurrentScene() {
  resetVar(VarSceneCurrentKey);
}

export function withScene<T>(scene: Phaser.Scene, callback: () => T): T {
  setCurrentScene(scene);
  const result = callback();
  resetCurrentScene();
  return result;
}

export function useWorldScene(scene?: Phaser.Scene): Phaser.Scene {
  return useScene(scene, "worldScene");
}

export function useUiScene(scene?: Phaser.Scene): Phaser.Scene {
  return useScene(scene, "uiScene");
}

export function useCamera(): Phaser.Cameras.Scene2D.Camera {
  const scene = useScene();
  if (scene == null) {
    throw "useScene null error";
  } else {
    return scene.cameras.main;
  }
}

export function useTextStyle(textStyle?: TextStyle): TextStyle {
  textStyle = { ...PhaserSugarInternal.textStyle, ...textStyle };
  return useVar("textStyle", textStyle) as TextStyle;
}

export function useGame(game?: Phaser.Game): Phaser.Game {
  return useVar("game", game) as Phaser.Game;
}
