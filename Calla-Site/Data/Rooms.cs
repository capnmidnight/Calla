using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Calla.Data
{
    public partial class Rooms
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string ShortName { get; set; }

        [Required]
        public bool Visible { get; set; }

        [Column(TypeName = "timestamp with time zone")]
        public DateTime Timestamp { get; set; }
    }
}
