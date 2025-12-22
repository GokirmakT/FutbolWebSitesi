import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import home from "/home.png";
import plane from "/plane.png";

const KgGoals = ({ goalStats, selectedLeague, isMobile, teamLogos, football, playedMatches, getBgColor }) => {  

    return (
        <>
           <Stack justifyContent="flex-end" sx={{mt:'20px', display: selectedLeague ? 'block' : 'none', width: isMobile ? '100%' : '70%', backgroundColor: "#1d1d1d" }}>
               <Typography variant="h6" sx={{color: "#fff", fontWeight: "bold", mb: 1}}>
                   {selectedLeague} – Takımlarının KG İstatistikleri Ve Maç Başına Gol Ortalamaları
               </Typography>
           </Stack> 

          {selectedLeague && goalStats.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              width: isMobile ? '100%' : '70%',              
              backgroundColor: "#2a3b47",
              overflow: 'hidden',
              borderRadius: 0             
            }}
          >
            <Table size="small" stickyHeader sx={{borderRadius: 0}}>
              <TableHead sx={{ "& .MuiTableCell-root": { backgroundColor: "#1d1d1d" } }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 2 : 2, pl: isMobile ? 0 : 2 }}></TableCell>
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 0, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={playedMatches}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}} align="center">
                    <Stack alignItems={'center'}>
                    <img
                      src={football}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">KG</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">
                    <Stack alignItems={'center'}>
                    <img
                      src={home}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">
                    <Stack alignItems={'center'}>
                    <img
                      src={plane}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {goalStats.map(row => (
                  <TableRow key={row.team} sx={{ "&:hover": { backgroundColor: "#2c2c2c" } }}>
                    <TableCell sx={{ color: "#fff", fontSize: '12px', pr: isMobile ? "1px" : 2, pl: isMobile ? 1 : 2 }}>{row.rank}</TableCell>
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
                    <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.matchCount}</TableCell>
                    <TableCell sx={{ color: "#ffaaff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">{row.avgMatchGoals.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.btsRate), pr: isMobile ? 1 : 2, pl: isMobile ? 1 : 2}}>{row.btsRate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.homeBtsRate), pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}}>{row.homeBtsRate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#000000ff", fontWeight: "bold", backgroundColor: getBgColor(row.awayBtsRate), pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2}}>{row.awayBtsRate.toFixed(0)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </>
      );
    }

export default KgGoals;
