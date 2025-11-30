import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../assets/teamLogos.js";


function Goals() {
  const [selectedLeague, setSelectedLeague] = useState("SuperLig");
  const isMobile = useMediaQuery("(max-width: 900px)");
  const getBgColor = (percent) => {
    if (percent <= 20) return "#ff4d4d";      // kırmızı
    if (percent <= 40) return "#ff944d";      // turuncu
    if (percent <= 60) return "#ffd11a";      // sarı
    if (percent <= 80) return "#b3ff66";      // açık yeşil
    return "#66ff66";                         // yeşil
    };

  const { data: matches = [], isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5017/api/matches");
      return res.data;
    }
  });

  // Lig listesi
  const leagues = useMemo(() => {
    if (!matches.length) return [];
    const uniqueLeagues = [...new Set(matches.map(m => m.league))];
    return uniqueLeagues.sort();
  }, [matches]);

  // Gol hesaplamaları
  const goalStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague);
    const teamGoals = {};

    leagueMatches.forEach(match => {
      const totalGoals = match.goalHome + match.goalAway;

      // Home team
      if (!teamGoals[match.homeTeam]) {
        teamGoals[match.homeTeam] = {
          team: match.homeTeam,
          goalsFor: 0,
          goalsAgainst: 0,
          matchCount: 0,
          totalMatchGoals: 0,
          over25Count: 0,
          over35Count: 0,
          over45Count: 0
        };
      }

        teamGoals[match.homeTeam].goalsFor += match.goalHome;
        teamGoals[match.homeTeam].goalsAgainst += match.goalAway;
        teamGoals[match.homeTeam].matchCount++;
        teamGoals[match.homeTeam].totalMatchGoals += totalGoals;
        if (totalGoals > 2.5) teamGoals[match.homeTeam].over25Count++;
        if (totalGoals > 3.5) teamGoals[match.homeTeam].over35Count++;
        if (totalGoals > 4.5) teamGoals[match.homeTeam].over45Count++;

      // Away team
      if (!teamGoals[match.awayTeam]) {
        teamGoals[match.awayTeam] = {
            team: match.awayTeam,
            goalsFor: 0,
            goalsAgainst: 0,
            matchCount: 0,
            totalMatchGoals: 0,
            over25Count: 0,
            over35Count: 0,
            over45Count: 0
        };
      }

        teamGoals[match.awayTeam].goalsFor += match.goalAway;
        teamGoals[match.awayTeam].goalsAgainst += match.goalHome;
        teamGoals[match.awayTeam].matchCount++;
        teamGoals[match.awayTeam].totalMatchGoals += totalGoals;
        if (totalGoals > 2.5) teamGoals[match.awayTeam].over25Count++;
        if (totalGoals > 3.5) teamGoals[match.awayTeam].over35Count++;
        if (totalGoals > 4.5) teamGoals[match.awayTeam].over45Count++;
    });

    const stats = Object.values(teamGoals).map(team => {
        const avgGoalsFor = team.goalsFor / team.matchCount;
        const avgMatchGoals = team.totalMatchGoals / team.matchCount;
        const over25Rate = (team.over25Count / team.matchCount) * 100;
        const over35Rate = (team.over35Count / team.matchCount) * 100;
        const over45Rate = (team.over45Count / team.matchCount) * 100;

      return {
        ...team,
        avgGoalsFor,
        avgMatchGoals,
        over25Rate,
        over35Rate,
        over45Rate
      };
    });

    return stats
      .sort((a, b) => b.over25Rate - a.over25Rate)
      .map((t, i) => ({ ...t, rank: i + 1 }));

  }, [selectedLeague, matches]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} spacing={3} alignItems="center" sx={{pt: 5}}>

        {/* Lig seçimi */}
        <Box sx={{ width: { xs: '100%', md: '300px' } }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
          <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
            Gol İstatistikleri
          </Typography>

          <Autocomplete
            options={leagues}
            value={selectedLeague}
            onChange={(event, val) => setSelectedLeague(val)}
            renderInput={(params) => <TextField {...params} label="Lig Seç" />}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
              mt: 4, pl: 1.5
            }}
          />
        </Box>

        {/* Tablo */}
        {selectedLeague && goalStats.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              width: isMobile ? '100%' : '70%',              
              backgroundColor: "#b1b1b1ff"
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#afafafff" } }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }}></TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2  }} align="center">O</TableCell>
                  <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}} align="center">O </TableCell>
                  <TableCell sx={{ color: "#00ff7f", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">2.5 Üst</TableCell>
                  <TableCell sx={{ color: "#00ff7f", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">3.5 Üst</TableCell>
                  <TableCell sx={{ color: "#00ff7f", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">4.5 Üst</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {goalStats.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell sx={{ color: "#fff", fontSize: '12px', pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }}>{row.rank}</TableCell>
                    <TableCell sx={{ color: "#fff",fontSize: '12px', pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}   // icon ile yazı arasındaki boşluk
                      >
                        <img
                          src={teamLogos[row.team]}
                          alt={row.team}
                          style={{ width: 22, height: 22 }}
                        />
                        <span>{row.team}</span>
                    </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.matchCount}</TableCell>
                    <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.avgMatchGoals.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over25Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over25Rate.toFixed(1)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over35Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over35Rate.toFixed(1)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over45Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.over45Rate.toFixed(1)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Tablo */}
        {selectedLeague && goalStats.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              width: '95%',              
              backgroundColor: "#1a1a1a"
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#333" } }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: "1px", pr:"5px"}}></TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: 60 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: 60 }} align="center">Oynanan Maç</TableCell>
                  <TableCell sx={{ color: "#00eaff", fontWeight: "bold", width: 60 }} align="center">Attığı Gol Sayısı</TableCell>
                  <TableCell sx={{ color: "#ffaa00", fontWeight: "bold", width: 60 }} align="center">Yediği Gol Sayısı</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: 60 }} align="center">Toplam Gol Sayısı</TableCell>
                  <TableCell sx={{ color: "#00eaff", fontWeight: "bold", width: 60 }} align="center">Maç Başına Attığı Gol Sayısı</TableCell>
                  <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", width: 60 }} align="center">Maç Başına Toplam Gol Sayısı</TableCell>
                  <TableCell sx={{ color: "#00ff7f", fontWeight: "bold", width: 60 }} align="center">2.5 Üst Oranı</TableCell>
                  <TableCell sx={{ color: "#00ff7f", fontWeight: "bold", width: 60 }} align="center">3.5 Üst Oranı</TableCell>
                  <TableCell sx={{ color: "#00ff7f", fontWeight: "bold", width: 60 }} align="center">4.5 Üst Oranı</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {goalStats.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell sx={{ color: "#fff" }}>{row.rank}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{row.team}</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">{row.matchCount}</TableCell>
                    <TableCell sx={{ color: "#00eaff", fontWeight: "bold" }} align="center">{row.goalsFor}</TableCell>
                    <TableCell sx={{ color: "#ffaa00", fontWeight: "bold" }} align="center">{row.goalsAgainst}</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">{row.totalMatchGoals}</TableCell>
                    <TableCell sx={{ color: "#00eaff", fontWeight: "bold" }} align="center">{row.avgGoalsFor.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: "#ffaaff", fontWeight: "bold" }} align="center">{row.avgMatchGoals.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over25Rate)}}>{row.over25Rate.toFixed(1)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over35Rate)}}>{row.over35Rate.toFixed(1)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over45Rate)}}>{row.over45Rate.toFixed(1)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

      </Stack>
    </Stack>
  );
}

export default Goals;
