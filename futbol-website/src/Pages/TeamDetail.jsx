import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box,
  Grid
} from "@mui/material";
import { useData } from "../context/DataContext";
import GoalsStats from "../Components/TeamDetail_Goal.jsx";
import CornerStats from "../Components/TeamDetail_Corner.jsx";
import CardStats from "../Components/TeamDetail_Card.jsx";

const TeamDetail = () => {
  const { league, team } = useParams();
  const { matches, goalStats, setSelectedLeague, selectedLeague } = useData();

  // URL'den gelen lig parametresini selectedLeague'e set et
  useEffect(() => {
    if (league) {
      // URL'deki lig ismini backend formatına çevir
      const leagueNameMap = {
        "superlig": "Super Lig",
        "premier-league": "Premier League",
        "laliga": "LaLiga",
        "seriea": "Serie A",
        "bundesliga": "Bundesliga",
        "ligue1": "Ligue 1",
        "eredivisie": "Eredivisie",
        "champions-league": "UEFA Champions League",
        "europa-league": "UEFA Europa League",
        "europa-conference-league": "UEFA Europa Conference League",
        "primeira-liga": "Primeira Liga",
        "pro-league": "Pro League",
      };
      
      const leagueName = leagueNameMap[league] || league;
      if (leagueName !== selectedLeague) {
        setSelectedLeague(leagueName);
      }
    }
  }, [league, selectedLeague, setSelectedLeague]);

  // ✅ SADECE SEÇİLEN TAKIMIN MAÇLARI
  const teamMatches = matches.filter(
    m => (m.homeTeam === team || m.awayTeam === team) && m.league === selectedLeague
  );

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      {/* HEADER */}
      <Typography variant="h4">{team}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {league}
      </Typography>

      <Divider />

      {/* ⚽ GOLLER */}
      <Accordion>
        <AccordionSummary >
          <Typography fontWeight="bold">⚽ Gol İstatistikleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GoalsStats matches={teamMatches} team={team} goalStats={goalStats}/>
        </AccordionDetails>
      </Accordion>

      {/* 🚩 KORNER */}
      <Accordion>
        <AccordionSummary >
          <Typography fontWeight="bold">🚩 Korner İstatistikleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CornerStats matches={teamMatches} />
        </AccordionDetails>
      </Accordion>

      {/* 🟨 KART */}
      <Accordion>
        <AccordionSummary >
          <Typography fontWeight="bold">🟨 Kart İstatistikleri</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CardStats matches={teamMatches} />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
};

export default TeamDetail;
