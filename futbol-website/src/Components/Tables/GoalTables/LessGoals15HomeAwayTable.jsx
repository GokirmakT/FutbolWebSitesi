import { useState, useMemo } from "react";
import {
  Stack, Typography, Box, Autocomplete, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";


const OverGoals = ({ goalStats, selectedLeague, isMobile, teamLogos, football, playedMatches, getBgColor }) => {  

    return (
        <>
        
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
                  <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 2 : 2, pl: isMobile ? 0 : 2 }}>Takım</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2  }} align="center">
                  <Stack alignItems={'center'}>
                    <img
                      src={playedMatches}
                      style={{ width: 20, height: 20, color: "#fff" }}
                    />    
                    </Stack>
                  </TableCell>
                  
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">1.5 Alt</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 1 : 2, pl: isMobile ? 0 : 2 }} align="center">İç Saha</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2 }} align="center">Dış Saha</TableCell>
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
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.less15Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.less15Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.homeLess15Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.homeLess15Rate.toFixed(0)}%</TableCell>
                    <TableCell align="center" sx={{color: "#ffffffff", fontWeight: "bold", backgroundColor: getBgColor(row.awayLess15Rate), pr: isMobile ? 0 : 2, pl: isMobile ? 0 : 2}}>{row.awayLess15Rate.toFixed(0)}%</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        </>
      );
    }

export default OverGoals;
