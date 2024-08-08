/**
 * Да это дубль
 * но сделано чтобы phaser-sugar
 * не цеплялся за остальные модули
 */

/**
 * convert cssColor string To Phaser Int color
 * @param cssColor like #dedede, #afafaf, etc
 * @return {number} like 0xdedede, 0xafafaf, etc
 */
export function cssColorToInt(cssColor: string): number {
  try {
    return parseInt(cssColor.replace("#", "0x"));
  } catch (e) {
    console.warn("cssColorToInt: use cssColor with # prefix ");
    return 0xdedede;
  }
}
