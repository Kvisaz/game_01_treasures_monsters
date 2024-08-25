import { IStoryListItem, storyTitle } from "./interfaces";
import { testButtonStory, testButtonStory2 } from "../src/components/Test/TestButton.story";
import { treasuresAndMonstersStory } from "../src/components/TreasuresAndMonsters/TreasuresAndMonsters.story";
import { testGameStateStory } from "../src/components/gamestates/TestGameState/TestGameState.story";
import { treasuresAndMonsters2Story } from "../src/components/TreasuresAndMonsters2";
import { tmGameEventsStory, tmGameStateStory } from "../src/components";
import { tmStoreStory } from "../src/components/gamestates/TMGameState/TMStore.story";

export const stories: IStoryListItem[] = Array.from(
  new Set<IStoryListItem>([
    storyTitle("State Test"),
    tmStoreStory,
    tmGameEventsStory,
    tmGameStateStory,
    testGameStateStory,
    storyTitle("Treasures and Monster 1"),
    treasuresAndMonsters2Story,
    storyTitle("Old Treasures and Monster"),
    treasuresAndMonstersStory,
    storyTitle("Test Components"),
    testButtonStory,
    testButtonStory2
  ])
);
