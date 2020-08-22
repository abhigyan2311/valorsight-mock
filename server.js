const express = require("express");
const bodyParser = require("body-parser");
const statusMonitor = require("express-status-monitor")();

var utils = require("./routes/generator/utils");
const casual = require("casual");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const dbfilePath = "db.json";

const adapter = new FileSync(dbfilePath);
const db = low(adapter);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(statusMonitor);

const port = 3000;
const n = 2; //Number of summoners to generate
const activeShards = ["na", "euw", "oc"];

app.get("/riot/account/v1/accounts/by-puuid/:puuid", (req, res) => {
	const reqPuuid = req.params.puuid;
	const dbRes = db.get("summoners").find({ puuid: reqPuuid }).value();
	if (typeof dbRes !== "undefined") {
		const response = {
			puuid: dbRes.puuid,
			gameName: dbRes.gameName,
			tagLine: dbRes.tagLine,
		};
		res.json(response);
	} else {
		res.json({
			errorCode: 404,
			error: "Account not found",
		});
	}
});

app.get("/riot/account/v1/accounts/by-riot-id/:gameName/:tagLine", (req, res) => {
	const reqGameName = req.params.gameName;
	const reqtagLine = req.params.tagLine;
	const dbRes = db
		.get("summoners")
		.find({ gameName: reqGameName, tagLine: parseInt(reqtagLine) })
		.value();
	if (typeof dbRes !== "undefined") {
		const response = {
			puuid: dbRes.puuid,
			gameName: dbRes.gameName,
			tagLine: dbRes.tagLine,
		};
		res.json(response);
	} else {
		res.json({
			errorCode: 404,
			error: "Account not found",
		});
	}
});

app.get("/riot/account/v1/active-shards/by-game/:game/by-puuid/:puuid", (req, res) => {
	const reqPuuid = req.params.puuid;
	const reqGame = req.params.game;
	const dbRes = db.get("summoners").find({ puuid: reqPuuid, game: reqGame }).value();
	if (typeof dbRes !== "undefined") {
		const response = {
			puuid: dbRes.puuid,
			game: dbRes.game,
			activeShard: dbRes.activeShard,
		};
		res.json(response);
	} else {
		res.json({
			errorCode: 404,
			error: "Account not found",
		});
	}
});

app.get("/val/match/v1/matchlists/by-puuid/:puuid", (req, res) => {
	const reqPuuid = req.params.puuid;
	const dbRes = db.get("summoners").find({ puuid: reqPuuid }).value();
	if (typeof dbRes !== "undefined") {
		const response = {
			puuid: dbRes.puuid,
			history: dbRes.matchList,
		};
		res.json(response);
	} else {
		res.json({
			errorCode: 404,
			error: "Account not found",
		});
	}
});

app.get("/val/match/v1/matches/:matchId", (req, res) => {
	const reqMatchId = req.params.matchId;
	const dbRes = db.get("matches").find({ id: reqMatchId }).value();
	if (typeof dbRes !== "undefined") {
		res.json(dbRes.data);
	} else {
		res.json({
			errorCode: 404,
			error: "Match not found",
		});
	}
});

app.get("/", (req, res) => {
	res.send("ValorSight Mock running successfully!");
});

app.get("/status", statusMonitor.pageRoute);

app.get("/init", (req, res) => {
	db.defaults({ summoners: [], matches: [] }).write();
	res.send("Successfully initialized DB!");
});

app.get("/generate", (req, res) => {
	let matchIds = [];
	let summonerIdsList = [];
	for (var i = 0; i < n; i++) {
		var summoner = {};
		summoner.puuid = casual.uuid;
		summonerIdsList.push(summoner.puuid);
		summoner.gameName = casual.username;
		summoner.tagLine = casual.integer((from = 1), (to = 1000));
		summoner.activeShard = activeShards[Math.floor(Math.random() * activeShards.length)];
		summoner.game = "val";
		summoner.matchList = new Array(10).fill().map(() => casual.uuid);
		matchIds.push(summoner.matchList);
		db.get("summoners").push(summoner).write();
		console.log("summoner saved: ", summoner.puuid);
	}
	let masterIdList = [];
	for (let t of summonerIdsList) {
		masterIdList.push(t);
		masterIdList.push(t);
	}
	console.log(masterIdList);
	matchIds = [].concat.apply([], matchIds);
	for (let matchIndex in matchIds) {
		let matchObj = {};
		//matchInfo
		matchObj.matchInfo = [utils.generateMatchInfoDTO(matchIds[matchIndex])];
		//players
		let playerList = [];
		for (var x = 0; x < 10; x++) {
			playerList.push(utils.generatePlayerDTO());
		}
		playerList[0].puuid = masterIdList[matchIndex];
		matchObj.players = playerList;
		//teams
		let teams = [];
		let arr = ["Red", "Blue"];
		teamBool = casual.boolean;
		for (var t = 0; t < 2; t++) {
			teams.push(utils.generateTeamDTO(arr[t], teamBool));
		}
		matchObj.teams = teams;
		//roundResults
		matchObj.roundResults = [];
		for (var r = 0; r < 12; r++) {
			matchObj.roundResults.push(utils.generateRoundResultDTO(r, masterIdList[matchIndex]));
		}
		//Push to DB
		db.get("matches").push({ id: matchIds[matchIndex], data: matchObj }).write();
	}
	res.send(`Successfully generated ${n} summoners and ${matchIds.length} matches!`);
});

app.listen(port, () => console.log(`ValorSight Mock listening at http://localhost:${port}`));
