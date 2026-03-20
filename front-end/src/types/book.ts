// This is a TypeScript interface - it defines the "shape" of a Book object
// It must match exactly what the backend API sends back in the JSON response

export interface Book {
    bookID: number;        // matches BookID in the database (integer)
    title: string;         // matches Title in the database (text)
    author: string;        // matches Author in the database (text)
    publisher: string;     // matches Publisher in the database (text)
    isbn: string;          // matches ISBN in the database (text)
    classification: string; // matches Classification in the database (text)
    category: string;      // matches Category in the database (text)
    pageCount: number;     // matches PageCount in the database (integer)
    price: number;         // matches Price in the database (real/decimal)
  }