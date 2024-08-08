import { generatePathThroughCells } from "./generatePathThroughCells";

describe('generatePathThroughCells', () => {
    test('should return the start and end points for direct line', () => {
        const start = { x: 0, y: 0 };
        const end = { x: 100, y: 0 };
        const cellSize = 100;
        const expectedPath = [{ x: 50, y: 50 }, { x: 150, y: 50 }];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

    test('should return correct path for diagonal line', () => {
        const start = { x: 0, y: 0 };
        const end = { x: 100, y: 100 };
        const cellSize = 50;
        const expectedPath = [{ x: 25, y: 25 }, { x: 75, y: 75 }, { x: 125, y: 125 }];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

    test('should handle vertical lines', () => {
        const start = { x: 0, y: 0 };
        const end = { x: 0, y: 100 };
        const cellSize = 50;
        const expectedPath = [{ x: 25, y: 25 }, { x: 25, y: 75 }, { x: 25, y: 125 }];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

    test('should work with negative coordinates', () => {
        const start = { x: -100, y: -100 };
        const end = { x: 0, y: 0 };
        const cellSize = 50;
        const expectedPath = [{ x: -75, y: -75 }, { x: -25, y: -25 }, { x: 25, y: 25 }];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

    test('should return a single point when start and end points are in the same cell', () => {
        const start = { x: 10, y: 10 };
        const end = { x: 20, y: 20 };
        const cellSize = 100;
        const expectedPath = [{ x: 50, y: 50 }];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

    test('should not add duplicate points for adjacent cells', () => {
        const start = { x: 50, y: 50 };
        const end = { x: 150, y: 150 };
        const cellSize = 50;
        // Ожидается, что путь будет включать только уникальные центры ячеек
        const expectedPath = [
            { x: 75, y: 75 }, // центр первой ячейки
            { x: 125, y: 125 }, // центр второй ячейки
            { x: 175, y: 175 }  // центр третьей ячейки
        ];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });


    test('from center to center', () => {
        const start = { x: 25, y: 25 };
        const end = { x: 75, y: 25 };
        const cellSize = 50;
        const expectedPath = [
            { x: 25, y: 25 },
            { x: 75, y: 25 },
        ];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

    test('from zero to max', () => {
        const start = { x: 0, y: 25 };
        const end = { x: 99, y: 25 };
        const cellSize = 50;
        const expectedPath = [
            { x: 25, y: 25 },
            { x: 75, y: 25 },
        ];
        expect(generatePathThroughCells(start, end, cellSize)).toEqual(expectedPath);
    });

});
