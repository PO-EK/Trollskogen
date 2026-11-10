export type QuestStage = {
  text: string;
  completedFlag: string;
};

export type QuestDefinition = {
  id: string;
  title: string;
  description: string;
  stages: QuestStage[];
  startedFlag: string;
  completedFlag: string;
  completedText: string;
};

export const quests: QuestDefinition[] = [
  {
    id: "openStorageQuest",
    title: "Nyckeln till kistan",
    description: "Hitta nyckeln till kistan i din stuga och lås upp den.",
    stages: [
      {
        text: "Använd nyckeln för att låsa upp kistan i din stuga.",
        completedFlag: "unlockedStorage",
      },
    ],
    startedFlag: "openStorageQuest.Started",
    completedFlag: "unlockedStorage",
    completedText: "Kistan i din stuga är upplåst.",
  },
  {
    id: "healTheSmith",
    title: "Smedens läkande dryck",
    description:
      "Smeden är skadad och kan inte arbeta. Hjälp honom så att byns smedja kan öppna igen.",
    stages: [
      {
        text: "Hitta en läkande dryck och lämna den till smeden.",
        completedFlag: "healTheSmith.Delivered",
      },
      {
        text: "Smeden är återställd och smedjan kan öppna igen.",
        completedFlag: "healTheSmith.Complete",
      },
    ],
    startedFlag: "healTheSmith.Started",
    completedFlag: "healTheSmith.Complete",
    completedText: "Smeden är återställd och smedjan kan öppna igen.",
  },

  {
    id: "nightWatch",
    title: "Byns nattvakt",
    description:
      "Lars vill bilda en ny nattvakt av bybor, men byn har ont om material. Spjut är billigt och enkelt, och han kan lära folk att använda dem. Be smeden smida spjutspetsar.",
    stages: [
      {
        text: "Fråga smeden om han kan smida omkring tio spjutspetsar",
        completedFlag: "nattvakten.smithAsked",
      },
      {
        text: "Smeden behöver sina stulna verktyg tillbaka. Fråga runt byn om någon såg tjuven.",
        completedFlag: "nattvakten.findTools",
      },
      {
        text: "Ett vittne såg tjuven springa mot skogen, leta efter spår",
        completedFlag: "nattvakten.SawThiefHeadingToForest",
      },
      {
        text: "Du hittade tjuven men han flydde in i skogen",
        completedFlag: "nattvakten.FoundThief",
      },
      {
        text: "Du kommer ikapp men han blev dödad av rövare",
        completedFlag: "nattvakten.FoundThiefKilled",
      },
      {
        text: "Besegra dem för att ta tillbaka verktygen",
        completedFlag: "nattvakten.BanditDefeated",
      },
      {
        text: "Återvänd till smeden med verktygen.",
        completedFlag: "nattvakten.ToolsReturned",
      },
      {
        text: "Vänta en dag medan smeden smider spjutspetsarna.",
        completedFlag: "nattvakten.SpearsReady",
      },
      {
        text: "Återvänd till smeden och hämta spjutspetsarna.",
        completedFlag: "nattvakten.SpearsCollected",
      },
      {
        text: "Lämna spjuten till Lars så att han kan börja träna nattvakten.",
        completedFlag: "nattvakten.spearsDelivered",
      },
      {
        text: "Lars tränar byns nya nattvakt.",
        completedFlag: "nattvakten.complete",
      },
    ],
    startedFlag: "nattvakten.started",
    completedFlag: "nattvakten.complete",
    completedText: "Lars tränar byns nya nattvakt.",
  },
  {
    id: "witchMelander",
    title: "Häxan Melander",
    description:
      "Marie berättade i hemlighet att häxan i skogen heter Melander och att de studerade läkekonst tillsammans som unga. Om någon vet vad som är fel med skogen, är det hon. Säg att Marie skickade dig, men erbjud din hjälp innan du ber om något.",
    stages: [
      {
        text: "Hitta Melanders stuga utanför byn.",
        completedFlag: "mainstory.witch.found",
      },
      {
        text: "Erbjud din hjälp och fråga vad som är fel med Trollskogen.",
        completedFlag: "mainstory.witch.askedAboutForest",
      },
      {
        text: "Melander har berättat vad hon vet.",
        completedFlag: "mainstory.witch.complete",
      },
    ],
    startedFlag: "mainstory.witch.started",
    completedFlag: "mainstory.witch.complete",
    completedText: "Melander har berättat vad hon vet.",
  },
  {
    id: "newLeader",
    title: "En ny ledare",
    description:
      "Byn har ingen ledare sedan borgmästaren dog. Ulf tror att hans fru Britt, som alla tycker om, är den rätta, men hon har stängt in sig i sin sorg. Ta med en korg med mat och dryck och försök övertala henne.",
    stages: [
      {
        text: "Besök borgmästarens hus och övertala Britt att leda byn.",
        completedFlag: "newleader.convinced",
      },
      {
        text: "Berätta för Ulf att Britt snart kommer till Värdshuset.",
        completedFlag: "newleader.complete",
      },
    ],
    startedFlag: "newleader.started",
    completedFlag: "newleader.complete",
    completedText: "Britt kommer att leda byn, och Ulf är lättad.",
  },
];
