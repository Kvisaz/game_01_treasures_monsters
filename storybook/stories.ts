import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { treasuresAndMonstersStory } from "../src/components/simpleGames/TreasuresAndMonsters/TreasuresAndMonsters.story";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("Simple Games"),
    treasuresAndMonstersStory,
    storyTitle("Test Components"),
    testButtonStory,
    testButtonStory2
  ])
);
