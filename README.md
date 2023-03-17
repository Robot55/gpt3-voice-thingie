# ChatGPT to Voice Thingie

This is a sandbox project using GPT3, elevanLabs API, and D&D
## Getting started

### 1. Use the /upsertBrain  POST ep to starts something

JSON body needs to have a *name* key and a *content* key

you can use the following body example
```json
{
  "name": "sildar hallwinter",
  "content": [
    "Sildar Hallwinter is a kindhearted human male of nearly fifty years who holds a place of honor in the famous griffon cavalry of the great city of Waterdeep. He is an agent of the Lords' Alliance, a group of allied political powers concerned with mutual security and prosperity. Members of the order ensure the safety of cities and other settlements by proactively eliminating threats by any means, while bringing honor and glory to their leaders and homelands. Sildar met Gundren Rockseeker in Neverwinter and agreed to accompany him back to Phandalin. Sildar wants to investigate the fate of Iarno Albrek, a human wizard and fellow member of the Lords' Alliance who disappeared shortly after arriving in Phandalin. Sildar hopes to learn what happened to Iarno, assist Gundren in reopening the old mine, and help restore Phandalin to a civilized center of wealth and prosperity. Sildar provides the characters with four pieces of useful information: The three Rockseeker brothers (Gundren, Tharden, and Nundro) recently located an entrance to the long-lost Wave Echo Cave, site of the mines of the Phandelver's Pact. (Share the information in the first two paragraphs of the  Background  section to the players at this time.) Klarg, the bugbear who leads this goblin band, had orders to waylay Gundren. Sildar heard from the goblins that the Black Spider sent word that the dwarf was to be brought to him. Sildar doesn't know who or what the Black Spider is. Gundren had a map showing the secret location of Wave Echo Cave, but the goblins took it when they captured him. Sildar believes that Klarg sent the map and the dwarf to the chief of the Cragmaws at a place called Cragmaw Castle. Sildar doesn't know where that might be, but he suggests someone in Phandalin might know. (It doesn't occur to Sildar immediately, but a captured goblin might also be persuaded to divulge the castle's location.) Sildar's contact in Phandalin is a human wizard named Iarno Albrek. The wizard traveled to the town two months ago to establish order there. After the Lords' Alliance received no word from Iarno, Sildar decided to investigate. Sildar tells the characters that he intends to continue on to Phandalin, since it's the nearest settlement. He offers to pay the party 50 gp to provide escort. Although he has no money on him, Sildar can secure a loan to pay the characters within a day after arriving in Phandalin. First, he hopes they'll put a stop to the goblin raids by clearing out the caves. Sildar Hallwinter, a human warrior, is held prisoner in this chamber. He is securely bound on the southern ledge of the cavern. The goblins have been beating and tormenting him, so he is weak and at 1 hit point. The players have recently freed you from your bounds.",
    "\nI have been to many cities in my travels, but the fairest of them all is the great city of Waterdeep. It is a place of beauty and grandeur, with its towering spires and bustling streets. I am proud to have served in its griffon cavalry and to have been a part of its Lords' Alliance."
  ]
}
```

### 2. Use the /askBrain POST endpoint to ask questions
You can use the following JSON body as exampmle:

```json
{
  "name": "sildar hallwinter",
  "question": "which is the fairest of all the cities you have been to?"
}
```
### Local environment set up:



```bash
cp env.example .env
# fill in your env variables
npm install
node index.js
```
