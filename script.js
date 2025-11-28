<script>
function showPanel(id) {
document.querySelectorAll('.panel').forEach(p => {
p.classList.remove('active');
setTimeout(() => p.style.display = 'none', 300);
});


const panel = document.getElementById(id);
panel.style.display = 'block';
setTimeout(() => panel.classList.add('active'), 10);
}


function addStudent() {
let name = document.getElementById("studentName").value.trim();
let grade = document.getElementById("studentGrade").value.trim();


if (!name || !grade) return alert("Enter all fields");


let students = JSON.parse(localStorage.getItem("students") || "[]");
students.push({ name, grade });


localStorage.setItem("students", JSON.stringify(students));
alert("Student saved!");
}


function addBook() {
let name = document.getElementById("bookName").value.trim();
let isbn = document.getElementById("isbn").value.trim();
let author = document.getElementById("author").value.trim();
let publisher = document.getElementById("publisher").value.trim();
let year = document.getElementById("year").value.trim();


if (!name || !isbn) return alert("Book name and ISBN required");


let books = JSON.parse(localStorage.getItem("books") || "[]");
books.push({ name, isbn, author, publisher, year, borrowed: false });


localStorage.setItem("books", JSON.stringify(books));
alert("Book saved!");
}


function borrowBook() {
let student = document.getElementById("borrowStudent").value.trim();
let book = document.getElementById("borrowBook").value.trim();
let date = document.getElementById("borrowDate").value;


if (!student || !book || !date) return alert("Fill all fields");


let borrows = JSON.parse(localStorage.getItem("borrows") || "[]");
borrows.push({ student, book, date });


let books = JSON.parse(localStorage.getItem("books") || "[]");
let b = books.find(x => x.name === book);
if (b) b.borrowed = true;


localStorage.setItem("books", JSON.stringify(books));
localStorage.setItem("borrows", JSON.stringify(borrows));


alert("Borrow logged!");
}


function returnBook() {
let book = document.getElementById("returnBook").value.trim();
if (!book) return alert("Enter book title");


let books = JSON.parse(localStorage.getItem("books") || "[]");
let b = books.find(x => x.name === book);
if (b) b.borrowed = false;


localStorage.setItem("books", JSON.stringify(books));
alert("Book returned!");
}


function displayAll() {
let students = JSON.parse(localStorage.getItem("students") || "[]");
</script>
