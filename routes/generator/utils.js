const casual = require("casual");

const plantsite = ["A", "B", "C"];
const rrcd = ["Defuse", "Elimination"];
const damtype = ["Weapon", "knife"];
const mapId = ["/Game/Maps/Ascent/Ascent", "/Game/Maps/Bonsai/Bonsai", "/Game/Maps/Duality/Duality", "/Game/Maps/Triad/Triad"];
const queueID = ["unrated", "spike_rush", "competitive"];
const weapons = [
	"0AFB2636-4093-C63B-4EF1-1E97966E2A3E",
	"63E6C2B6-4A8E-869C-3D4C-E38355226584",
	"55D8A0F4-4274-CA67-FE2C-06AB45EFDF58",
	"9C82E19D-4575-0200-1A81-3EACF00CF872",
	"AE3DE142-4D85-2547-DD26-4E90BED35CF7",
	"EE8E8D15-496B-07AC-E5F6-8FAE5D4C7B1A",
	"EC845BF4-4F79-DDDA-A3DA-0DB3774B2794",
	"910BE174-449B-C412-AB22-D0873436B21B",
	"44D4E95C-4157-0037-81B2-17841BF2E8E3",
	"29A0CFAB-485B-F5D5-779A-B59F85E204A8",
	"1BAA85B4-4C70-1284-64BB-6481DFC3BB4E",
	"E336C6B8-418D-9340-D77F-7A9E4CFE0702",
	"42DA8CCC-40D5-AFFC-BEEC-15AA47B42EDA",
	"A03B24D3-4319-996D-0F8C-94BBFBA1DFC7",
	"4ADE7FAA-4CF1-8376-95EF-39884480959B",
	"C4883E50-4494-202C-3EC3-6B8A9284F00B",
	"462080D1-4035-2937-7C09-27AA2A5C27A7",
	"F7E1B454-4AD4-1063-EC0A-159E56B58941",
	"2F59173C-4BED-B6C3-2191-DEA9B58BE9C7",
];
const roundResultKey = ["Bomb defused", "Eliminated"];
const teamID = ["Red", "Blue"];
const gameModes = ["/Game/GameModes/Bomb/BombGameMode.BombGameMode_C", "/Game/GameModes/Bomb/QuickPlay_BombGameMode.QuickPlay_BombGameMode_C", "/Game/GameModes/Deathmatch/DeathmatchGameMode.DeathmatchGameMode_C"];
const roundCeremon = ["CeremonyDefault", "CeremonyFlawless", "CeremonyCloser"];
const charId = [
	"5F8D3A7F-467B-97F3-062C-13ACF203C006",
	"9F0D8BA9-4140-B941-57D3-A7AD57C6B417",
	"117ED9E3-49F3-6512-3CCF-0CADA7E3823B",
	"ADD6443A-41BD-E414-F6AD-E58D267F4E95",
	"8E253930-4C05-31DD-1B6C-968525494517",
	"EB93336A-449B-9C1B-0A54-A891F7921D69",
	"F94C3B30-42BE-E959-889C-5AA313DBA261",
	"A3BFB853-43B2-7238-A4F1-AD90E9E46BCC",
	"569FDD95-4D10-43AB-CA70-79BECC718B46",
	"320B2A48-4D9B-A075-30F1-1F93A9B638FA",
	"707EAB51-4836-F488-046A-CDA6BF494859",
	"1E58DE9C-4950-5125-93E9-A0AEE9F98746",
];

