import {
  AppBar,
  Toolbar,
  TextField,
  Button,
  Stack,
  Box,
  Menu,
  MenuItem, ListItemIcon, ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useData } from "../context/DataContext";

export default function Header() {
  const navigate = useNavigate();
  const { setSelectedLeague } = useData();

  // DESKTOP lig menüsü
  const [anchorEl, setAnchorEl] = useState(null);

  // MOBILE ana menü
  const [menuAnchor, setMenuAnchor] = useState(null);

  // MOBILE lig submenu
  const [leagueAnchor, setLeagueAnchor] = useState(null);

  const closeTimerRef = useRef(null);

  const isMobile = useMediaQuery("(max-width: 460px)");
  const headerButtons = useMediaQuery("(max-width: 650px)");

  const leagues = [
    { id: "superlig", name: "Süper Lig", icon: "/leagues/superlig.png" },
    { id: "premier-league", name: "Premier League", icon: "/leagues/premier-league.png" },
    { id: "laliga", name: "LaLiga", icon: "/leagues/laliga.png" },
    { id: "seriea", name: "Serie A", icon: "/leagues/seriea.png" },
    { id: "bundesliga", name: "Bundesliga", icon: "/leagues/bundesliga.png" },
    { id: "ligue1", name: "Ligue 1", icon: "/leagues/ligue1.png" },
    { id: "eredivisie", name: "Eredivisie", icon: "/leagues/eredivise.png" },
    { id: "champions-league", name: "Champions League", icon: "/leagues/champions-league.png" },
    { id: "europa-league", name: "Europa League", icon: "/leagues/europa-league.png" },
    { id: "europa-conference-league", name: "Europa Conference League", icon: "/leagues/europa-conference-league.png" }
  ];

  // DESKTOP hover açma
  function handleOpen(e) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setAnchorEl(e.currentTarget);
  }

  // Header lig isimlerini backend lig isimlerine map et
  const leagueNameMapping = {
    "Süper Lig": "Super Lig",
    "Premier League": "Premier League",
    "LaLiga": "LaLiga",
    "Serie A": "Serie A",
    "Bundesliga": "Bundesliga",
    "Ligue 1": "Ligue 1",
    "Eredivisie": "Eredivisie",
    "Champions League": "Champions League",
    "Europa League": "Europa League",
    "Europa Conference League": "Europa Conference League"
  };

  function handleLeagueClick(league) {
    setAnchorEl(null);
    setMenuAnchor(null);
    setLeagueAnchor(null);
    // Header'dan seçilen lige navigate et - Standings sayfası URL'den lig bilgisini alacak
    navigate(`/lig/${league.id}`);
  }
  
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1d1d1d", p: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* SOL: ARAMA */}
        <Box sx={{ width: "30%", minWidth: "200px" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Takım, maç veya lig ara..."
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              input: { color: "black" }
            }}
          />
        </Box>

        {/* SAĞ: MENÜLER */}
        <Stack direction="row" spacing={2}>
          {/* ================= DESKTOP ================= */}
          {!headerButtons && (
            <>
              <Box
                onMouseEnter={handleOpen}
                onMouseLeave={() => setAnchorEl(null)}
              >
                <Button
                  variant="outlined"
                  sx={{ width: isMobile ? "30px" : "70px" }}
                >
                  Lig
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    onMouseEnter: () => {
                      if (closeTimerRef.current) {
                        clearTimeout(closeTimerRef.current);
                        closeTimerRef.current = null;
                      }
                    },
                    onMouseLeave: () => setAnchorEl(null)
                  }}
                >
                  {leagues.map((l) => (
                  <MenuItem key={l.id} onClick={() => handleLeagueClick(l)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <img
                        src={l.icon}
                        alt={l.name}
                        style={{ width: 20, height: 20 }}
                      />
                    </ListItemIcon>

                    <ListItemText primary={l.name} />
                  </MenuItem>
                ))}
                </Menu>
              </Box>
              <Button variant="contained" onClick={() => navigate("/Cards")}>
                Kart
              </Button>
              <Button variant="contained" onClick={() => navigate("/Corners")}>
                Korner
              </Button>
              <Button variant="contained" onClick={() => navigate("/Goals")}>
                Gol
              </Button>
            </>
          )}

          {/* ================= MOBILE ================= */}
          {headerButtons && (
            <>
              <Button
                variant="contained"
                sx={{ width: isMobile ? "30px" : "70px" }}
                onClick={(e) => setMenuAnchor(e.currentTarget)}
              >
                Menü
              </Button>

              {/* ANA MOBİL MENÜ */}
              <Menu
                sx={{ mt: "5px" }}
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => {
                  setMenuAnchor(null);
                  setLeagueAnchor(null);
                }}
              >
                <MenuItem onClick={() => {navigate("/TodayMatches"); setMenuAnchor(null);}}>Bugünün maçları</MenuItem>
                <MenuItem
                  onMouseEnter={(e) => setLeagueAnchor(e.currentTarget)}
                >
                  Ligler
                </MenuItem>
                <MenuItem onClick={() => {navigate("/Cards"); setMenuAnchor(null);}}>Kart</MenuItem>
                <MenuItem onClick={() => {navigate("/Corners"); setMenuAnchor(null);}}>Korner</MenuItem>
                <MenuItem onClick={() => {navigate("/Goals"); setMenuAnchor(null);}}>Gol</MenuItem>
              </Menu>

              {/* MOBİL LİGLER SUBMENU */}
              <Menu
                sx={{ width: 300, ml: "0px", mt: "0px" }}
                anchorEl={leagueAnchor}
                open={Boolean(leagueAnchor)}
                onClose={() => setLeagueAnchor(null)}
                
                MenuListProps={{
                  onMouseLeave: () => setLeagueAnchor(null)
                }}
              >
                {leagues.map((l) => (
                  <MenuItem key={l.id} onClick={() => handleLeagueClick(l)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <img
                        src={l.icon}
                        alt={l.name}
                        style={{ width: 20, height: 20 }}
                      />
                    </ListItemIcon>

                    <ListItemText primary={l.name} />
                  </MenuItem>
                ))}
              </Menu>

            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
