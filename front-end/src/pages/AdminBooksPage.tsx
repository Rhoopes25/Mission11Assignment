import { useEffect, useState } from 'react';
import type { Book } from '../types/book';

const emptyBook: Omit<Book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

// pulled outside so it doesn't break rules of hooks
function BookForm({
  formData,
  onSubmit,
  onCancel,
  handleChange,
}: {
  formData: Omit<Book, 'bookID'>;
  onSubmit: () => void;
  onCancel: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="card mb-4 p-3">
      <div className="row g-2">
        {(['title', 'author', 'publisher', 'isbn', 'classification', 'category'] as const).map((field) => (
          <div className="col-md-4" key={field}>
            <label className="form-label text-capitalize">{field}</label>
            <input
              className="form-control"
              name={field}
              value={formData[field] as string}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="col-md-4">
          <label className="form-label">Page Count</label>
          <input className="form-control" name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Price</label>
          <input className="form-control" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-success" onClick={onSubmit}>Save</button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, 'bookID'>>(emptyBook);

  useEffect(() => {
    fetchBooks();
  }, []);

  function fetchBooks() {
    fetch('http://localhost:5000/api/books/allbooks?pageSize=1000&pageNum=1')
      .then((res) => res.json())
      .then((data) => setBooks(data.books));
  }

  function handleDelete(bookID: number) {
    if (!confirm('Delete this book?')) return;
    fetch(`http://localhost:5000/api/books/deletebook/${bookID}`, {
      method: 'DELETE',
    }).then(() => fetchBooks());
  }

  function handleEditClick(book: Book) {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setShowForm(false);
  }

  function handleUpdate() {
    if (!editingBook) return;
    fetch(`http://localhost:5000/api/books/updatebook/${editingBook.bookID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, bookID: editingBook.bookID }),
    }).then(() => {
      setEditingBook(null);
      setFormData(emptyBook);
      fetchBooks();
    });
  }

  function handleAdd() {
    fetch('http://localhost:5000/api/books/addbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, bookID: 0 }),
    }).then(() => {
      setShowForm(false);
      setFormData(emptyBook);
      fetchBooks();
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  }

  return (
    <div className="container mt-4">
      <h2>Admin - Manage Books</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setShowForm(!showForm);
          setEditingBook(null);
          setFormData(emptyBook);
        }}
      >
        {showForm ? 'Cancel' : '+ Add New Book'}
      </button>

      {showForm && (
        <BookForm formData={formData} onSubmit={handleAdd} onCancel={() => { setShowForm(false); setFormData(emptyBook); }} handleChange={handleChange} />
      )}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <>
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(book)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.bookID)}>Delete</button>
                </td>
              </tr>
              {editingBook?.bookID === book.bookID && (
                <tr key={`edit-${book.bookID}`}>
                  <td colSpan={5}>
                    <BookForm formData={formData} onSubmit={handleUpdate} onCancel={() => { setEditingBook(null); setFormData(emptyBook); }} handleChange={handleChange} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBooksPage;