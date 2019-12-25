export default function(championId, participantArray) {
  for (const player of participantArray) {
    if (player.championId === championId) {
      console.log("element from hook", player);
      return player;
    }
  }
  return "unidentified";
}

/*
Access to information:
championId: 92
participantId: 1
spell1Id: 4
spell2Id: 12
stats:
assists: 3
champLevel: 14
combatPlayerScore: 0
damageDealtToObjectives: 1258
damageDealtToTurrets: 1258
damageSelfMitigated: 22457
deaths: 10
doubleKills: 0
firstBloodAssist: false
firstBloodKill: false
firstInhibitorAssist: false
firstInhibitorKill: false
firstTowerAssist: false
firstTowerKill: false
goldEarned: 8651
goldSpent: 8350
inhibitorKills: 0
item0: 3071
item1: 3812
item2: 3111
item3: 1033
item4: 1036
item5: 0
item6: 3340
killingSprees: 1
kills: 4
largestCriticalStrike: 0
largestKillingSpree: 2
largestMultiKill: 1
longestTimeSpentLiving: 590
magicDamageDealt: 0
magicDamageDealtToChampions: 0
magicalDamageTaken: 12496
neutralMinionsKilled: 4
neutralMinionsKilledEnemyJungle: 0
neutralMinionsKilledTeamJungle: 4
objectivePlayerScore: 0
participantId: 1
pentaKills: 0
perk0: 8010
perk0Var1: 360
perk0Var2: 0
perk0Var3: 0
perk1: 9111
perk1Var1: 618
perk1Var2: 140
perk1Var3: 0
perk2: 9104
perk2Var1: 22
perk2Var2: 30
perk2Var3: 0
perk3: 8299
perk3Var1: 354
perk3Var2: 0
perk3Var3: 0
perk4: 8304
perk4Var1: 10
perk4Var2: 3
perk4Var3: 0
perk5: 8347
perk5Var1: 0
perk5Var2: 0
perk5Var3: 0
perkPrimaryStyle: 8000
perkSubStyle: 8300
physicalDamageDealt: 69258
physicalDamageDealtToChampions: 9937
physicalDamageTaken: 12107
playerScore0: 0
playerScore1: 0
playerScore2: 0
playerScore3: 0
playerScore4: 0
playerScore5: 0
playerScore6: 0
playerScore7: 0
playerScore8: 0
playerScore9: 0
quadraKills: 0
sightWardsBoughtInGame: 0
statPerk0: 5008
statPerk1: 5008
statPerk2: 5002
timeCCingOthers: 17
totalDamageDealt: 69258
totalDamageDealtToChampions: 9937
totalDamageTaken: 25755
totalHeal: 2690
totalMinionsKilled: 131
totalPlayerScore: 0
totalScoreRank: 0
totalTimeCrowdControlDealt: 103
totalUnitsHealed: 1
tripleKills: 0
trueDamageDealt: 0
trueDamageDealtToChampions: 0
trueDamageTaken: 1151
turretKills: 0
unrealKills: 0
visionScore: 9
visionWardsBoughtInGame: 0
wardsKilled: 1
wardsPlaced: 7
win: false
*/
