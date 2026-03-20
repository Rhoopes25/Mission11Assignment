using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Data;

public class BookstoreDbContext : DbContext // middle man between c# code and sqlite file
{
    public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options) : base(options) { }

    public DbSet<Book> Books { get; set; }
}