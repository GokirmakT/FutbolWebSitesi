import { useState, useMemo } from 'react';
import { Stack, Typography, Box, Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useData } from "../context/DataContext";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos";
import playedMatches from "/white-soccer-field.png";
import football from "/football.png";
import card from "/yellow-card.png";
import OverYellowCardsTable from '../Components/Tables/CardTables/OverYellowCardsTable';
import OverRedCardsTable from '../Components/Tables/CardTables/OverRedCardsTable';
import OverPenaltyScoreTable from '../Components/Tables/CardTables/OverPenaltyScoreTable';

function Card() {
  const { matches, isLoading, selectedLeague, setSelectedLeague, error, leagues } = useData();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const getBgColor = (percent) => {
    if (percent <= 20) return "#ff4d4d";      // kırmızı
    if (percent <= 40) return "#ff944d";      // turuncu
    if (percent <= 60) return "#ffd11a";      // sarı
    if (percent <= 80) return "#b3ff66";      // açık yeşil
    return "#66ff66";                         // yeşil
    };  

  // Seçilen lige göre kartların sıralaması
  const cardStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague && m.winner !== "TBD");
    const teamCards = {};

    leagueMatches.forEach(match => {
      const matchTotalYellowCards = match.yellowHome +  match.yellowAway;
      const matchTotalRedCards = match.redHome + match.redAway;

      const totalPenaltyScore = (match.yellowHome * 1) + (match.redHome * 2) + (match.yellowAway * 1) + (match.redAway * 2);

      
      // Home team
      if (!teamCards[match.homeTeam]) {
        teamCards[match.homeTeam] = { 
          team: match.homeTeam, 
          yellowCards: 0,
          redCards: 0,
          matchCount: 0,
          totalMatchCards: 0,

          oppYellow: 0,
          oppRed: 0,
          over25Count: 0,
          over35Count: 0,
          over45Count: 0,
          over55Count: 0,

          RedOver05Count: 0,
          RedOver15Count: 0,
          RedOver25Count: 0,

          penaltyOver25Count: 0,
          penaltyOver35Count: 0,
          penaltyOver45Count: 0,
          penaltyOver55Count: 0,

        };
      }
      teamCards[match.homeTeam].yellowCards += match.yellowHome;
      teamCards[match.homeTeam].redCards += match.redHome;
      teamCards[match.homeTeam].matchCount += 1;
      teamCards[match.homeTeam].totalMatchCards += match.yellowHome;
      teamCards[match.homeTeam].oppYellow += match.yellowAway;
      teamCards[match.homeTeam].oppRed += match.redAway;

      if (matchTotalYellowCards > 3.5) teamCards[match.homeTeam].over35Count++;
      if (matchTotalYellowCards > 4.5) teamCards[match.homeTeam].over45Count++;
      if (matchTotalYellowCards > 5.5) teamCards[match.homeTeam].over55Count++;
      if (matchTotalYellowCards > 2.5) teamCards[match.homeTeam].over25Count++;

      if (matchTotalRedCards > 0.5) teamCards[match.homeTeam].RedOver05Count++;
      if (matchTotalRedCards > 1.5) teamCards[match.homeTeam].RedOver15Count++;
      if (matchTotalRedCards > 2.5) teamCards[match.homeTeam].RedOver25Count++;

      if (totalPenaltyScore > 3.5) teamCards[match.homeTeam].penaltyOver35Count++;
      if (totalPenaltyScore > 4.5) teamCards[match.homeTeam].penaltyOver45Count++;
      if (totalPenaltyScore > 5.5) teamCards[match.homeTeam].penaltyOver55Count++;
      if (totalPenaltyScore > 2.5) teamCards[match.homeTeam].penaltyOver25Count++;

      // Away team
      if (!teamCards[match.awayTeam]) {
        teamCards[match.awayTeam] = { 
          team: match.awayTeam, 
          yellowCards: 0,
          redCards: 0,
          matchCount: 0,
          totalMatchCards: 0,

          oppYellow: 0,
          oppRed: 0,
          over25Count: 0,
          over35Count: 0,
          over45Count: 0,
          over55Count: 0,

          RedOver05Count: 0,
          RedOver15Count: 0,
          RedOver25Count: 0,

          penaltyOver25Count: 0,
          penaltyOver35Count: 0,
          penaltyOver45Count: 0,
          penaltyOver55Count: 0,

        };
      }
      teamCards[match.awayTeam].yellowCards += match.yellowAway;
      teamCards[match.awayTeam].redCards += match.redAway;
      teamCards[match.awayTeam].matchCount += 1;
      teamCards[match.awayTeam].totalMatchCards += match.yellowAway;
      teamCards[match.awayTeam].oppYellow += match.yellowHome;
      teamCards[match.awayTeam].oppRed += match.redHome;

      if (matchTotalYellowCards > 3.5) teamCards[match.awayTeam].over35Count++;
      if (matchTotalYellowCards > 4.5) teamCards[match.awayTeam].over45Count++;
      if (matchTotalYellowCards > 5.5) teamCards[match.awayTeam].over55Count++;
      if (matchTotalYellowCards > 2.5) teamCards[match.awayTeam].over25Count++;

      if (matchTotalRedCards > 0.5) teamCards[match.awayTeam].RedOver05Count++;
      if (matchTotalRedCards > 1.5) teamCards[match.awayTeam].RedOver15Count++;
      if (matchTotalRedCards > 2.5) teamCards[match.awayTeam].RedOver25Count++;

      if (totalPenaltyScore > 3.5) teamCards[match.awayTeam].penaltyOver35Count++;
      if (totalPenaltyScore > 4.5) teamCards[match.awayTeam].penaltyOver45Count++;
      if (totalPenaltyScore > 5.5) teamCards[match.awayTeam].penaltyOver55Count++;
      if (totalPenaltyScore > 2.5) teamCards[match.awayTeam].penaltyOver25Count++;

    });

    // Kart puanı hesapla
    const statsWithScore = Object.values(teamCards).map(team => {

      const totalCardCount = team.yellowCards + team.redCards + team.oppYellow + team.oppRed;
      const avgCardCount = totalCardCount / team.matchCount;

      const totalRedCards = team.redCards;

      const avgMatchCards = team.totalMatchCards / team.matchCount;
      const ownPenalty = (team.yellowCards * 1) + (team.redCards * 2);
      const oppPenalty = (team.oppYellow * 1) + (team.oppRed * 2);
      console.log(teamCards);

      return {
        ...team,
        cardScore: ownPenalty,
        avgCardScore: ownPenalty / team.matchCount,
        totalCardCount,
        avgCardCount,
        avgMatchCards,
        ownPenalty,
        oppPenalty,
        totalRedCards,

        over25Rate: (team.over25Count / team.matchCount) * 100,        
        over35Rate: (team.over35Count / team.matchCount) * 100,        
        over45Rate: (team.over45Count / team.matchCount) * 100,        
        over55Rate: (team.over55Count / team.matchCount) * 100,

        RedOver05Rate: (team.RedOver05Count / team.matchCount) * 100,
        RedOver15Rate: (team.RedOver15Count / team.matchCount) * 100,
        RedOver25Rate: (team.RedOver25Count / team.matchCount) * 100,

        penaltyOver25Rate: (team.penaltyOver25Count / team.matchCount) * 100,
        penaltyOver35Rate: (team.penaltyOver35Count / team.matchCount) * 100,
        penaltyOver45Rate: (team.penaltyOver45Count / team.matchCount) * 100,
        penaltyOver55Rate: (team.penaltyOver55Count / team.matchCount) * 100,
      };
    });

    // Ortalama kart puanına göre sırala
    return statsWithScore
      .sort((a, b) => b.over25Rate - a.over25Rate)
      .map((team, idx) => ({ ...team, rank: idx + 1 }));
  }, [selectedLeague, matches]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#2a3b47"}} spacing={3}>
      <Stack direction={'column'} alignItems="center" sx={{pt: 5}}>        
        {/* Lig Seçimi */}
        <Box sx={{ width: { xs: '100%', md: '300px' } }} justifyContent="center" alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Typography textAlign="center" variant="h5" sx={{ color: "#fff", fontWeight: "bold"}}>
                Takım Kart Sıralaması
            </Typography>
          <Autocomplete
            options={leagues}
            value={selectedLeague}
            onChange={(event, newValue) => setSelectedLeague(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Lig Seç" placeholder="Bir lig seçin..." />
            )}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff"
              }, mt: 4, pl: 1.5, pr: 1.5
            }}
          />
        </Box>

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçların Çıkan Sarı Kart Üst Yüzdeleri
          </Typography>
        </Stack> 

        {/* Tablo */}
        <OverYellowCardsTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
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
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçların Çıkan Kırmızı Kart Üst Yüzdeleri
          </Typography>
        </Stack>      

        <OverRedCardsTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
        
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
                <img src={card} style={{ width: isMobile ? 20 : 20, height: isMobile ? 20 : 20, filter: "invert(1)"}} />
                <Typography sx={{ color: "#fff", fontSize: isMobile ? "11px" : "14px", fontWeight: "bold" }}>
                  : Gördüğü Toplam Kırmızı Kart Sayısı
                </Typography>
              </Stack>              
            </Stack> 
            
            )}

        <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
          <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold"}}>
              {selectedLeague} – Takımlarının Maçlarda Kart Ceza Skorları Üst Yüzdeleri
          </Typography>
        </Stack>      

        <OverPenaltyScoreTable cardStats={cardStats} selectedLeague={selectedLeague} isMobile={isMobile} teamLogos={teamLogos} card={card} playedMatches={playedMatches} getBgColor={getBgColor}/>        
                  

      </Stack>

      {selectedLeague && cardStats.length === 0 && (
        <Typography sx={{ color: "#fff", mt: 3 }}>
          Bu ligde veri bulunmamaktadır.
        </Typography>
      )}
    </Stack>
  );
}

export default Card;
