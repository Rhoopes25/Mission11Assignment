import { useEffect, useState } from 'react';
import type { Book } from '../types/book';
import { useCart } from '../context/CartContext'; // gives us access to the cart
import { useLocation } from 'react-router-dom'; // reads state coming back from cart
import NavBar from '../components/NavBar'; // navbar with cart summary

function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]); // books from the API
  const [pageSize, setPageSize] = useState<number>(5); // results per page
  const [pageNum, setPageNum] = useState<number>(1); // current page
  const [totalItems, setTotalItems] = useState<number>(0); // total books in db
  const [totalPages, setTotalPages] = useState<number>(0); // total pages
  const [sortBy, setSortBy] = useState<string>('title'); // sort field
  const [categories, setCategories] = useState<string[]>([]); // all categories for dropdown
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // selected category
  const [showToast, setShowToast] = useState<boolean>(false); // controls toast visibility
  const { addToCart } = useCart(); // pull addToCart from cart context
  const location = useLocation(); // read state coming back from cart page

  // restore page, category, and page size if coming back from cart
  useEffect(() => {
    if (location.state) {
      setPageNum(location.state.pageNum); // restore page
      setSelectedCategory(location.state.selectedCategory); // restore category
      setPageSize(location.state.pageSize); // restore page size
    }
  }, []); // only runs once on load

  // fetch categories once on load
  useEffect(() => {
    fetch('https://bookstore-api-rachel.azurewebsites.net/api/books/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // fetch books whenever page, size, sort, or category changes
  useEffect(() => {
    const categoryParam = selectedCategory ? `&category=${selectedCategory}` : ''; // only add if selected

    fetch(
      `https://bookstore-api-rachel.azurewebsites.net/api/books/allbooks?pageSize=${pageSize}&pageNum=${pageNum}&sortBy=${sortBy}${categoryParam}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      });
  }, [pageSize, pageNum, sortBy, selectedCategory]); // re-fetch when any of these change

  return (
    <>
      <NavBar pageNum={pageNum} selectedCategory={selectedCategory} pageSize={pageSize} /> {/* navbar at top */}
      <div className="container mt-4">

        {/* Controls row - page size, sort, and category dropdowns */}
        <div className="d-flex gap-3 mb-4 align-items-center flex-wrap">

          {/* Page size dropdown */}
          <div>
            <label className="form-label me-2">Results per page:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNum(1); // reset to page 1
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
                setSortBy(e.target.value);
                setPageNum(1); // reset to page 1
              }}
            >
              <option value="title">Title (A–Z)</option>
            </select>
          </div>

          {/* Category filter - populated from the API */}
          <div>
            <label className="form-label me-2">Category:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPageNum(1); // reset to page 1
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Book cards - one per book */}
        <div className="row">
          {books.map((book) => (
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
                  <button
                    className="btn btn-primary btn-sm mt-2 w-100"
                    onClick={() => {
                      addToCart({ bookID: book.bookID, title: book.title, price: book.price, quantity: 1 }); // add to cart silently
                      setShowToast(true); // show toast notification
                      setTimeout(() => setShowToast(false), 2000); // hide after 2 seconds
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination buttons */}
        <nav className="mt-3">
          <ul className="pagination justify-content-center flex-wrap">

            {/* Previous - disabled on page 1 */}
            <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPageNum(pageNum - 1)}>Previous</button>
            </li>

            {/* One button per page */}
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${pageNum === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setPageNum(index + 1)}
                  disabled={pageNum === index + 1}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            {/* Next - disabled on last page */}
            <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPageNum(pageNum + 1)}>Next</button>
            </li>
          </ul>
        </nav>

        <p className="text-center text-muted">
          Showing page {pageNum} of {totalPages} ({totalItems} total books)
        </p>
      </div>

      {/* bootstrap toast - pops up when item added to cart */}
      <div
        className={`toast align-items-center text-white bg-success border-0 ${showToast ? 'show' : ''}`}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
        role="alert"
      >
        <div className="d-flex">
          <div className="toast-body">
            ✅ Added to cart!
          </div>
        </div>
      </div>
    </>
  );
}

export default BookListPage;