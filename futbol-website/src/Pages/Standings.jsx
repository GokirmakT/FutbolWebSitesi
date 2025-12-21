import { useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Stack,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos";

function Standings() {
  const { leagueId } = useParams();
  const { standings, isLoadingStandings, selectedLeague, setSelectedLeague, standingsError } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");

  // League ID'yi backend lig ismine çevir
  const leagueIdToName = {
    "superlig": "Super Lig",
    "premier-league": "Premier League",
    "laliga": "LaLiga",
    "seriea": "Serie A",
    "bundesliga": "Bundesliga",
    "ligue1": "Ligue 1",
    "eredivisie": "Eredivisie",
    "champions-league": "Champions League",
    "europa-league": "Europa League",
    "europa-conference-league": "Europa Conference League"
  };

  // URL'den gelen leagueId varsa, o lige göre filtrele
  const currentLeague = leagueId ? (leagueIdToName[leagueId] || selectedLeague) : selectedLeague;

  // URL'den lig geldiğinde state'i güncelle
  useEffect(() => {
    if (leagueId && leagueIdToName[leagueId]) {
      setSelectedLeague(leagueIdToName[leagueId]);
    }
  }, [leagueId, setSelectedLeague]);

  // Seçilen lige göre sıralanmış puan durumu
  const sortedStandings = useMemo(() => {
    if (!standings.length || !currentLeague) return [];

    // Lige göre filtrele (hem camelCase hem PascalCase desteği)
    const leagueStandings = standings.filter(
      (s) => (s.league || s.League) === currentLeague
    );

    // Futbol puan tablosu kurallarına göre sırala:
    // 1. Puan (yüksekten düşüğe)
    // 2. Averaj (GoalDiff - yüksekten düşüğe)
    // 3. Attığı gol (GoalFor - yüksekten düşüğe)
    const sorted = [...leagueStandings].sort((a, b) => {
      const aPoints = a.points || a.Points || 0;
      const bPoints = b.points || b.Points || 0;
      const aGoalDiff = a.goalDiff || a.GoalDiff || 0;
      const bGoalDiff = b.goalDiff || b.GoalDiff || 0;
      const aGoalFor = a.goalFor || a.GoalFor || 0;
      const bGoalFor = b.goalFor || b.GoalFor || 0;

      // Önce puan
      if (bPoints !== aPoints) {
        return bPoints - aPoints;
      }
      // Sonra averaj
      if (bGoalDiff !== aGoalDiff) {
        return bGoalDiff - aGoalDiff;
      }
      // Son olarak attığı gol
      return bGoalFor - aGoalFor;
    });

    // Sıralama ekle (rank) ve normalize et
    return sorted.map((team, index) => ({
      ...team,
      rank: index + 1,
      // Normalize: camelCase'e çevir
      team: team.team || team.Team || "",
      played: team.played || team.Played || 0,
      win: team.win || team.Win || 0,
      draw: team.draw || team.Draw || 0,
      lose: team.lose || team.Lose || 0,
      goalFor: team.goalFor || team.GoalFor || 0,
      goalAgainst: team.goalAgainst || team.GoalAgainst || 0,
      goalDiff: team.goalDiff || team.GoalDiff || 0,
      points: team.points || team.Points || 0,
    }));
  }, [standings, currentLeague]);

  if (isLoadingStandings) {
    return (
      <Typography textAlign="center" sx={{ color: "#fff", mt: 3 }}>
        Yükleniyor...
      </Typography>
    );
  }

  if (standingsError) {
    return (
      <Typography textAlign="center" sx={{ color: "#ff4d4d", mt: 3 }}>
        Hata oluştu: {standingsError.message}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1a1a1a",
        color: "#fff",
        py: 4,
        px: isMobile ? 1 : 4,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Puan Durumu
        </Typography>

        {currentLeague && (
          <Typography variant="h6" textAlign="center" sx={{ color: "#ccc" }}>
            {currentLeague}
          </Typography>
        )}

        {/* Puan Tablosu */}
        {currentLeague && sortedStandings.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{
              width: isMobile ? "100%" : "70%",
              backgroundColor: "#2a3b47",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1d1d1d" }}>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                      minWidth: 50,
                      width: 50,
                    }}
                  >
                    S
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      pl: isMobile ? 1 : 2,
                    }}
                  >
                    Takım
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    O
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#4CAF50",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    G
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFA726",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    B
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#EF5350",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    M
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    AG
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    YG
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    AV
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#FFD700",
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#1d1d1d",
                      borderLeft: "2px solid #444",
                    }}
                  >
                    P
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedStandings.map((team) => (
                  <TableRow
                    key={team.id || team.team}
                    sx={{
                      "&:hover": { backgroundColor: "#2c2c2c" },
                      backgroundColor:
                        team.rank <= 3
                          ? "rgba(76, 175, 80, 0.1)"
                          : team.rank >= sortedStandings.length - 2
                          ? "rgba(239, 83, 80, 0.1)"
                          : "transparent",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {team.rank}
                    </TableCell>
                    <TableCell sx={{ color: "#fff", pl: isMobile ? 1 : 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <img
                          src={
                            teamLogos[team.team] ||
                            "/logos/default.png"
                          }
                          alt={team.team}
                          style={{
                            width: 24,
                            height: 24,
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <span style={{ fontSize: isMobile ? "12px" : "14px" }}>
                          {team.team}
                        </span>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {team.played}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#4CAF50",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {team.win}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFA726",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {team.draw}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#EF5350",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {team.lose}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      {team.goalFor}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      {team.goalAgainst}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: team.goalDiff >= 0 ? "#4CAF50" : "#EF5350",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {team.goalDiff >= 0 ? "+" : ""}
                      {team.goalDiff}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#FFD700",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundColor: "#1d1d1d",
                        borderLeft: "2px solid #444",
                      }}
                    >
                      {team.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            textAlign="center"
            sx={{ color: "#999", mt: 3 }}
          >
            {currentLeague
              ? "Bu lig için puan durumu bulunamadı."
              : "Lütfen bir lig seçiniz."}
          </Typography>
        )}

        {/* Açıklama */}
        {sortedStandings.length > 0 && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#2a3b47",
              borderRadius: 2,
              width: isMobile ? "100%" : "70%",
            }}
          >
            <Typography variant="body2" sx={{ color: "#ccc", fontSize: "12px" }}>
              <strong>S:</strong> Sıra | <strong>O:</strong> Oynanan |{" "}
              <strong>G:</strong> Galibiyet | <strong>B:</strong> Beraberlik |{" "}
              <strong>M:</strong> Mağlubiyet | <strong>AG:</strong> Attığı Gol |
              <strong> YG:</strong> Yediği Gol | <strong>AV:</strong> Averaj |
              <strong> P:</strong> Puan
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#4CAF50", fontSize: "12px", mt: 1 }}
            >
              Yeşil arka plan: Şampiyonlar Ligi / Avrupa Ligi bölgesi
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#EF5350", fontSize: "12px" }}
            >
              Kırmızı arka plan: Düşme hattı
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default Standings;

