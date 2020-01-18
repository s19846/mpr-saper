using System;
using SQLite;

namespace Multisweeper.Entities
{

    public class Score
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string User { get; set; }
        public string Points { get; set; }
    }
}
