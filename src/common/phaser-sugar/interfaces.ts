export type IPhaserConfig = Phaser.Types.Core.GameConfig;
export type PhaserScene = Phaser.Scene & Partial<{ create?: () => void, init?: () => void, preload?: () => void }>;
export type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
export type Callback = () => void | Promise<void>;
export const {KeyCodes} = Phaser.Input.Keyboard;

export interface IMoveKeys {
    left: number[];
    right: number[];
    up: number[];
    down: number[];
}

export type GameObject =
    | Phaser.GameObjects.Container
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Text
    | Phaser.GameObjects.RenderTexture
    | Phaser.GameObjects.Shape
    | Phaser.GameObjects.TileSprite;
