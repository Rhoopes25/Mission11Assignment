using System.ComponentModel.DataAnnotations;

namespace Bookstore.API.Data;

// this will set up DB and has to match the sqlite file exactly
public class Book
{
    [Key]
    public int BookID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int PageCount { get; set; }
    public double Price { get; set; }
}