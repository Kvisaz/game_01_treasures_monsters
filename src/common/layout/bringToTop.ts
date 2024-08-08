export function bringToTop(obj: IDisplayObject) {
  if (obj == null) return;
  const { parentContainer } = obj;

  if (parentContainer) bringToTopInContainer(obj, parentContainer);
  else bringToTopWithoutContainer(obj);
}

/**
 *  У объектов внутри контейнера порядок отображения == порядку внутри контейнера
 *  depth не играет особой роли, но устанавливается для совместимости со старым кодом
 */
function bringToTopInContainer(obj: IDisplayObject, parentContainer: Phaser.GameObjects.Container) {
  parentContainer.bringToTop(obj);
  const other = parentContainer.getAll() as IDisplayObject[];
  other.forEach((obj, i) => (obj.depth = i));
}

/**
 *  У объектов внутри контейнера порядок отображения == порядку внутри контейнера
 *  depth не играет особой роли, но устанавливается для совместимости со старым кодом
 */
function bringToTopWithoutContainer(obj: IDisplayObject) {
  const { displayList } = obj;
  if (displayList == null || displayList.length == 0) return;
  displayList.depthSort();
  const topElement = displayList.getAt(displayList.length - 1);
  // @ts-ignore
  const topDepth: number = topElement.depth || 0;
  obj.setDepth(topDepth + 1);
}

export interface IDisplayObject extends Phaser.GameObjects.GameObject {
  setDepth(depth: number): any;

  depth: number;
  parentContainer: Phaser.GameObjects.Container;
  displayList: Phaser.GameObjects.DisplayList | Phaser.GameObjects.Layer;
}
