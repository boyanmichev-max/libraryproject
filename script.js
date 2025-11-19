// -------------------------------
// LOCAL STORAGE
// -------------------------------
if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify([]));
}

let mode = "borrow";
let selectedBook = null;
let pendingBarcode = null;

// -------------------------------
// LOGO
// -------------------------------
function updateLogo() {
    document.getElementById("school-logo").src =
        document.getElementById("logoURL").value;
}

// -------------------------------
// MODE
// -------------------------------
function setMode(m) {
    mode = m;
    document.getElementById("output").innerHTML = `<h3>Mode: ${m}</h3>`;
}

// -------------------------------
// BARCODE PROCESSING
// -------------------------------
function processBarcode() {
    const code = document.getElementById("barcodeInput").value.trim();
    const books = JSON.parse(localStorage.getItem("books"));
    const book = books.find(b => b.barcode === code);

    if (!book) {
        document.getElementById("output").innerHTML = "<p>Book not found.</p>";
        return;
    }

    selectedBook = book;
    pendingBarcode = code;

    if (mode === "borrow") showWarning();
    if (mode === "return") returnBook(book);
    if (mode === "info") showBookInfo(book);
}

// -------------------------------
// BORROW POPUP
// -------------------------------
function showWarning() {
    document.getElementById("warningPopup").style.display = "block";
}

function closeWarning() {
    document.getElementById("warningPopup").style.display = "none";
}

// -------------------------------
// BORROW CONFIRM
// -------------------------------
function confirmBorrow() {
    closeWarning();
    let books = JSON.parse(localStorage.getItem("books"));
    let book = books.find(b => b.barcode === pendingBarcode);

    book.status = "borrowed";
    book.borrowDate = Date.now();
    book.dueDate = Date.now() + 14 * 24 * 60 * 60 * 1000;
    book.extended = false;

    localStorage.setItem("books", JSON.stringify(books));

    document.getElementById("output").innerHTML =
        `<h3>Borrowed: ${book.title}</h3><p>Due in 14 days.</p>`;
}

// -------------------------------
// RETURN / EXTEND LOGIC
// -------------------------------
function returnBook(book) {

    if (book.status === "available") {
        document.getElementById("output").innerHTML =
            "<p>This book is already available.</p>";
        return;
    }

    if (!book.extended) {
        const wantsExtension = confirm(
            "Extend the loan by 7 days?"
        );

        if (wantsExtension) {
            book.dueDate += 7 * 24 * 60 * 60 * 1000;
            book.extended = true;
            saveBooks();
            document.getElementById("output").innerHTML =
                "<p>Loan extended by 7 days.</p>";
            return;
        }
    }

    book.status = "available";
    book.borrowDate = null;
    book.dueDate = null;

    saveBooks();
    document.getElementById("output").innerHTML =
        "<p>Book returned.</p>";
}

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(JSON.parse(localStorage.getItem("books"))));
}

// -------------------------------
// INFO
// -------------------------------
function showBookInfo(book) {
    document.getElementById("output").innerHTML = `
        <h3>${book.title}</h3>
        <p><b>Author:</b> ${book.author}</p>
        <p><b>Release Date:</b> ${book.date}</p>
        <p><b>Topic:</b> ${book.topic}</p>
        <p><b>Status:</b> ${book.status}</p>
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
    if (document.getElementById("adminPassword").value === "admin") {
        closeAdminLogin();
        openAdminPanel();
    } else alert("Incorrect password.");
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
    const newBook = {
        title: newTitle.value,
        author: newAuthor.value,
        date: newDate.value,
        topic: newTopic.value,
        barcode: generateBarcodeNumber(),
        status: "available",
        borrowDate: null,
        dueDate: null,
        extended: false
    };

    let books = JSON.parse(localStorage.getItem("books"));
    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));

    alert("Book added. Barcode: " + newBook.barcode);
}

// -------------------------------
// EDIT BOOK
// -------------------------------
function loadBookForEdit() {
    let code = editBarcode.value;
    let books = JSON.parse(localStorage.getItem("books"));
    let book = books.find(b => b.barcode == code);

    if (!book) { alert("Not found"); return; }

    editSection.style.display = "flex";

    editTitle.value = book.title;
    editAuthor.value = book.author;
    editDate.value = book.date;
    editTopic.value = book.topic;
}

function saveEdit() {
    let code = editBarcode.value;
    let books = JSON.parse(localStorage.getItem("books"));
    let book = books.find(b => b.barcode == code);

    book.title = editTitle.value;
    book.author = editAuthor.value;
    book.date = editDate.value;
    book.topic = editTopic.value;

    localStorage.setItem("books", JSON.stringify(books));
    alert("Updated!");
}

function removeBook() {
    let code = editBarcode.value;
    let books = JSON.parse(localStorage.getItem("books"));
    books = books.filter(b => b.barcode !== code);
    localStorage.setItem("books", JSON.stringify(books));
    alert("Removed.");
}

// -------------------------------
// BARCODE GEN
// -------------------------------
function generateBarcodeNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

function generateBarcode() {
    generatedBarcode.innerText =
        "Generated Barcode: " + generateBarcodeNumber();
}
