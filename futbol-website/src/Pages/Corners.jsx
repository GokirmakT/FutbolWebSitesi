import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos";
import playedMatches from "/white-soccer-field.png";
import football from "/football.png";
import corner from "/corner.png";

import OverCornersTable from "../Components/Tables/CornerTables/OverCornersTable";
import OverHomeCornersTable from "../Components/Tables/CornerTables/OverHomeCornersTable";
import OverHomeCornersTable2 from "../Components/Tables/CornerTables/OverHomeCornersTable2";

function Corner() {
  const { matches, isLoading, selectedLeague, setSelectedLeague, error, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");

  const getBgColor = (percent) => {
    if (percent <= 20) return "#ff4d4d";      // kırmızı
    if (percent <= 40) return "#ff944d";      // turuncu
    if (percent <= 60) return "#ffd11a";      // sarı
    if (percent <= 80) return "#b3ff66";      // açık yeşil
    return "#66ff66";                         // yeşil
    };  

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
            homeMatchCount: 0,
            awayMatchCount: 0,
            matchCount: 0,
            totalMatchCorners: 0,
            over75Count: 0,
            over85Count: 0,
            over95Count: 0,
            over105Count: 0,

            homeOver35Count: 0,
            awayOver35Count: 0,

            homeOver45Count: 0,
            awayOver45Count: 0,

            homeOver55Count: 0,
            awayOver55Count: 0,

            homeOver65Count: 0,
            awayOver65Count: 0,

            homeOver75Count: 0,
            awayOver75Count: 0,

            homeOver85Count: 0,
            awayOver85Count: 0
        };
      }

        teamCorners[match.homeTeam].cornersFor += match.cornerHome;
        teamCorners[match.homeTeam].cornersAgainst += match.cornerAway;
        teamCorners[match.homeTeam].homeMatchCount++;
        teamCorners[match.homeTeam].matchCount++;
        teamCorners[match.homeTeam].totalMatchCorners += matchCorners;
        if (matchCorners > 7.5) teamCorners[match.homeTeam].over75Count++;
        if (matchCorners > 8.5) teamCorners[match.homeTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.homeTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.homeTeam].over105Count++;

        if (match.cornerHome > 3.5) teamCorners[match.homeTeam].homeOver35Count++;
        if (match.cornerHome > 4.5) teamCorners[match.homeTeam].homeOver45Count++;
        if (match.cornerHome > 5.5) teamCorners[match.homeTeam].homeOver55Count++;
        if (match.cornerHome > 6.5) teamCorners[match.homeTeam].homeOver65Count++;
        if (match.cornerHome > 7.5) teamCorners[match.homeTeam].homeOver75Count++;
        if (match.cornerHome > 8.5) teamCorners[match.homeTeam].homeOver85Count++;


      // Away team
      if (!teamCorners[match.awayTeam]) {
        teamCorners[match.awayTeam] = {
            team: match.awayTeam,
            cornersFor: 0,
            cornersAgainst: 0,
            homeMatchCount: 0,
            awayMatchCount: 0,
            matchCount: 0,
            totalMatchCorners: 0,
            over75Count: 0,
            over85Count: 0,
            over95Count: 0,
            over105Count: 0,

            homeOver35Count: 0,
            awayOver35Count: 0,

            homeOver45Count: 0,
            awayOver45Count: 0,

            homeOver55Count: 0,
            awayOver55Count: 0,

            homeOver65Count: 0,
            awayOver65Count: 0,

            homeOver75Count: 0,
            awayOver75Count: 0,

            homeOver85Count: 0,
            awayOver85Count: 0
            
        };
      }

        teamCorners[match.awayTeam].cornersFor += match.cornerHome;
        teamCorners[match.awayTeam].cornersAgainst += match.cornerAway;
        teamCorners[match.awayTeam].awayMatchCount++;
        teamCorners[match.awayTeam].matchCount++;
        teamCorners[match.awayTeam].totalMatchCorners += matchCorners;
        if (matchCorners > 7.5) teamCorners[match.awayTeam].over75Count++;
        if (matchCorners > 8.5) teamCorners[match.awayTeam].over85Count++;
        if (matchCorners > 9.5) teamCorners[match.awayTeam].over95Count++;
        if (matchCorners > 10.5) teamCorners[match.awayTeam].over105Count++;  
        
        if (match.cornerAway > 3.5) teamCorners[match.awayTeam].awayOver35Count++;
        if (match.cornerAway > 4.5) teamCorners[match.awayTeam].awayOver45Count++;
        if (match.cornerAway > 5.5) teamCorners[match.awayTeam].awayOver55Count++;
        if (match.cornerAway > 6.5) teamCorners[match.awayTeam].awayOver65Count++;
        if (match.cornerAway > 7.5) teamCorners[match.awayTeam].awayOver75Count++;
        if (match.cornerAway > 8.5) teamCorners[match.awayTeam].awayOver85Count++;

    });

    const stats = Object.values(teamCorners).map(team => {
      const cornersUsed = team.cornersFor;
      const cornersAgainst = team.cornersAgainst;
      const avgTeamCorners = team.cornersFor / team.matchCount;
      const avgMatchCorners = team.totalMatchCorners / team.matchCount;

      const over75Rate = (team.over75Count / team.matchCount) * 100;
      const over85Rate = (team.over85Count / team.matchCount) * 100;
      const over95Rate = (team.over95Count / team.matchCount) * 100;
      const over105Rate = (team.over105Count / team.matchCount) * 100;

      const team35Rate = ((team.homeOver35Count + team.awayOver35Count) / team.matchCount) * 100;     
      const team45Rate = ((team.homeOver45Count + team.awayOver45Count) / team.matchCount) * 100;
      const team55Rate = ((team.homeOver55Count + team.awayOver55Count) / team.matchCount) * 100; 
      const team65Rate = ((team.homeOver65Count + team.awayOver65Count) / team.matchCount) * 100;
      const team75Rate = ((team.homeOver75Count + team.awayOver75Count) / team.matchCount) * 100;
      const team85Rate = ((team.homeOver85Count + team.awayOver85Count) / team.matchCount) * 100;  
      
      const avgCornersUsed = (cornersUsed / team.matchCount).toFixed(2);

      console.log(team);

      return {
        ...team,
        avgTeamCorners,
        avgMatchCorners,
        cornersUsed,
        cornersAgainst,

        over75Rate,
        over85Rate,
        over95Rate,
        over105Rate, 

        team35Rate,
        team45Rate,
        team55Rate,
        team65Rate,
        team75Rate,
        team85Rate,
        
        avgCornersUsed
      };
    });

    return stats
      .sort((a, b) => b.over85Rate - a.over85Rate)
      .map((t, i) => ({ ...t, rank: i + 1 }));

  }, [selectedLeague, matches]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>

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
              mt: 4, pl: 1.5, pr: 1.5
            }}
          />
        </Box>

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
              {selectedLeague} – Takımların Maç Başına Korner (Üst) İstatistikleri
          </Typography>
        </Stack> 

        <OverCornersTable cornerStats={cornerStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>    

        {/* Tablo Altı İkon + Yazı */}
        {selectedLeague && (
          <Stack
              direction="row"
              alignItems="center" 
              justifyContent= {isMobile ? "flex-start" : "center"}
              spacing={3}
              sx={{             
                backgroundColor: "#1d1d1d",
                padding: "10px 0",              
                width: isMobile ? '100%' : '70%'             
              }}>
                
              {/* 1. ikon + yazı */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <img src={playedMatches} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} />
                <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                  : Oynanan Maç Sayısı
                </Typography>
              </Stack>              
            </Stack> 
            
            )}    

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
              {selectedLeague} – Takımların Maç Başına Korner (Üst) İstatistikleri
          </Typography>
        </Stack> 
        
        <OverHomeCornersTable cornerStats={cornerStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} corner={corner} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        {/* Tablo Altı İkon + Yazı */}
        {selectedLeague && (
          <Stack
              direction="row"
              alignItems="center" 
              justifyContent= {isMobile ? "flex-start" : "center"}
              spacing={3}
              sx={{             
                backgroundColor: "#1d1d1d",
                padding: "10px 0",              
                width: isMobile ? '100%' : '70%'             
              }}>
                
              {/* 1. ikon + yazı */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <img src={corner} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} />
                <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                  : Ortalama Kullandığı Korner Sayısı
                </Typography>
              </Stack>              
            </Stack> 
            
            )}    

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
              {selectedLeague} – Takımların Maç Başına Korner (Üst) İstatistikleri
          </Typography>
        </Stack>     

        <OverHomeCornersTable2 cornerStats={cornerStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} corner={corner} playedMatches={playedMatches} getBgColor={getBgColor}/>        
      </Stack>
    </Stack>
  );
}

export default Corner;
