import { useState, useMemo } from 'react';
import { Stack, Typography, Box, Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";



function Card() {
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

  // Liglerin listesi
  const leagues = useMemo(() => {
    if (!matches.length) return [];
    const uniqueLeagues = [...new Set(matches.map(m => m.league))];
    return uniqueLeagues.sort();
  }, [matches]);

  // Seçilen lige göre kartların sıralaması
  const cardStats = useMemo(() => {
    if (!selectedLeague || !matches.length) return [];

    const leagueMatches = matches.filter(m => m.league === selectedLeague);
    const teamCards = {};

    leagueMatches.forEach(match => {
      const matchTotalCards = match.yellowHome + match.redHome + match.yellowAway + match.redAway;

      const isOver35 = match.yellowHome + (match.redHome * 2) + match.yellowAway + (match.redAway * 2) > 3.5;
      const isOver45 = match.yellowHome + (match.redHome * 2) + match.yellowAway + (match.redAway * 2) > 4.5;

      // Home team
      if (!teamCards[match.homeTeam]) {
        teamCards[match.homeTeam] = { 
          team: match.homeTeam, 
          yellowCards: 0, redCards: 0, matchCount: 0, totalMatchCards: 0,
          oppYellow: 0, oppRed: 0, over35Count: 0, over45Count: 0
        };
      }
      teamCards[match.homeTeam].yellowCards += match.yellowHome;
      teamCards[match.homeTeam].redCards += match.redHome;
      teamCards[match.homeTeam].matchCount += 1;
      teamCards[match.homeTeam].totalMatchCards += matchTotalCards;
      teamCards[match.homeTeam].oppYellow += match.yellowAway;
      teamCards[match.homeTeam].oppRed += match.redAway;

      if (isOver35) teamCards[match.homeTeam].over35Count++;
      if (isOver45) teamCards[match.homeTeam].over45Count++;

      // Away team
      if (!teamCards[match.awayTeam]) {
        teamCards[match.awayTeam] = { 
          team: match.awayTeam, 
          yellowCards: 0, redCards: 0, matchCount: 0, totalMatchCards: 0,
          oppYellow: 0, oppRed: 0, over35Count: 0, over45Count: 0
        };
      }
      teamCards[match.awayTeam].yellowCards += match.yellowAway;
      teamCards[match.awayTeam].redCards += match.redAway;
      teamCards[match.awayTeam].matchCount += 1;
      teamCards[match.awayTeam].totalMatchCards += matchTotalCards;
      teamCards[match.awayTeam].oppYellow += match.yellowHome;
      teamCards[match.awayTeam].oppRed += match.redHome;

      if (isOver35) teamCards[match.awayTeam].over35Count++;
      if (isOver45) teamCards[match.awayTeam].over45Count++;
    });

    // Kart puanı hesapla
    const statsWithScore = Object.values(teamCards).map(team => {
      const totalCardCount = team.yellowCards + team.redCards;
      const avgCardCount = totalCardCount / team.matchCount;
      const avgMatchCards = team.totalMatchCards / team.matchCount;
      const ownPenalty = (team.yellowCards * 1) + (team.redCards * 2);
      const oppPenalty = (team.oppYellow * 1) + (team.oppRed * 2);
      const totalPenaltyScore = ownPenalty + oppPenalty;
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
        totalPenaltyScore,

        over35Count: team.over35Count,
        over35Rate: (team.over35Count / team.matchCount) * 100,

        over45Count: team.over45Count,
        over45Rate: (team.over45Count / team.matchCount) * 100
      };
    });

    // Ortalama kart puanına göre sırala
    return statsWithScore
      .sort((a, b) => b.over35Rate - a.over35Rate)
      .map((team, idx) => ({ ...team, rank: idx + 1 }));
  }, [selectedLeague, matches]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  return (
    <Stack sx={{ width: "100%", minHeight: "100vh", background: "#b48181ff"}} spacing={3}>
      
      {/* Üst kısım: AutoComplete ve Tablo yan yana (responsive) */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start" sx={{pt: 5}}>
        
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
              }, mt: 4, pl: 1.5
            }}
          />
        </Box>

        {/* Tablo */}
        {selectedLeague && cardStats.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,              
              backgroundColor: '#2d2d2d'

            }}
          >
            <Table size="small" stickyHeader sx={{ tableLayout: 'fixed' }}>
              <TableHead sx={{ '& .MuiTableCell-root': { backgroundColor: 'rgba(53, 53, 53, 0.8)' } }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: "1px", pr:"5px"}}></TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", width: 60 }}>Takım</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", width: 60 }}>Oynanan Maç</TableCell>
                  <TableCell align="center" sx={{ color: "#fffb00ff", fontWeight: "bold", width: 60 }}>Sarı Kart</TableCell>
                  <TableCell align="center" sx={{ color: "#ff0000ff", fontWeight: "bold", width: 60 }}>Kırmızı Kart</TableCell>
                  <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold", width: 60 }}>Takımın Toplam Kartı</TableCell>
                  <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold", width: 60 }}>Maçlarda Toplam Kart Sayısı</TableCell>
                  <TableCell align="center" sx={{ color: "#ff9900", fontWeight: "bold", width: 60 }}>Maç Başına Ort. Kart</TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", width: 60 }}>Takımın Toplam Ceza Puanı</TableCell>
                  <TableCell align="center" sx={{ color: "#ff9900", fontWeight: "bold", width: 60 }}>Oynanan Maçlarda Toplam Ceza Puanı</TableCell>
                  <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold", width: 60 }}>3.5 Üst Ceza</TableCell>
                  <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold", width: 60 }}>4.5 Üst Ceza</TableCell>


                </TableRow>
              </TableHead>
              <TableBody>
                {cardStats.map((row) => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#3d3d3d" } }}>
                    <TableCell sx={{ color: "#fff" }}>{row.rank}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{row.team}</TableCell>
                    <TableCell align="center" sx={{ color: "#fff"  }}>{row.matchCount}</TableCell>
                    <TableCell align="center" sx={{ color: "#ffd700" }}>{row.yellowCards}</TableCell>
                    <TableCell align="center" sx={{ color: "#ff4444" }}>{row.redCards}</TableCell>
                    <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold" }}>{row.totalCardCount}</TableCell>
                    <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold" }}>{row.totalMatchCards}</TableCell>
                    <TableCell align="center" sx={{ color: "#ff9900", fontWeight: "bold" }}>{row.avgMatchCards.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold" }}>{row.ownPenalty}</TableCell>
                    <TableCell align="center" sx={{ color: "#ff9900", fontWeight: "bold" }}>{row.totalPenaltyScore}</TableCell>
                    <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over35Rate) }}>{row.over35Rate.toFixed(2)}%</TableCell>
                    <TableCell align="center" sx={{ color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.over45Rate) }}>{row.over35Rate.toFixed(2)}%</TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