module.exports = {
	generateMatchInfoDTO: function (matchId) {
		let queueId = queueID[Math.floor(Math.random() * queueID.length)];
		let gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
		let matchInfo = {
			matchId: matchId,
			mapId: mapId[Math.floor(Math.random() * mapId.length)],
			gameLengthMillis: casual.integer((from = 900000), (to = 1800000)),
			gameStartMillis: casual.unix_time,
			provisioningFlowId: "Matchmaking",
			isCompleted: true,
			customGameName: "",
			queueId: queueId,
			gameMode: gameMode,
			isRanked: gameMode === "/Game/GameModes/Bomb/BombGameMode.BombGameMode_C" ? casual.boolean : false,
			seasonId: casual.uuid,
		};
		return matchInfo;
	},
	generatePlayerDTO: function () {
		let playerObj = {};
		playerObj.puuid = casual.uuid;
		playerObj.teamId = teamID[Math.floor(Math.random() * teamID.length)];
		playerObj.partyId = casual.uuid;
		(playerObj.characterId = charId[Math.floor(Math.random() * charId.length)]),
			(playerObj.stats = {
				score: casual.integer((from = 2000), (to = 10000)),
				roundsPlayed: 24,
				kills: casual.integer((from = 0), (to = 50)),
				deaths: casual.integer((from = 5), (to = 25)),
				assists: casual.integer((from = 0), (to = 10)),
				playtimeMillis: casual.unix_time,
				abilityCasts: {
					granadeCasts: casual.integer((from = 0), (to = 25)),
					ability1Casts: casual.integer((from = 0), (to = 25)),
					ability2Casts: casual.integer((from = 0), (to = 25)),
					ability3Casts: casual.integer((from = 0), (to = 25)),
				},
			});

		playerObj.competitiveTier = casual.integer((from = 1), (to = 22));
		playerObj.playerCard = casual.uuid;
		playerObj.playerTitle = casual.uuid;

		return playerObj;
	},
	generateTeamDTO: function (t, teamBool) {
		(won = t == "Red" ? teamBool : !teamBool), (roundsPlayed = casual.integer((from = 13), (to = 24)));
		roundsWon = casual.integer((from = 0), (to = 13));
		if (won == true) {
			roundsWon = roundsPlayed - roundsWon;
		} else {
			roundsWon = roundsWon;
		}

		teamObj = {
			teamId: t,
			won: won,
			roundsPlayed: roundsPlayed,
			roundsWon: roundsWon,
		};
		return teamObj;
	},

	generateRoundResultDTO: function (r) {
		let roundResObj = {};
		roundResObj.roundNum = r;
		roundResObj.roundResult = roundResultKey[Math.floor(Math.random() * roundResultKey.length)];
		roundResObj.roundCeremony = roundCeremon[Math.floor(Math.random() * roundCeremon.length)];
		roundResObj.winningTeam = teamID[Math.floor(Math.random() * teamID.length)];
		roundResObj.bombPlanter = casual.uuid;
		roundResObj.bombDefuser = casual.uuid;
		roundResObj.plantRoundTime = casual.integer((from = 0), (to = 100000));
		roundResObj.plantPlayerLocations = new Array(10).fill().map(() => casual.point);
		roundResObj.plantLocation = {
			x: casual.integer((from = -1000), (to = 10000)),
			y: casual.integer((from = -10000), (to = 10000)),
		};
		roundResObj.plantSite = plantsite[Math.floor(Math.random() * plantsite.length)];
		roundResObj.defuseRoundTime = casual.integer((from = 0), (to = 100000));
		roundResObj.defusePlayerLocations = new Array(5).fill().map(() => casual.point);
		roundResObj.defuseLocation = {
			x: casual.integer((from = -1000), (to = 10000)),
			y: casual.integer((from = -10000), (to = 10000)),
		};
		roundResObj.playerStats = [];
		for (var p = 0; p < 10; p++) {
			roundResObj.playerStats.push(generatePlayerStatsDTO());
		}
		roundResObj.roundResultCode = rrcd[Math.floor(Math.random() * rrcd.length)];
		return roundResObj;
	},
};

casual.define("point", function () {
	return {
		puuid: casual.uuid,
		viewRadians: casual.double((from = 0), (to = 20)),
		location: {
			x: casual.integer((from = -1000), (to = 10000)),
			y: casual.integer((from = -10000), (to = 10000)),
		},
	};
});

function generatePlayerStatsDTO() {
	let playerStats = {};
	playerStats.puuid = casual.uuid;
	playerStats.kills = generateKillsDTO();
	playerStats.damage = generateDamageDTO();
	playerStats.score = casual.integer((from = 10), (to = 400));

	playerStats.economy = {
		loadoutValue: casual.integer((from = 400), (to = 5000)),
		weapon: weapons[Math.floor(Math.random() * weapons.length)],
		armor: casual.uuid,
		remaining: casual.integer((from = 0), (to = 10000)),
		spent: casual.integer((from = 0), (to = 10000)),
	};
	playerStats.ability = {
		grenadeEffects: casual.integer((from = 0), (to = 15)),
		ability1Effects: casual.integer((from = 0), (to = 15)),
		ability2Effects: casual.integer((from = 0), (to = 15)),
		ultimateEffects: casual.integer((from = 0), (to = 15)),
	};
	return playerStats;
}

function generateKillsDTO() {
	let killsArray = [];
	let randKillIndex = casual.integer((from = 0), (to = 4));
	let i = 0;
	while (i < randKillIndex) {
		let killsObj = {};
		killsObj.gameTime = casual.integer((from = 500000), (to = 1800000));
		killsObj.roundTime = casual.integer((from = 100), (to = 100000));
		killsObj.killer = casual.uuid;
		killsObj.victim = casual.uuid;
		killsObj.victimLocation = {
			x: casual.integer((from = -1000), (to = 10000)),
			y: casual.integer((from = -10000), (to = 10000)),
		};
		killsObj.assistants = new Array(casual.integer((from = 0), (to = 5))).fill().map(() => casual.uuid);
		killsObj.playerLocations = new Array(6).fill().map(() => casual.point);
		killsObj.finishingDamage = {
			damageType: damtype[Math.floor(Math.random() * damtype.length)],
			damageItem: weapons[Math.floor(Math.random() * weapons.length)],
			isSecondaryFireMode: casual.boolean,
		};
		killsArray.push(killsObj);
		i++;
	}
	return killsArray;
}

function generateDamageDTO() {
	let damageArray = [];
	let randDamageIndex = casual.integer((from = 2), (to = 5));
	let i = 0;
	while (i < randDamageIndex) {
		let damageObj = {};
		damageObj.receiver = casual.uuid;
		damageObj.damage = casual.integer((from = 0), (to = 300));
		damageObj.legshots = casual.integer((from = 0), (to = 5));
		damageObj.bodyshots = casual.integer((from = 0), (to = 5));
		damageObj.headshots = casual.integer((from = 0), (to = 5));
		damageArray.push(damageObj);
		i++;
	}
	return damageArray;
}
