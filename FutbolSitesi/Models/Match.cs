namespace FutbolSitesi.Models
{
    public class Match
    {
        public int Id { get; set; }

        public string Season { get; set; } = string.Empty;
        public string League { get; set; } = string.Empty;
        public int Week { get; set; }

        public DateTime Date { get; set; }   // 🟢 MAÇ TARİHİ (UTC)
        public string Time { get; set; } = string.Empty; // Maç saati (HH:mm)

        public string HomeTeam { get; set; } = string.Empty;
        public string AwayTeam { get; set; } = string.Empty;

        public string Winner { get; set; } = string.Empty; // Home, Away, Draw, TBD

        public int GoalHome { get; set; }
        public int GoalAway { get; set; }

        public int CornerHome { get; set; }
        public int CornerAway { get; set; }

        public int YellowHome { get; set; }
        public int YellowAway { get; set; }

        public int RedHome { get; set; }
        public int RedAway { get; set; }
    }
}
