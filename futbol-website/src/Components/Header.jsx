import { AppBar, Toolbar, TextField, Button, Stack, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null); // Mobil menü
  const open = Boolean(anchorEl);
  const menuOpen = Boolean(menuAnchor);
  const closeTimerRef = useRef(null);

  const isMobile = useMediaQuery("(max-width: 460px)");
  const headerButtons = useMediaQuery("(max-width: 650px)");

  const leagues = [
    { id: "superlig", name: "Süper Lig" },
    { id: "premier-league", name: "Premier League" },
    { id: "laliga", name: "LaLiga" },
    { id: "seriea", name: "Serie A" },
    { id: "bundesliga", name: "Bundesliga"},
    { id: "ligue1", name: "Ligue 1" },
    { id: "eredivisie", name: "Eredivisie" },
    { id: "champions-league", name: "Champions League"},
    { id: "europa-league", name: "Europa League"},
    { id: "europa-conference-league", name: "Europa Conference League"}
  ];

  function handleOpen(e) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setAnchorEl(e.currentTarget);
  }

  function handleMenuClick(league) {
    setAnchorEl(null);
    navigate(`/lig/${league.id}`);
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1d1d1d", p: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* Sol: Arama */}
        <Box sx={{ width: "30%", minWidth: "140px" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Takım, maç veya lig ara..."
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 1,
              input: { color: "black" }
            }}
          />
        </Box>

        {/* Sağ: Butonlar */}
        <Stack direction="row" spacing={2}>

          {/* --------------------- LİG BUTTONU ---------------------- */}
          <Box
            onMouseEnter={(e) => !headerButtons && handleOpen(e)}
            onMouseLeave={() => !headerButtons && setAnchorEl(null)}
          >
            <Button variant="outlined" sx={{width: isMobile ? '30px' : '70px'}} onClick={(e) => headerButtons && handleOpen(e)}>
              Lig
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              MenuListProps={{
                onMouseEnter: () => {
                  if (closeTimerRef.current) {
                    clearTimeout(closeTimerRef.current);
                    closeTimerRef.current = null;
                  }
                },
                onMouseLeave: () => !headerButtons && setAnchorEl(null)
              }}
            >
              {leagues.map((l) => (
                <MenuItem key={l.id} onClick={() => handleMenuClick(l)}>
                  {l.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* ------------------- DESKTOP (4 buton) ------------------- */}
          {!headerButtons && (
            <>
              <Button variant="contained" onClick={() => navigate("/Cards")}>Kart</Button>
              <Button variant="contained" onClick={() => navigate("/Corners")}>Korner</Button>
              <Button variant="contained" onClick={() => navigate("/Goals")}>Gol</Button>
            </>
          )}

          {/* -------------------- MOBILE (MENÜ) ---------------------- */}
          {headerButtons && (
            <>
              <Button
                variant="contained"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{width: isMobile ? '30px' : '70px'}}
              >
                Menü
              </Button>

              <Menu
                anchorEl={menuAnchor}
                open={menuOpen}
                onClose={() => setMenuAnchor(null)}
              >
                <MenuItem onClick={() => navigate("/Cards")}>Kart</MenuItem>
                <MenuItem onClick={() => navigate("/Corners")}>Korner</MenuItem>
                <MenuItem onClick={() => navigate("/Goals")}>Gol</MenuItem>
              </Menu>
            </>
          )}

        </Stack>

      </Toolbar>
    </AppBar>
  );
}
