import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMatches, getStandings } from "../api/api";
import PageLoader from "../Components/LoadingPage.jsx";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState("Super Lig");

  const {
    data: matches = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  const {
    data: standings = [],
    isLoading: isLoadingStandings,
    error: standingsError,
  } = useQuery({
    queryKey: ["standings"],
    queryFn: () => getStandings(),
  });

  // Lig listesi (GLOBAL)
  const leagues = useMemo(() => {
    if (!matches.length) return [];
    return [...new Set(matches.map(m => m.league))].sort();
  }, [matches]);

  const value = {
    matches,
    standings,
    leagues,
    selectedLeague,
    setSelectedLeague,
    isLoading,
    isLoadingStandings,
    error,
    standingsError,
  };
   
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
