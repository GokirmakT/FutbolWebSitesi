import axios from "axios";
import fs from "fs";

/* ----------------- LIG LISTESI ----------------- */
const leagues = [
  { code: "eng.1", name: "Premier League" },
  { code: "tur.1", name: "Super Lig" },
  { code: "esp.1", name: "LaLiga" },
  { code: "ita.1", name: "Serie A" },
  { code: "ger.1", name: "Bundesliga" },
  { code: "fra.1", name: "Ligue 1" },
  { code: "ned.1", name: "Eredivisie" },
  { code: "por.1", name: "Primeira Liga" },
  { code: "bel.1", name: "Pro League" },
  { code: "uefa.champions", name: "UEFA Champions League" },
  { code: "uefa.europa", name: "UEFA Europa League" },
  { code: "uefa.europa.conf", name: "UEFA Europa Conference League" }
];

/* ----------------- UTILS ----------------- */
function formatDate(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getWeekNumber(date) {
  const seasonStart = new Date("2025-08-08");
  const diff = Math.floor((date - seasonStart) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? Math.floor(diff / 7) + 1 : 0;
}

/* ----------------- FETCH ----------------- */
async function fetchScoreboard(leagueCode, start, end) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueCode}/scoreboard?dates=${formatDate(
    start
  )}-${formatDate(end)}`;
  const { data } = await axios.get(url);
  return data.events || [];
}

/* ----------------- PARSE ----------------- */
function parseMatch(event, leagueName) {
  const competition = event.competitions?.[0];
  if (!competition) return null;

  const home = competition.competitors?.find(c => c.homeAway === "home");
  const away = competition.competitors?.find(c => c.homeAway === "away");
  if (!home || !away) return null;

  const matchDate = new Date(event.date);
  const [datePart, timePartFull] = event.date.split("T");
  const timePart = timePartFull?.slice(0, 5);

  const state = competition.status?.type?.state;
  const isPlayed = state === "post";

  let yellowHome = 0,
    yellowAway = 0,
    redHome = 0,
    redAway = 0,
    cornerHome = 0,
    cornerAway = 0,
    shotsHome = 0,
    shotsAway = 0,
    shotsOnTargetHome = 0,
    shotsOnTargetAway = 0,
    foulsHome = 0,
    foulsAway = 0,
    possessionHome = 0,
    possessionAway = 0;

  let homeGoalsMinutes = [];
  let awayGoalsMinutes = [];

  if (isPlayed) {
    const stat = (team, name) =>
      Number(team.statistics?.find(s => s.name === name)?.displayValue || 0);

    cornerHome = stat(home, "wonCorners");
    cornerAway = stat(away, "wonCorners");

    shotsHome = stat(home, "totalShots");
    shotsAway = stat(away, "totalShots");

    shotsOnTargetHome = stat(home, "shotsOnTarget");
    shotsOnTargetAway = stat(away, "shotsOnTarget");

    foulsHome = stat(home, "foulsCommitted");
    foulsAway = stat(away, "foulsCommitted");

    possessionHome = Number(
      home.statistics?.find(s => s.name === "possessionPct")?.displayValue?.replace("%", "") || 0
    );
    possessionAway = Number(
      away.statistics?.find(s => s.name === "possessionPct")?.displayValue?.replace("%", "") || 0
    );

    if (Array.isArray(competition.details)) {
        for (const d of competition.details) {
            if (d.yellowCard) {
            d.team?.id === home.team.id ? yellowHome++ : yellowAway++;
            }

            if (d.redCard) {
            d.team?.id === home.team.id ? redHome++ : redAway++;
            }

            // ✅ GOL DAKİKALARI (KESİN ÇALIŞIR)
            if (d.type?.text === "Goal" && d.clock?.displayValue) {
            const minute = d.clock.displayValue.replace("'", "");
            if (d.team?.id === home.team.id) {
                homeGoalsMinutes.push(minute);
            } else if (d.team?.id === away.team.id) {
                awayGoalsMinutes.push(minute);
                    }
                    }
                }
                }
            }

  return {
    Season: "2025-2026",
    League: leagueName,
    Week: getWeekNumber(matchDate),
    Date: datePart,
    Time: timePart,

    HomeTeam: home.team.displayName,
    AwayTeam: away.team.displayName,

    Winner: isPlayed
      ? home.score === away.score
        ? "Draw"
        : Number(home.score) > Number(away.score)
        ? "Home"
        : "Away"
      : "TBD",

    GoalHome: isPlayed ? Number(home.score) : 0,
    GoalAway: isPlayed ? Number(away.score) : 0,

    CornerHome: cornerHome,
    CornerAway: cornerAway,

    YellowHome: yellowHome,
    YellowAway: yellowAway,

    RedHome: redHome,
    RedAway: redAway,

    ShotsHome: shotsHome,
    ShotsAway: shotsAway,

    ShotsOnTargetHome: shotsOnTargetHome,
    ShotsOnTargetAway: shotsOnTargetAway,

    FoulsHome: foulsHome,
    FoulsAway: foulsAway,

    PossessionHome: possessionHome,
    PossessionAway: possessionAway,

    HomeGoalsMinutes: homeGoalsMinutes.join("|"),
    AwayGoalsMinutes: awayGoalsMinutes.join("|")
  };
}

/* ----------------- RUN ----------------- */
async function run() {
  const seasonStart = new Date("2025-08-08");
  const seasonEnd = new Date("2026-06-01");

  let allMatches = [];

  for (const league of leagues) {
    console.log(`⏳ ${league.name} fikstürü çekiliyor...`);
    let cursor = seasonStart;

    while (cursor <= seasonEnd) {
      const rangeEnd = addDays(cursor, 6);
      const events = await fetchScoreboard(league.code, cursor, rangeEnd);

      for (const event of events) {
        const match = parseMatch(event, league.name);
        if (match) allMatches.push(match);
      }

      cursor = addDays(rangeEnd, 1);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  /* ----------------- CSV ----------------- */
  let csv =
    "Season,League,Week,Date,Time,HomeTeam,AwayTeam,Winner," +
    "GoalHome,GoalAway,CornerHome,CornerAway," +
    "YellowHome,YellowAway,RedHome,RedAway," +
    "ShotsHome,ShotsAway,ShotsOnTargetHome,ShotsOnTargetAway," +
    "FoulsHome,FoulsAway,PossessionHome,PossessionAway," +
    "HomeGoalsMinutes,AwayGoalsMinutes\n";

  for (const m of allMatches) {
    csv +=
      `${m.Season},${m.League},${m.Week},${m.Date},${m.Time},` +
      `${m.HomeTeam},${m.AwayTeam},${m.Winner},` +
      `${m.GoalHome},${m.GoalAway},` +
      `${m.CornerHome},${m.CornerAway},` +
      `${m.YellowHome},${m.YellowAway},` +
      `${m.RedHome},${m.RedAway},` +
      `${m.ShotsHome},${m.ShotsAway},` +
      `${m.ShotsOnTargetHome},${m.ShotsOnTargetAway},` +
      `${m.FoulsHome},${m.FoulsAway},` +
      `${m.PossessionHome},${m.PossessionAway},` +
      `"${m.HomeGoalsMinutes}","${m.AwayGoalsMinutes}"\n`;
  }

  fs.writeFileSync("Matches.txt", csv, "utf-8");
  console.log(`✅ TOPLAM ${allMatches.length} maç yazıldı`);
}

run();
