const casual = require("casual");

const gameModes = ["unrated", "spike_rush", "competitive"];
const weapons = ["phantom", "operator", "vandal", "odin"];
const armors = ["none", "light", "heavy"];
const roundResultKey = ["won", "lost"];

module.exports = {
  generateMatchInfoDTO: function (matchId) {
    let gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    let matchInfo = {
      matchId: matchId,
      mapId: casual.integer((from = 1), (to = 4)),
      gameLengthMillis: casual.integer((from = 900000), (to = 1800000)),
      gameStartMillis: casual.unix_time,
      provisioningFlowId: "matchmaking",
      isCompleted: true,
      customGameName: "",
      queueId: casual.uuid,
      gameMode: gameMode,
      isRanked: gameMode === "competitive" ? true : false,
      seasonId: casual.uuid,
    };
    return matchInfo;
  },
  generatePlayerDTO: function () {
    let playerObj = {};
    playerObj.puuid = casual.uuid;
    playerObj.teamId = casual.uuid;
    playerObj.partyId = casual.uuid;
    playerObj.characterId = casual.word;
    playerObj.competitiveTier = casual.integer((from = 1), (to = 22));
    playerObj.playerCard = casual.word;
    playerObj.playerTitle = casual.title;
    playerObj.stats = generatePlayerStatsDTO();
    return playerObj;
  },
  generateTeamDTO: function (t, teamBool) {
    let teamObj = {
      teamId: String(t),
      won: t == 0 ? teamBool : !teamBool,
      roundsPlayed: casual.integer((from = 0), (to = 12)),
      roundsWon: casual.integer((from = 0), (to = 12)),
    };
    return teamObj;
  },
  generateRoundResultDTO: function (r) {
    let roundResObj = {};
    roundResObj.roundNum = r + 1;
    roundResObj.roundResult =
      roundResultKey[Math.floor(Math.random() * roundResultKey.length)];
    roundResObj.roundCeremony = "unknown";
    roundResObj.winningTeam = casual.uuid;
    roundResObj.bombPlanter = casual.uuid;
    roundResObj.bombDefuser = casual.uuid;
    roundResObj.plantRoundTime = casual.integer((from = 100), (to = 100000));
    roundResObj.plantPlayerLocations = new Array(10)
      .fill()
      .map(() => casual.point);
    roundResObj.plantLocation = casual.point;
    roundResObj.plantSite = "A | B | C";
    roundResObj.defuseRoundTime = casual.integer((from = 100), (to = 100000));
    roundResObj.defusePlayerLocations = new Array(10)
      .fill()
      .map(() => casual.point);
    roundResObj.defuseLocation = casual.point;
    roundResObj.playerStats = [];
    for (var p = 0; p < 10; p++) {
      roundResObj.playerStats.push(generatePlayerStatsDTO());
    }
    roundResObj.roundResultCode = "unknown";
    return roundResObj;
  },
};

casual.define("point", function () {
  return {
    x: casual.integer((from = 0), (to = 100)),
    y: casual.integer((from = 0), (to = 100)),
  };
});

function generatePlayerStatsDTO() {
  let playerStats = {};
  playerStats.puuid = casual.uuid;
  playerStats.score = casual.integer((from = 10), (to = 400));
  playerStats.kills = [];
  playerStats.damage = [];
  for (var r = 0; r < 13; r++) {
    let killsObj = {};
    killsObj.gameTime = casual.integer((from = 900000), (to = 1800000));
    killsObj.roundTime = casual.integer((from = 100), (to = 100000));
    killsObj.killer = casual.uuid;
    killsObj.victim = casual.uuid;
    killsObj.victimLocation = casual.point;
    killsObj.assistants = new Array(casual.integer((from = 0), (to = 5)))
      .fill()
      .map(() => casual.uuid);
    killsObj.playerLocations = new Array(10).fill().map(() => casual.point);
    killsObj.finishingDamage = {
      damageType: "unknown",
      damageItem: weapons[Math.floor(Math.random() * weapons.length)],
      isSecondaryFireMode: casual.boolean,
    };
    playerStats.kills.push(killsObj);

    let damageObj = {};
    damageObj.receiver = casual.uuid;
    damageObj.damage = casual.integer((from = 0), (to = 300));
    damageObj.legshots = casual.integer((from = 0), (to = 5));
    damageObj.bodyshots = casual.integer((from = 0), (to = 5));
    damageObj.headshots = casual.integer((from = 0), (to = 5));
    playerStats.damage.push(damageObj);
  }
  playerStats.economy = {
    loadoutValue: casual.integer((from = 1), (to = 40)),
    weapon: weapons[Math.floor(Math.random() * weapons.length)],
    armor: armors[Math.floor(Math.random() * armors.length)],
    remaining: casual.integer((from = 0), (to = 10000)),
    spent: casual.integer((from = 0), (to = 10000)),
  };
  playerStats.ability = {
    grenadeEffects: "unknown",
    ability1Effects: "unknown",
    ability2Effects: "unknown",
    ultimateEffects: "unknown",
  };
  return playerStats;
}
