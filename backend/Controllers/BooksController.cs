using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;

namespace Bookstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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

        if (!string.IsNullOrEmpty(category))
            query = query.Where(b => b.Category == category);

        query = sortBy.ToLower() switch
        {
            "title" => query.OrderBy(b => b.Title),
            _ => query.OrderBy(b => b.Title)
        };

        var totalCount = query.Count();

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

    [HttpPost("addbook")]
    public IActionResult AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        _context.SaveChanges();
        return Ok(book);
    }

    [HttpPut("updatebook/{bookID}")]
    public IActionResult UpdateBook(int bookID, [FromBody] Book updatedBook)
    {
        var book = _context.Books.Find(bookID);
        if (book == null) return NotFound();

        book.Title = updatedBook.Title;
        book.Author = updatedBook.Author;
        book.Publisher = updatedBook.Publisher;
        book.ISBN = updatedBook.ISBN;
        book.Classification = updatedBook.Classification;
        book.Category = updatedBook.Category;
        book.PageCount = updatedBook.PageCount;
        book.Price = updatedBook.Price;

        _context.SaveChanges();
        return Ok(book);
    }

    [HttpDelete("deletebook/{bookID}")]
    public IActionResult DeleteBook(int bookID)
    {
        var book = _context.Books.Find(bookID);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        _context.SaveChanges();
        return NoContent();
    }
}