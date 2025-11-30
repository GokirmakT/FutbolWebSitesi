import { useState, useMemo } from 'react';
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Corner() {
  const [selectedLeague, setSelectedLeague] = useState("SuperLig");

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

  // Hesaplama
  const cornerStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague);
    const teamCorners = {};

    leagueMatches.forEach(match => {
      const matchCorners = match.cornerHome + match.cornerAway;

      // Home team
      if (!teamCorners[match.homeTeam]) {
        teamCorners[match.homeTeam] = {
            team: match.homeTeam,
            cornersFor: 0,
            cornersAgainst: 0,
            matchCount: 0,
            totalMatchCorners: 0,
            over85Count: 0,
            over95Count: 0,
            over105Count: 0
        };
      }

        teamCorners[match.homeTeam].cornersFor += match.cornerHome;
        teamCorners[match.homeTeam].cornersAgainst += match.cornerAway;
        teamCorners[match.homeTeam].matchCount++;
        teamCorners[match.homeTeam].totalMatchCorners += matchCorners;
        if (matchCorners > 8.5) teamCorners[match.homeTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.homeTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.homeTeam].over105Count++;


      // Away team
      if (!teamCorners[match.awayTeam]) {
        teamCorners[match.awayTeam] = {
            team: match.awayTeam,
            cornersFor: 0,
            cornersAgainst: 0,
            matchCount: 0,
            totalMatchCorners: 0,
            over85Count: 0,
            over95Count: 0,
            over105Count: 0
        };
      }

        teamCorners[match.awayTeam].cornersFor += match.cornerHome;
        teamCorners[match.awayTeam].cornersAgainst += match.cornerAway;
        teamCorners[match.awayTeam].matchCount++;
        teamCorners[match.awayTeam].totalMatchCorners += matchCorners;
        if (matchCorners > 8.5) teamCorners[match.awayTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.awayTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.awayTeam].over105Count++;
    });

    const stats = Object.values(teamCorners).map(team => {
      const avgTeamCorners = team.cornersFor / team.matchCount;
      const avgMatchCorners = team.totalMatchCorners / team.matchCount;
      const over85Rate = (team.over85Count / team.matchCount) * 100;
      const over95Rate = (team.over95Count / team.matchCount) * 100;
      const over105Rate = (team.over105Count / team.matchCount) * 100;

      return {
        ...team,
        avgTeamCorners,
        avgMatchCorners,
        over85Rate,
        over95Rate,
        over105Rate
      };
    });

    return stats
      .sort((a, b) => b.over85Rate - a.over85Rate)
      .map((t, i) => ({ ...t, rank: i + 1 }));

  }, [selectedLeague, matches]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#b48181ff"}} spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start" sx={{pt: 5}}>

        {/* Lig Seçimi */}
        <Box sx={{ width: { xs: '100%', md: '300px' } }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
            Korner İstatistikleri
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
        {selectedLeague && cornerStats.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              backgroundColor: "#1a1a1a"
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#333" } }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: "1px", pr:"5px"}}></TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Maç</TableCell>
                  <TableCell sx={{ color: "#00eaff", fontWeight: "bold" }} align="center">Kullandığı Korner Sayısı</TableCell>
                  <TableCell sx={{ color: "#ffaa00", fontWeight: "bold" }} align="center">Rakibin Korner Sayısı</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">Toplam Korner Sayısı</TableCell>
                  <TableCell sx={{ color: "#00eaff", fontWeight: "bold" }} align="center">Maç Başı Kullandığı Korner</TableCell>
                  <TableCell sx={{ color: "#ffaaff", fontWeight: "bold" }} align="center">Maç Başı Toplam Korner</TableCell>
                  <TableCell sx={{ color: "#ffffffff", fontWeight: "bold" }} align="center">8.5 Üst Oranı</TableCell>
                  <TableCell sx={{ color: "#ffffffff", fontWeight: "bold" }} align="center">9.5 Üst Oranı</TableCell>
                  <TableCell sx={{ color: "#ffffffff", fontWeight: "bold" }} align="center">10.5 Üst Oranı</TableCell>

                </TableRow>
              </TableHead>

              <TableBody>
                {cornerStats.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell sx={{ color: "#fff" }}>{row.rank}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{row.team}</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">{row.matchCount}</TableCell>
                    <TableCell sx={{ color: "#00eaff", fontWeight: "bold" }} align="center">{row.cornersFor}</TableCell>
                    <TableCell sx={{ color: "#ffaa00", fontWeight: "bold" }} align="center">{row.cornersAgainst}</TableCell>
                    <TableCell sx={{ color: "#fff", fontWeight: "bold" }} align="center">{row.totalMatchCorners}</TableCell>
                    <TableCell sx={{ color: "#00eaff", fontWeight: "bold" }} align="center">{row.avgTeamCorners.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: "#ffaaff", fontWeight: "bold" }} align="center">{row.avgMatchCorners.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over85Rate)}}>{row.over85Rate.toFixed(1)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over95Rate)}}>{row.over95Rate.toFixed(1)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over105Rate)}}>{row.over105Rate.toFixed(1)}%</TableCell>

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

export default Corner;
