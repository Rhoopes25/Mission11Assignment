import { useEffect, useState } from 'react';
import type { Book } from '../types/book';

function BookList() {
  // State variables - these are the things that can change and trigger a re-render
  const [books, setBooks] = useState<Book[]>([]); // array of books from the API
  const [pageSize, setPageSize] = useState<number>(5); // how many books per page
  const [pageNum, setPageNum] = useState<number>(1); // which page we're on
  const [totalItems, setTotalItems] = useState<number>(0); // total books in database
  const [totalPages, setTotalPages] = useState<number>(0); // total number of pages
  const [sortBy, setSortBy] = useState<string>('title'); // what to sort by

  // useEffect runs automatically when the component loads
  // and re-runs whenever pageSize, pageNum, or sortBy changes
  useEffect(() => {
    fetch(
      // Template literal to build the URL with our state variables
      `http://localhost:5000/api/books/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}`
    )
      .then((res) => res.json()) // convert response to JSON
      .then((data) => {
        setBooks(data.books); // store the books array in state
        setTotalItems(data.totalNumBooks); // store total count in state
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // calculate total pages
      });
  }, [pageSize, pageNum, sortBy]); // dependency array - re-fetch when these change

  return (
    <div className="container mt-4">
      <h1 className="mb-4">📚 Bookstore</h1>

      {/* Controls row - page size and sort dropdowns */}
      <div className="d-flex gap-3 mb-4 align-items-center">
        
        {/* Page size dropdown */}
        <div>
          <label className="form-label me-2">Results per page:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value)); // update page size
              setPageNum(1); // reset to page 1 when page size changes
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Sort dropdown */}
        <div>
          <label className="form-label me-2">Sort by:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value); // update sort
              setPageNum(1); // reset to page 1 when sort changes
            }}
          >
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Book cards - one card per book */}
      <div className="row">
        {books.map((book) => (
          // key prop helps React track which card is which when re-rendering
          <div className="col-md-6 col-lg-4 mb-4" key={book.bookID}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{book.author}</h6>
                <ul className="list-unstyled mt-2">
                  <li><b>Publisher:</b> {book.publisher}</li>
                  <li><b>ISBN:</b> {book.isbn}</li>
                  <li><b>Classification:</b> {book.classification}</li>
                  <li><b>Category:</b> {book.category}</li>
                  <li><b>Pages:</b> {book.pageCount}</li>
                  <li><b>Price:</b> ${book.price.toFixed(2)}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination buttons */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center flex-wrap">
          
          {/* Previous button - disabled when on page 1 */}
          <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>
              Previous
            </button>
          </li>

          {/* Generate one button per page dynamically */}
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setPageNum(index + 1)}
                disabled={pageNum === index + 1} // disable the current page button
              >
                {index + 1}
              </button>
            </li>
          ))}

          {/* Next button - disabled when on last page */}
          <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Summary text */}
      <p className="text-center text-muted">
        Showing page {pageNum} of {totalPages} ({totalItems} total books)
      </p>
    </div>
  );
}

export default BookList;