// Ambil referensi elemen-elemen HTML yang dibutuhkan
const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const isCompleteInput = document.getElementById('isComplete');
const unfinishedShelf = document.getElementById('unfinishedShelf');
const finishedShelf = document.getElementById('finishedShelf');

// Fungsi untuk menyimpan data buku ke localStorage
function saveBooksToStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// Fungsi untuk memuat data buku dari localStorage
function loadBooksFromStorage() {
    const booksJSON = localStorage.getItem('books');
    return booksJSON ? JSON.parse(booksJSON) : [];
}

// Fungsi untuk menampilkan buku dari localStorage
function displayBooksFromStorage() {
    const books = loadBooksFromStorage();
    books.forEach(book => {
        const shelf = book.isComplete ? finishedShelf : unfinishedShelf;
        addToShelf(book, shelf);
    });
}

// Memuat buku dari localStorage saat aplikasi dimuat
displayBooksFromStorage();

// Fungsi untuk menambahkan buku
function addBook() {
    // Ambil nilai dari input
    const title = titleInput.value;
    const author = authorInput.value;
    const year = parseInt(yearInput.value); // Parse ke integer
    const isComplete = isCompleteInput.checked;

    // Validasi input
    if (!title || !author || !year) {
        alert('Please fill in all fields.');
        return;
    }

    // Buat objek buku
    const book = {
        id: +new Date(), // ID unik menggunakan timestamp
        title: title,
        author: author,
        year: year,
        isComplete: isComplete
    };

    // Tambahkan buku ke rak yang sesuai
    addToShelf(book, isComplete ? finishedShelf : unfinishedShelf);

    // Simpan buku ke localStorage
    const books = loadBooksFromStorage();
    books.push(book);
    saveBooksToStorage(books);

    // Reset form
    bookForm.reset();
}

// Fungsi untuk menambahkan buku ke rak
function addToShelf(book, shelf) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.dataset.id = book.id; // Tambahkan data-id
    bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Year: ${book.year}</p>
        <button onclick="moveBook(${book.id}, ${book.isComplete})">
            ${book.isComplete ? 'Move to Unfinished' : 'Move to Finished'}
        </button>
        <button onclick="removeBook(${book.id})">Remove</button>
    `;
    shelf.appendChild(bookElement);
}

// Fungsi untuk memindahkan buku antar rak
function moveBook(id, isComplete) {
    const shelf = isComplete ? unfinishedShelf : finishedShelf;
    const bookElement = document.querySelector(`[data-id="${id}"]`);
    
    // Hapus buku dari rak sebelumnya
    bookElement.remove();
    
    // Pindahkan buku ke rak yang baru
    shelf.appendChild(bookElement);

    // Update status buku di localStorage
    const books = loadBooksFromStorage();
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index].isComplete = !isComplete;
        saveBooksToStorage(books);
    }
    
    window.location.reload();
}

// Fungsi untuk menghapus buku
function removeBook(id) {
    const bookElement = document.querySelector(`[data-id="${id}"]`);
    bookElement.remove();

    // Hapus buku dari localStorage
    const books = loadBooksFromStorage();
    const filteredBooks = books.filter(book => book.id !== id);
    saveBooksToStorage(filteredBooks);

    window.location.reload();

}
