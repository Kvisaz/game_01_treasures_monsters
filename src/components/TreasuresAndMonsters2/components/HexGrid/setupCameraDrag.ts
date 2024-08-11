interface IProps {
  scene: Phaser.Scene;
  container: Phaser.GameObjects.Container;
}

/**
 *  Сделать драггинг камеры по границам контейнера с объектами
 *  по объектам можно кликать
 **/
export function setupCameraDrag({ scene, container }: IProps) {
  const camera = scene.cameras.main;
  const prevX = camera.scrollX;
  const prevY = camera.scrollX;
  const resetCamera = () => {
    camera.scrollX = prevX;
    camera.scrollY = prevY;
  };
  let isPointerDown = false;
  let isDragging = false;
  let startX: number, startY: number;
  let pointerStartX: number, pointerStartY: number;
  const dragThreshold: number = 14; // Порог начала драггинга в пикселях

  const containerBounds = container.getBounds();

  const isInputAllowed = () => !isDragging;

  scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
    isPointerDown = true;
    startX = camera.scrollX;
    startY = camera.scrollY;
    pointerStartX = pointer.x;
    pointerStartY = pointer.y;
  });

  scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
    if(!isPointerDown) return;

    if (!isDragging) {
      const distanceMoved = Phaser.Math.Distance.Between(
        pointerStartX, pointerStartY, pointer.x, pointer.y
      );
      if (distanceMoved >= dragThreshold) {
        isDragging = true;
      }
    }


    if (isDragging) {
      const deltaX: number = pointerStartX - pointer.x + startX;
      const deltaY: number = pointerStartY - pointer.y + startY;

      // Ограничиваем движение камеры размерами контейнера
      camera.scrollX = Phaser.Math.Clamp(
        deltaX,
        0,
        Math.max(0, containerBounds.width - camera.width)
      );
      camera.scrollY = Phaser.Math.Clamp(
        deltaY,
        0,
        Math.max(0, containerBounds.height - camera.height)
      );
    }
  });

  scene.input.on("pointerup", () => {
    isDragging = false;
    isPointerDown = false;
  });

  return { resetCamera, isInputAllowed };
}
