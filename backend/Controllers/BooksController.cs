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
        string sortBy = "title",
        string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Filter by category if one was provided
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Sorting
        query = sortBy.ToLower() switch
        {
            "title" => query.OrderBy(b => b.Title),
            _ => query.OrderBy(b => b.Title)
        };

        // Total count AFTER filtering, BEFORE pagination
        var totalCount = query.Count();

        // Pagination
        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalNumBooks = totalCount });
    }

    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(categories);
    }
}