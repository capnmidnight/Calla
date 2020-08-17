using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Calla.Data
{
    public partial class PageViews
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }
        [Required]
        public string From { get; set; }
        [Required]
        public string To { get; set; }
        [Required]
        public string Referrer { get; set; }
        [Required]
        public string UserAgent { get; set; }
        [Column(TypeName = "timestamp with time zone")]
        public DateTime Timestamp { get; set; }
    }
}
