import fs from "fs";
import sqlite3 from "sqlite3";

/* =======================
   CONFIG
======================= */

const MATCH_FILE = "matches.txt"; // txt dosyan
const DB_FILE = "../FutbolSitesi/futbol.db"; // SQLite dosya yolu

/* =======================
   READ TXT
  ======================= */

const raw = fs.readFileSync(MATCH_FILE, "utf-8");

// boş satırları temizle
const lines = raw.split("\n").filter(l => l.trim());

// header
const headers = lines.shift().split(",");

/* =======================
   PARSE MATCHES
======================= */

const matches = lines.map(line => {
  const values = line.split(",");

  const obj = {};
  headers.forEach((h, i) => {
    obj[h] = values[i];
  });

  return {
    season: obj.Season,
    league: obj.League,
    home: obj.HomeTeam,
    away: obj.AwayTeam,
    winner: obj.Winner,        // Home | Away | Draw | TBD
    gh: Number(obj.GoalHome),
    ga: Number(obj.GoalAway)
  };
});

/* =======================
   BUILD STANDINGS
======================= */

const table = {};

function initTeam(season, league, team) {
  if (!table[league]) table[league] = {};

  if (!table[league][team]) {
    table[league][team] = {
      season,
      league,
      team,
      played: 0,
      win: 0,
      draw: 0,
      lose: 0,
      gf: 0,
      ga: 0,
      points: 0
    };
  }
}

/* =======================
   PROCESS MATCHES
======================= */

for (const m of matches) {
  // oynanmamış maçlar tabloya girmez
  if (m.winner === "TBD") continue;

  initTeam(m.season, m.league, m.home);
  initTeam(m.season, m.league, m.away);

  const home = table[m.league][m.home];
  const away = table[m.league][m.away];

  home.played++;
  away.played++;

  home.gf += m.gh;
  home.ga += m.ga;

  away.gf += m.ga;
  away.ga += m.gh;

  if (m.winner === "Home") {
    home.win++;
    home.points += 3;
    away.lose++;
  } 
  else if (m.winner === "Away") {
    away.win++;
    away.points += 3;
    home.lose++;
  } 
  else {
    home.draw++;
    away.draw++;
    home.points++;
    away.points++;
  }
}

/* =======================
   SAVE TO SQLITE
======================= */

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  // önce temizle
  db.run(`DELETE FROM Standings`);

  const stmt = db.prepare(`
    INSERT INTO Standings
    (
      Season,
      League,
      Team,
      Played,
      Win,
      Draw,
      Lose,
      GoalFor,
      GoalAgainst,
      GoalDiff,
      Points
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const league in table) {
    for (const team in table[league]) {
      const t = table[league][team];

      stmt.run([
        t.season,
        t.league,
        t.team,
        t.played,
        t.win,
        t.draw,
        t.lose,
        t.gf,
        t.ga,
        t.gf - t.ga,
        t.points
      ]);
    }
  }

  stmt.finalize();
});

db.close();

console.log("✅ Standings başarıyla oluşturuldu ve SQLite'a yazıldı.");
