const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const connectDBserver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("successfully done project");
    });
  } catch (e) {
    console.log(`error: ${e.message}`);
    process.exit(1);
  }
};

connectDBserver();
app.get("/players/", async (request, response) => {
  const dbObject = `SELECT * FROM cricket_team`;
  const final = await db.all(dbObject);
  let arr = [];
  for (let dbObjec of final) {
    const convertDbObjectToResponseObject = (dbObjec) => {
      return {
        playerId: dbObjec.player_id,
        playerName: dbObjec.player_name,
        jerseyNumber: dbObjec.jersey_number,
        role: dbObjec.role,
      };
    };
    arr.push(convertDbObjectToResponseObject(dbObjec));
  }

  response.send(arr);
});
//

// post

// app.post("/players/",(request,response)=>{
//     const playerDetails = request.body

// })
// const convertDbObjectToResponseObject = (dbObject) => {
//   return {
//     playerId: dbObject.player_id,
//     playerName: dbObject.player_name,
//     jerseyNumber: dbObject.jersey_number,
//     role: dbObject.role,
//   };
// };

// const dbObject = `SELECT
//     player_id as playerId,player_name as playerName,jersey_number as jersyNumber,role
//   FROM cricket_team ORDER BY player_id`;

//   let teamfinal = await db.all(dbObject);
//   let ss = JSON.stringify(teamfinal);
//   let dd = JSON.parse(ss);
//   response.send(dd);

app.post("/players/", async (request, response) => {
  const teamDetails = request.body;
  const { playerName, jerseyNumber, role } = teamDetails;
  const dbObject = `INSERT INTO cricket_team(player_name,jersey_number,role)
    VALUES ('${playerName}',${jerseyNumber},'${role}');`;

  const final = await db.run(dbObject);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dbObject = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const final = await db.get(dbObject);
  const dataTranferToResponse = (final) => {
    return {
      playerId: final.player_id,
      playerName: final.player_name,
      jerseyNumber: final.jersey_number,
      role: final.role,
    };
  };

  response.send(dataTranferToResponse(final));
});

// put

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const teamDetails = request.body;
  const { playerName, jerseyNumber, role } = teamDetails;
  const dbObject = `UPDATE  cricket_team 
    SET player_name = '${playerName}', jersey_number = ${jerseyNumber},role = '${role}'
      WHERE player_id = ${playerId};`;

  await db.run(dbObject);
  response.send("Player Details Updated");
});

// delete

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dbO = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(dbO);
  response.send("Player Removed");
});

module.exports = app;
