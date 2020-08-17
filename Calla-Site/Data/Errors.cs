using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Calla.Data
{
    public partial class Errors
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        public string From { get; set; }

        [Required]
        public string On { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        [Column(TypeName = "json")]
        public string ErrorObject { get; set; }

        [Column(TypeName = "timestamp with time zone")]
        public DateTime Timestamp { get; set; }
    }
}
