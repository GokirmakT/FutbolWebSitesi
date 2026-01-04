import { Stack, Box, Typography, Divider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { teamLogos } from "../Components/TeamLogos";
import corner from "/corner.png";
import redCard from "/cards.png";
import shoot from "/kicking-ball.png";
import shootOnTarget from "/shoot-on-target.png";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const TeamFixture = ({ matches, team }) => {
  const navigate = useNavigate();
  const isTablet = useMediaQuery("(max-width: 800px)");
  const isMobile = useMediaQuery("(max-width: 500px)");
  const { selectedLeague } = useData();
  
  const getBgColor = (team, homeTeam, homeGoal, awayGoal) => {
    const isHome = team === homeTeam;
  
    // BERABERLİK
    if (homeGoal === awayGoal) {
      return "#ffd11a"; // sarı
    }
  
    // EV SAHİBİ
    if (isHome) {
      return homeGoal > awayGoal ? "#66ff66" : "#ff4d4d";
    }
  
    // DEPLASMAN
    return awayGoal > homeGoal ? "#66ff66" : "#ff4d4d";
  };
  

  return (
    <Stack spacing={2} alignItems="center">
      {matches.map((m, i) => {
        const isPlayed = m.winner !== "TBD";      

        return (
            <Box
            key={i}
            sx={{
              borderRadius: 2,
              backgroundColor: isPlayed ? "#f5f5f5" : "#e3f2fd",
              px: 1,
              py: 1,
              width: isTablet ? "95%" : "60%"
            }}
          >
            {/* TARİH */}
            <Stack width="100%" direction="row" justifyContent="space-between">
                <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="right"
                 >
                    {m.league}
                 </Typography>

                 <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="right"
                 >
                    {new Date(m.date).toLocaleDateString("tr-TR")}
                 </Typography>
            </Stack>
           
          
            {/* GRID ROW */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0,1fr) 48px minmax(0,1fr) auto",
                alignItems: "center",
                columnGap: 1
              }}
            >
              {/* HOME LOGO */}
              <img
                src={teamLogos[m.homeTeam]}
                alt={m.homeTeam}
                width={28}
                height={28}
              />
          
              {/* HOME NAME */}
              <Typography
                fontWeight="bold"
                fontSize={isMobile ? "14px" : "18px"}
                noWrap
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main"
                  }
                }}
                title={m.homeTeam}
                textAlign="left"
                onClick={() =>
                        navigate(`/team/${selectedLeague}/${m.homeTeam}`)
                      }
              >
                {m.homeTeam}
              </Typography>
          
              {/* SCORE */}
              <Stack bgcolor={getBgColor(team, m.homeTeam, m.goalHome, m.goalAway)}>
                <Typography
                    fontWeight="bold"
                    fontSize={isMobile ? "14px" : "18px"}
                    textAlign="center"
                >
                    {isPlayed ? `${m.goalHome} - ${m.goalAway}` : "-"}
                </Typography>
              </Stack>                
          
              {/* AWAY NAME */}
              <Typography
                fontWeight="bold"
                fontSize={isMobile ? "14px" : "18px"}
                noWrap
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main"
                  }
                }}                
                title={m.awayTeam}
                textAlign="right"
                 onClick={() =>
                        navigate(`/team/${selectedLeague}/${m.awayTeam}`)
                      }
              >
                {m.awayTeam}
              </Typography>
          
              {/* AWAY LOGO */}
              <img
                src={teamLogos[m.awayTeam]}
                alt={m.awayTeam}
                width={28}
                height={28}                
              />
            </Box>

            {/* İSTATİSTİKLER */}
            {isPlayed && (
                <Stack direction="row" justifyContent="space-between" spacing={4} mt={2}>

                    <Stack alignItems="center" direction="row" spacing={1} flex={1}>
                        <Stack alignItems="center" direction="row" spacing={0.5} flex={1}>
                           
                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shoot} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shootOnTarget} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsOnTargetHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={corner} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.cornerHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={redCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.yellowHome}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={redCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.redHome}
                                </Typography>
                            </Stack>  
                        </Stack>

                        <Divider
                            orientation="vertical"
                            flexItem
                            sx={{
                                mx: isMobile ? 1 : 2,   // 👉 sağ-sol boşluk
                                borderColor: "#ccc",
                                opacity: 1
                            }}
                            />
     


                        <Stack alignItems="center" direction="row" spacing={0.5} flex={1}>
                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shoot} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={shootOnTarget} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.shotsOnTargetAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={corner} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.cornerAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={redCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.yellowAway}
                                </Typography>
                            </Stack>  

                            <Stack alignItems="center" direction="column" spacing={0.5} flex={1}>
                                <img src={redCard} alt={corner} width={24} height={24}/>
                                <Typography fontWeight="bold" fontSize={isMobile ? "14px" : "18px"}>
                                    {m.redAway}
                                </Typography>
                            </Stack>                            
                        </Stack>
                    </Stack>

                </Stack>
            )}


          </Box>
          
        );
      })}
    </Stack>
  );
};

export default TeamFixture;
