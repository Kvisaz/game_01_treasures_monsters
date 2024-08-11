export const tmConfig2 = {
  cellSize: 72,
  columns: 18,
  rows: 14,

  terrainRules: [
    { type: "mountain", speedK: 0, probability: 0.05 },
    { type: "water", speedK: 0, probability: 0.2 },
    { type: "forest", speedK: 0.75, probability: 0.2 },
    { type: "sand", speedK: 0.5, probability: 0.2 },
    { type: "grass", speedK: 0.5, probability: 0.2 },
    { type: "ground", speedK: 0.5, probability: 0.2 }
  ]
} as const;

export type IConfig = typeof tmConfig2;
export type TerrainRule = IConfig['terrainRules'][number];
export type TerrainType = TerrainRule['type'];


/** to do move to components **/
export const terrainColors = {
  "mountain": "#5d1d06", // Приятный коричневатый цвет для гор
  "water": "#4682B4", // Спокойный синий цвет для воды
  "forest": "#005e00", // Темно-зеленый цвет для леса
  "sand": "#fce76c", // Светло-коричневый цвет для песка
  "grass": "#477242", // Яркий зеленый цвет для травы
  "ground": "#675437" // Земляной коричневый цвет
};
