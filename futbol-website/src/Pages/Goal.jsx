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
import OverGoalsTable from "../Components/Tables/GoalTables/OverGoalsTable";
import OverGoals15HomeAway from "../Components/Tables/GoalTables/OverGoals15HomeAwayTable";
import OverGoals25HomeAway from "../Components/Tables/GoalTables/OverGoals25HomeAwayTable";
import OverGoals35HomeAway from "../Components/Tables/GoalTables/OverGoals35HomeAwayTable";
import OverGoals45HomeAway from "../Components/Tables/GoalTables/OverGoals45HomeAwayTable";

import LessGoalsTable from "../Components/Tables/GoalTables/LessGoalsTable";
import LessGoals15HomeAway from "../Components/Tables/GoalTables/LessGoals15HomeAwayTable";
import LessGoals25HomeAway from "../Components/Tables/GoalTables/LessGoals25HomeAwayTable";
import LessGoals35HomeAway from "../Components/Tables/GoalTables/LessGoals35HomeAwayTable";
import LessGoals45HomeAway from "../Components/Tables/GoalTables/LessGoals45HomeAwayTable";

import KgGoalsTable from "../Components/Tables/GoalTables/KgGoalsTable";

function Goals() {
  const { matches, isLoading, selectedLeague, setSelectedLeague, error, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [statType, setStatType] = useState("over"); // "over" veya "under"

  const getBgColor = (percent) => {
    if (percent <= 20) return "#ff4d4d";      // kırmızı
    if (percent <= 40) return "#ff944d";      // turuncu
    if (percent <= 60) return "#ffd11a";      // sarı
    if (percent <= 80) return "#b3ff66";      // açık yeşil
    return "#66ff66";                         // yeşil
    };

  // Gol hesaplamaları
  const goalStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague && m.winner !== "TBD");
    const teamGoals = {};

    leagueMatches.forEach(match => {
      const totalGoals = match.goalHome + match.goalAway;

      // Home team
      if (!teamGoals[match.homeTeam]) {
        teamGoals[match.homeTeam] = {
          team: match.homeTeam,
          goalsFor: 0,
          goalsAgainst: 0,
          homeMatchCount: 0,
          awayMatchCount: 0,         
          matchCount: 0,
          totalMatchGoals: 0,

          bts: 0,
          homeBts: 0,
          awayBts: 0,

          over25Count: 0,
          homeOver25Count: 0,
          awayOver25Count: 0,         

          over35Count: 0,
          homeOver35Count: 0,
          awayOver35Count: 0,

          over45Count: 0,
          homeOver45Count: 0,
          awayOver45Count: 0,

          over15Count: 0,
          homeOver15Count: 0,
          awayOver15Count: 0,

          less25Count: 0,
          homeLess25Count: 0,
          awayLess25Count: 0,         

          less35Count: 0,
          homeLess35Count: 0,
          awayLess35Count: 0,

          less45Count: 0,
          homeLess45Count: 0,
          awayLess45Count: 0,

          less15Count: 0,
          homeLess15Count: 0,
          awayLess15Count: 0
        };
      }

        teamGoals[match.homeTeam].goalsFor += match.goalHome;
        teamGoals[match.homeTeam].goalsAgainst += match.goalAway;
        teamGoals[match.homeTeam].homeMatchCount++;
        teamGoals[match.homeTeam].matchCount++;
        teamGoals[match.homeTeam].totalMatchGoals += totalGoals;

        if (match.goalHome > 0 && match.goalAway > 0) {
          teamGoals[match.homeTeam].bts++;
          teamGoals[match.homeTeam].homeBts++;
        }

        if (totalGoals > 2.5) teamGoals[match.homeTeam].over25Count++;
        if (totalGoals > 2.5) teamGoals[match.homeTeam].homeOver25Count++;   

        if (totalGoals > 3.5) teamGoals[match.homeTeam].over35Count++;
        if (totalGoals > 3.5) teamGoals[match.homeTeam].homeOver35Count++;
       
        if (totalGoals > 4.5) teamGoals[match.homeTeam].over45Count++;
        if (totalGoals > 4.5) teamGoals[match.homeTeam].homeOver45Count++;

        if (totalGoals > 1.5) teamGoals[match.homeTeam].over15Count++;
        if (totalGoals > 1.5) teamGoals[match.homeTeam].homeOver15Count++;
        
        if (totalGoals < 2.5) teamGoals[match.homeTeam].less25Count++;
        if (totalGoals < 2.5) teamGoals[match.homeTeam].homeLess25Count++;   

        if (totalGoals < 3.5) teamGoals[match.homeTeam].less35Count++;
        if (totalGoals < 3.5) teamGoals[match.homeTeam].homeLess35Count++;
       
        if (totalGoals < 4.5) teamGoals[match.homeTeam].less45Count++;
        if (totalGoals < 4.5) teamGoals[match.homeTeam].homeLess45Count++;

        if (totalGoals < 1.5) teamGoals[match.homeTeam].less15Count++;
        if (totalGoals < 1.5) teamGoals[match.homeTeam].homeLess15Count++;

      // Away team
      if (!teamGoals[match.awayTeam]) {
        teamGoals[match.awayTeam] = {
            team: match.awayTeam,
            goalsFor: 0,
            goalsAgainst: 0,
            homeMatchCount: 0,
            awayMatchCount: 0,
            matchCount: 0,
            totalMatchGoals: 0,

            bts: 0,
            homeBts: 0,
            awayBts: 0,

            over25Count: 0,
            homeOver25Count: 0,
            awayOver25Count: 0,

            over35Count: 0,
            homeOver35Count: 0,
            awayOver35Count: 0,

            over45Count: 0,
            homeOver45Count: 0,
            awayOver45Count: 0,

            over15Count: 0,
            homeOver15Count: 0,
            awayOver15Count: 0,

            less25Count: 0,
            homeLess25Count: 0,
            awayLess25Count: 0,         

            less35Count: 0,
            homeLess35Count: 0,
            awayLess35Count: 0,

            less45Count: 0,
            homeLess45Count: 0,
            awayLess45Count: 0,

            less15Count: 0,
            homeLess15Count: 0,
            awayLess15Count: 0

        };
      }

        teamGoals[match.awayTeam].goalsFor += match.goalAway;
        teamGoals[match.awayTeam].goalsAgainst += match.goalHome;
        teamGoals[match.awayTeam].awayMatchCount++;
        teamGoals[match.awayTeam].matchCount++;
        teamGoals[match.awayTeam].totalMatchGoals += totalGoals;

        if (match.goalHome > 0 && match.goalAway > 0) {
          teamGoals[match.awayTeam].bts++;
          teamGoals[match.awayTeam].awayBts++;
        }

        if (totalGoals > 2.5) teamGoals[match.awayTeam].over25Count++;
        if (totalGoals > 2.5) teamGoals[match.awayTeam].awayOver25Count++;

        if (totalGoals > 3.5) teamGoals[match.awayTeam].over35Count++;
        if (totalGoals > 3.5) teamGoals[match.awayTeam].awayOver35Count++;

        if (totalGoals > 4.5) teamGoals[match.awayTeam].over45Count++;
        if (totalGoals > 4.5) teamGoals[match.awayTeam].awayOver45Count++;

        if (totalGoals > 1.5) teamGoals[match.awayTeam].over15Count++;
        if (totalGoals > 1.5) teamGoals[match.awayTeam].awayOver15Count++;

        if (totalGoals < 2.5) teamGoals[match.awayTeam].less25Count++;
        if (totalGoals < 2.5) teamGoals[match.awayTeam].awayLess25Count++;   

        if (totalGoals < 3.5) teamGoals[match.awayTeam].less35Count++;
        if (totalGoals < 3.5) teamGoals[match.awayTeam].awayLess35Count++;
       
        if (totalGoals < 4.5) teamGoals[match.awayTeam].less45Count++;
        if (totalGoals < 4.5) teamGoals[match.awayTeam].awayLess45Count++;

        if (totalGoals < 1.5) teamGoals[match.awayTeam].less15Count++;
        if (totalGoals < 1.5) teamGoals[match.awayTeam].awayLess15Count++;
    });

    const stats = Object.values(teamGoals).map(team => {
        const avgGoalsFor = team.goalsFor / team.matchCount;
        const avgMatchGoals = team.totalMatchGoals / team.matchCount;

        const btsRate = (team.bts / team.matchCount) * 100;
        const homeBtsRate = (team.homeBts / team.homeMatchCount) * 100;
        const awayBtsRate = (team.awayBts / team.awayMatchCount) * 100;

        const over25Rate = (team.over25Count / team.matchCount) * 100;
        const over35Rate = (team.over35Count / team.matchCount) * 100;
        const over45Rate = (team.over45Count / team.matchCount) * 100;
        const over15Rate = (team.over15Count / team.matchCount) * 100;

        const less25Rate = (team.less25Count / team.matchCount) * 100;
        const less35Rate = (team.less35Count / team.matchCount) * 100;
        const less45Rate = (team.less45Count / team.matchCount) * 100;
        const less15Rate = (team.less15Count / team.matchCount) * 100;

        const homeOver25Rate = (team.homeOver25Count / team.homeMatchCount) * 100;
        const awayOver25Rate = (team.awayOver25Count / team.awayMatchCount) * 100;

        const homeOver35Rate = (team.homeOver35Count / team.homeMatchCount) * 100;
        const awayOver35Rate = (team.awayOver35Count / team.awayMatchCount) * 100;

        const homeOver45Rate = (team.homeOver45Count / team.homeMatchCount) * 100;
        const awayOver45Rate = (team.awayOver45Count / team.awayMatchCount) * 100;

        const homeOver15Rate = (team.homeOver15Count / team.homeMatchCount) * 100;
        const awayOver15Rate = (team.awayOver15Count / team.awayMatchCount) * 100;

        const homeLess25Rate = (team.homeLess25Count / team.homeMatchCount) * 100;
        const awayLess25Rate = (team.awayLess25Count / team.awayMatchCount) * 100;

        const homeLess35Rate = (team.homeLess35Count / team.homeMatchCount) * 100;
        const awayLess35Rate = (team.awayLess35Count / team.awayMatchCount) * 100;

        const homeLess45Rate = (team.homeLess45Count / team.homeMatchCount) * 100;
        const awayLess45Rate = (team.awayLess45Count / team.awayMatchCount) * 100;

        const homeLess15Rate = (team.homeLess15Count / team.homeMatchCount) * 100;
        const awayLess15Rate = (team.awayLess15Count / team.awayMatchCount) * 100;

        console.log(team);

      return {        
        ...team,
        avgGoalsFor,
        avgMatchGoals,

        btsRate,
        homeBtsRate,
        awayBtsRate,

        over25Rate,
        over35Rate,
        over45Rate,   
        over15Rate,        
        
        homeOver25Rate,
        awayOver25Rate,
        homeOver35Rate,
        awayOver35Rate,
        homeOver45Rate,
        awayOver45Rate,
        homeOver15Rate,
        awayOver15Rate,

        less25Rate,
        less35Rate,
        less45Rate,   
        less15Rate,        
        
        homeLess25Rate,
        awayLess25Rate,
        homeLess35Rate,
        awayLess35Rate,
        homeLess45Rate,
        awayLess45Rate,
        homeLess15Rate,
        awayLess15Rate
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
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>

        {/* Lig seçimi */}
        <Box sx={{ width: '70%' }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
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
              mt: 4, pl: 1.5, pr: 1.5
            }}
          />

          {/* --- BUTONLAR BURADA --- */}
          <Box 
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              width: "100%",
              justifyContent: "center"
            }}
          >
            {/* Gol Üst */}
            <Button
              variant="contained"
              onClick={() => setStatType("over")}
              sx={{
                backgroundColor: statType === "over" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "over" ? "#ffa726" : "#555"
                }
              }}
            >
              Gol Üst İstatistikleri
            </Button>

            {/* Gol Alt */}
            <Button
              variant="contained"
              onClick={() => setStatType("under")}
              sx={{
                backgroundColor: statType === "under" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "under" ? "#ffa726" : "#555"
                }
              }}
            >
              Gol Alt İstatistikleri
            </Button>

            <Button
              variant="contained"
              onClick={() => setStatType("kg")}
              sx={{
                backgroundColor: statType === "kg" ? "#ff9800" : "#444",
                color: "#fff",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "16px",
                px: 2,
                "&:hover": {
                  backgroundColor: statType === "kg" ? "#ffa726" : "#555"
                }
              }}
            >
              KG İstatistikleri
            </Button>
          </Box>
        </Box>

        {statType === "kg" ? (
          <KgGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        ) : (

          <>

            <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
            <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
                {selectedLeague} – Takımlarının Gol Eğilimleri {statType === "over" ? "Üst" : "Alt"} İstatistikleri Ve Maç Başına Gol Ortalamaları
            </Typography>
          </Stack> 

          {statType === "over" ? (
            <OverGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoalsTable goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}

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

                {/* 2. ikon + yazı */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <img src={football} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20 }} />
                  <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                    : Maç Başına Gol Ortalaması
                  </Typography>
                </Stack>
              </Stack> 
              
              )}


        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%'}}>
        
            <Typography
              variant="body1"
              sx={{
                color: "#ddd",
                fontSize: "14px",
                lineHeight: 1.6,
                mt: 2              
              }}
            >
              Bu tablo, ligdeki takımların maçlarında ortaya çıkan gol eğilimlerini detaylı şekilde gösterir. 
              Her takım için toplam maç sayısı, maç başına çıkan ortalama gol miktarı ve maçlarının hangi sıklıkla 
              2.5, 3.5 ve 4.5 üst bittiği yüzdesel olarak sunulmuştur. Böylece bir takımın maçlarının genel olarak 
              gollü mü yoksa düşük skorlu mu geçtiğini kolayca görebilirsiniz.<br/><br/>

              Tablo, hangi takımların gol açısından daha istikrarlı veya riskli olduğunu tek 
              bakışta anlamanıza yardımcı olur. Bu tablo, gol analizleri, tahmin çalışmaları veya maç eğilimlerini 
              anlamak için sade ve güçlü bir özet sunar.
            </Typography>

        </Stack>
      

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 2.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>     

        {/* Takımların Maç Başına Gol 2.5 Üst İstatistikleri */}
        {statType === "over" ? (
            <OverGoals25HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals25HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}
        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 1.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>     

        {/* Takımların Maç Başına Gol 2.5 Üst İstatistikleri */}
        {statType === "over" ? (
            <OverGoals15HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals15HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}
        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 3.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>

        {statType === "over" ? (
            <OverGoals35HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals35HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}
        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
            {selectedLeague} – Takımların Maç Başına 4.5 {statType === "over" ? "Üst" : "Alt"} Gol İstatistikleri (Ev/Deplasman)
          </Typography>
        </Stack>

        {statType === "over" ? (
            <OverGoals45HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>        
          ) : (
            <LessGoals45HomeAway goalStats={goalStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} football={football} playedMatches={playedMatches} getBgColor={getBgColor}/>
          )}          
          
          </>         
        )}
      </Stack>
    </Stack>
  );
}

export default Goals;
