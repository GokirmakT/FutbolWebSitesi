import { useState } from 'react';
import { Stack, Typography, Grid, Button, Paper, Box } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {

  const [step, setStep] = useState(1);

  const { data: matches, isLoading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5017/api/matches");
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading matches</div>;

  // ⭐ Week 1 filtreleme (hook DEĞİL — güvenli)
  const week1Matches = matches.filter(m => m.week === 1);

  return (
    <Stack direction="column" alignItems="center" justifyContent="center" height="100vh" sx={{ backgroundColor: "#33641dff"}}>
      <Stack width="100%" sx={{ backgroundColor: "#e44949dd"}}>

        <Grid container spacing={10} justifyContent="center">

          {/* 1. Grid Item */}
          <Grid item xs={12} sm={4}>
            <Stack height="60vh" width="500px" sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5ff" }}>
              <Button variant="contained" onClick={() => setStep(2)}>
                Show Step 2
              </Button>
            </Stack>
          </Grid>

          {/* 2. Grid Item */}
          {step >= 2 && (
            <Grid item xs={12} sm={4}>
              <Stack height="60vh" width="500px" sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5ff" }}>
                <Button variant="contained" onClick={() => setStep(3)}>
                  Show Step 3
                </Button>

                {/* ⭐ Week 1 maçları burada listeleniyor */}
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {week1Matches.map((match, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 1, 
                        border: "1px solid #ddd", 
                        borderRadius: 1,
                        background: "#fff"
                      }}
                    >
                      <Typography> {match.homeTeam} - {match.awayTeam}  </Typography>
                    </Box>
                  ))}
                </Stack>

              </Stack>
            </Grid>
          )}

          {/* 3. Grid Item */}
          {step >= 3 && (
            <Grid item xs={12} sm={4}>
              <Stack height="60vh" width="500px" sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5ff" }}>
                <Typography>Step 3 Content</Typography>
              </Stack>
            </Grid>
          )}

        </Grid>

      </Stack>
    </Stack>
  );
}

export default App;
