using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers;

[ApiController] // tells .NET this is an API controller
[Route("api/[controller]")] // sets the URL. [controller] automatically
public class BooksController : ControllerBase
{
    private readonly BookstoreDbContext _context;

    public BooksController(BookstoreDbContext context)
    {
        _context = context;
    }

    [HttpGet("allbooks")]
    public IActionResult GetBooks(
        int pageSize = 5,
        int pageNum = 1,
        string sortBy = "title")
    {
        var query = _context.Books.AsQueryable();

        // Sorting - currently sorts by title, can expand later
        query = sortBy.ToLower() switch
        {
            "title" => query.OrderBy(b => b.Title),
            _ => query.OrderBy(b => b.Title)
        };

        // Get total count before pagination
        var totalCount = query.Count();

        // Apply pagination
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        // Return both the books and total count in one object
        return Ok(new { books, totalNumBooks = totalCount });
    }
}