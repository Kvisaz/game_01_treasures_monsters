import { onPause, onUpdate } from "../scenes";
import { IMoveKeys } from "../interfaces";
import { defaultMoveKeys } from "../defaults";
import { addWasdKeys } from "../keyboard";

export interface IScrollingCameraSettings {
  /**
   * клавиши для скролла
   */
  keys: IMoveKeys;
  /**
   *  размеры камеры - по сути размеры показываемого мира
   *  она просто двигается в этих пределах
   *  даже если там пустота
   */
  width: number;
  height: number;
  /**
   * Расстояние курсора до краев экрана
   * при котором активируется драггинг карты
   */
  draggingMapMouseThreshold: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  draggingMapVelocityMin: number;
  draggingMapVelocityMax: number;
  /**
   * если надо быстро отключить
   */
  isNotScrolling?: boolean;
}

export const defaultScrollingCameraSettings: IScrollingCameraSettings = {
  isNotScrolling: false,
  width: 2400,
  height: 1200,
  keys: defaultMoveKeys,
  draggingMapMouseThreshold: {
    left: 120,
    right: 120,
    top: 120,
    bottom: 120,
  },
  draggingMapVelocityMin: 150,
  draggingMapVelocityMax: 300,
};

interface IProps extends Partial<IScrollingCameraSettings> {
  scene: Phaser.Scene;
  width: number;
  height: number;
  camera?: Phaser.Cameras.Scene2D.Camera;
}

export function useScrollingCamera(customProps: IProps) {
  const props = { ...defaultScrollingCameraSettings, ...customProps };
  const { scene } = props;
  const camera = props.camera ?? scene.cameras.main;
  if (props.isNotScrolling) return () => {};

  const oldBounds = camera.getBounds();
  camera.setBounds(0, 0, props.width, props.height);
  let cameraVelocityX = 0;
  let cameraVelocityY = 0;

  addWasdKeys({
    scene,
    keys: props.keys,
    onLeft: () => (cameraVelocityX = -props.draggingMapVelocityMax),
    onRight: () => (cameraVelocityX = props.draggingMapVelocityMax),
    onUp: () => (cameraVelocityY = -props.draggingMapVelocityMax),
    onDown: () => (cameraVelocityY = props.draggingMapVelocityMax),
    onRelease: () => {
      cameraVelocityX = 0;
      cameraVelocityY = 0;
    },
  });

  function lockVelocity() {
    cameraVelocityX = 0;
    cameraVelocityY = 0;
  }

  const onProximityCallback = (x: number, y: number) => {
    cameraVelocityX =
      x != 0
        ? Math.sign(x) * props.draggingMapVelocityMin +
          x * props.draggingMapVelocityMax
        : 0;
    cameraVelocityY =
      y != 0
        ? Math.sign(y) * props.draggingMapVelocityMin +
          y * props.draggingMapVelocityMax
        : 0;
  };

  scene.input.on(
    Phaser.Input.Events.POINTER_MOVE,
    (pointer: Phaser.Input.Pointer) => {
      const scrollFactorX = getScrollFactorOrdinate(
        pointer.x,
        camera.getBounds().left,
        camera.width,
        props.draggingMapMouseThreshold.left,
        props.draggingMapMouseThreshold.right
      );
      const scrollFactorY = getScrollFactorOrdinate(
        pointer.y,
        camera.getBounds().top,
        camera.height,
        props.draggingMapMouseThreshold.top,
        props.draggingMapMouseThreshold.bottom
      );
      onProximityCallback(scrollFactorX, scrollFactorY);
    }
  );

  onPause(scene, lockVelocity);
  const updateUnSub = onUpdate(scene, (time, dT) => {
    camera.scrollY += (cameraVelocityY * dT) / 1000;
    camera.scrollX += (cameraVelocityX * dT) / 1000;
  });

  return () => {
    updateUnSub();
    camera.scrollY = 0;
    camera.scrollX = 0;
    camera.setBounds(
      oldBounds.x,
      oldBounds.y,
      oldBounds.width,
      oldBounds.height
    );
  };
}

/** возвращает число от 0 до 1, где 1 - приближение к границе камеры изнутрри
 *  при выходе за нее - 0
 *  это позволяет скроллить камеру изнутри
 * **/
function getScrollFactorOrdinate(
  cursorOrdinate: number,
  cameraOrdinate: number,
  cameraSize: number,
  threshold1: number,
  threshold2: number
): number {
  const d1 = cursorOrdinate - cameraOrdinate;
  const d2 = cameraOrdinate + cameraSize - cursorOrdinate;
  if (d1 <= 0 || d2 <= 0) return 0;
  if (d1 <= threshold1) return d1 / threshold1 - 1;
  if (d2 <= threshold2) return 1 - d2 / threshold2;
  return 0;
}
