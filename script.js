// -------------------------------
// LOCAL STORAGE SETUP
// -------------------------------
if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify([]));
}

let mode = "borrow";
let selectedBook = null;
let pendingBarcode = null;

// -------------------------------
// LOGO UPDATE
// -------------------------------
function updateLogo() {
    document.getElementById("school-logo").src =
        document.getElementById("logoURL").value;
}

// -------------------------------
// MODE SWITCHING
// -------------------------------
function setMode(m) {
    mode = m;
    document.getElementById("output").innerHTML = `Mode set to: <b>${m}</b>`;
}

// -------------------------------
// PROCESS BARCODE
// -------------------------------
function processBarcode() {
    const code = document.getElementById("barcodeInput").value.trim();
    const books = JSON.parse(localStorage.getItem("books"));
    const book = books.find(b => b.barcode === code);

    if (!book) {
        document.getElementById("output").innerHTML = "Book not found.";
        return;
    }

    selectedBook = book;
    pendingBarcode = code;

    if (mode === "borrow") {
        showWarning();
    }
    else if (mode === "return") {
        returnBook(book);
    }
    else if (mode === "info") {
        showBookInfo(book);
    }
}

// -------------------------------
// WARNING POPUP
// -------------------------------
function showWarning() {
    document.getElementById("warningPopup").style.display = "block";
}

function closeWarning() {
    document.getElementById("warningPopup").style.display = "none";
}

// -------------------------------
// CONFIRM BORROW
// -------------------------------
function confirmBorrow() {
    closeWarning();

    let books = JSON.parse(localStorage.getItem("books"));
    let book = books.find(b => b.barcode === pendingBarcode);

    if (!book) return;

    book.status = "borrowed";
    book.borrowDate = Date.now();
    book.dueDate = Date.now() + 14 * 24 * 60 * 60 * 1000;
    book.extended = false;

    localStorage.setItem("books", JSON.stringify(books));
    document.getElementById("output").innerHTML =
        `Borrowed: <b>${book.title}</b><br>Due in 14 days.`;
}

// -------------------------------
// RETURN BOOK (with extension option)
// -------------------------------
function returnBook(book) {
    if (book.status === "available") {
        document.getElementById("output").innerHTML =
            "This book is already available.";
        return;
    }

    // If extension still allowed
    if (!book.extended) {
        const wantsExtension = confirm(
            "Would you like to extend the loan by 7 days?"
        );

        if (wantsExtension) {
            book.dueDate += 7 * 24 * 60 * 60 * 1000;
            book.extended = true;
            saveBooks();
            document.getElementById("output").innerHTML =
                "Loan extended by 7 days.";
            return;
        }
    }

    // Final return
    book.status = "available";
    book.borrowDate = null;
    book.dueDate = null;

    saveBooks();
    document.getElementById("output").innerHTML =
        "Book returned successfully.";
}

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(JSON.parse(localStorage.getItem("books"))));
}

// -------------------------------
// BOOK INFO
// -------------------------------
function showBookInfo(book) {
    document.getElementById("output").innerHTML = `
        <b>${book.title}</b><br>
        Author: ${book.author}<br>
        Release Date: ${book.date}<br>
        Topic: ${book.topic}<br>
        Status: ${book.status}<br>
    `;
}

// -------------------------------
// ADMIN LOGIN
// -------------------------------
function openAdminLogin() {
    document.getElementById("adminLogin").style.display = "block";
}

function closeAdminLogin() {
    document.getElementById("adminLogin").style.display = "none";
}

function checkAdmin() {
    const pass = document.getElementById("adminPassword").value;
    if (pass === "admin") {
        closeAdminLogin();
        openAdminPanel();
    } else {
        alert("Incorrect password.");
    }
}

// -------------------------------
// ADMIN PANEL
// -------------------------------
function openAdminPanel() {
    document.getElementById("adminPanel").style.display = "block";
}

function closeAdminPanel() {
    document.getElementById("adminPanel").style.display = "none";
}

// -------------------------------
// ADD BOOK
// -------------------------------
function addBook() {
    const books = JSON.parse(localStorage.getItem("books"));

    const newBook = {
        title: document.getElementById("newTitle").value,
        author: document.getElementById("newAuthor").value,
        date: document.getElementById("newDate").value,
        topic: document.getElementById("newTopic").value,
        barcode: generateBarcodeNumber(),
        status: "available",
        borrowDate: null,
        dueDate: null,
        extended: false
    };

    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));

    alert("Book added! Barcode: " + newBook.barcode);
}

// -------------------------------
// EDIT BOOK
// -------------------------------
function loadBookForEdit() {
    const code = document.getElementById("editBarcode").value;
    const books = JSON.parse(localStorage.getItem("books"));
    const book = books.find(b => b.barcode === code);

    if (!book) {
        alert("Book not found.");
        return;
    }

    document.getElementById("editSection").style.display = "block";

    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editDate").value = book.date;
    document.getElementById("editTopic").value = book.topic;
}

function saveEdit() {
    const code = document.getElementById("editBarcode").value;
    const books = JSON.parse(localStorage.getItem("books"));
    const book = books.find(b => b.barcode === code);

    book.title = document.getElementById("editTitle").value;
    book.author = document.getElementById("editAuthor").value;
    book.date = document.getElementById("editDate").value;
    book.topic = document.getElementById("editTopic").value;

    localStorage.setItem("books", JSON.stringify(books));
    alert("Book updated!");
}

function removeBook() {
    const code = document.getElementById("editBarcode").value;
    let books = JSON.parse(localStorage.getItem("books"));

    books = books.filter(b => b.barcode !== code);
    localStorage.setItem("books", JSON.stringify(books));

    alert("Book removed.");
}

// -------------------------------
// BARCODE GENERATOR
// -------------------------------
function generateBarcodeNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function generateBarcode() {
    const newCode = generateBarcodeNumber();
    document.getElementById("generatedBarcode").innerText =
        "Generated Barcode: " + newCode;
}
