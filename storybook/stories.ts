import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { treasuresAndMonstersStory } from "../src/components/TreasuresAndMonsters/TreasuresAndMonsters.story";
import { testGameStateStory } from "../src/components/gamestates/TestGameState/TestGameState.story";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("State Test"),
    testGameStateStory,
    storyTitle("Simple Games"),
    treasuresAndMonstersStory,
    storyTitle("Test Components"),
    testButtonStory,
    testButtonStory2
  ])
);
