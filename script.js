document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Initialize page-specific functionality
    if (document.getElementById('branchSelect')) {
        document.getElementById('branchSelect').addEventListener('change', loadBooks);
    }
    if (document.getElementById('bookGrid')) {
        renderBooks();
    }
    if (document.getElementById('cartItems')) {
        renderCartItems();
    }
});

// Books Data
const books = [
    { 
        id: 1, 
        name: "C Programming: The Ultimate Guide", 
        author: "Dennis Ritchie", 
        pages: 450, 
        genre: "Programming", 
        branch: "CSE", 
        price: 599, 
        image: "c-programming.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 2, 
        name: "Python for Data Science", 
        author: "Jake VanderPlas", 
        pages: 520, 
        genre: "Data Science", 
        branch: "CSE", 
        price: 799, 
        image: "python-ds.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 3, 
        name: "Digital Electronics Fundamentals", 
        author: "Morris Mano", 
        pages: 680, 
        genre: "Electronics", 
        branch: "ECE", 
        price: 699, 
        image: "digital-electronics.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 4, 
        name: "Microprocessor Architecture", 
        author: "Ramesh Gaonkar", 
        pages: 720, 
        genre: "Embedded Systems", 
        branch: "ECE", 
        price: 899, 
        image: "microprocessor.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 5, 
        name: "Power System Analysis", 
        author: "John Grainger", 
        pages: 850, 
        genre: "Electrical Engineering", 
        branch: "EEE", 
        price: 999, 
        image: "power-systems.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 6, 
        name: "Electrical Machines", 
        author: "P.S. Bimbhra", 
        pages: 920, 
        genre: "Electrical Engineering", 
        branch: "EEE", 
        price: 1099, 
        image: "electrical-machines.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 7, 
        name: "Structural Analysis", 
        author: "R.C. Hibbeler", 
        pages: 880, 
        genre: "Civil Engineering", 
        branch: "CIVIL", 
        price: 1199, 
        image: "structural-analysis.jpg",
        samplePDF: "sample/CP.pdf" 
    },
    { 
        id: 8, 
        name: "Concrete Technology", 
        author: "M.S. Shetty", 
        pages: 750, 
        genre: "Construction", 
        branch: "CIVIL", 
        price: 899, 
        image: "concrete-tech.jpg",
        samplePDF: "sample/CP.pdf" 
    }
];

// Cart Functions
function addToCart(bookId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === bookId);
    
    if (existingItem) existingItem.quantity += 1;
    else cart.push({ id: bookId, quantity: 1 });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartButtonState(bookId);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = cart.length);
}

function updateCartButtonState(bookId) {
    const btn = document.querySelector(`.book-card button[onclick="addToCart(${bookId})"]`);
    if (btn) {
        btn.classList.add('added');
        btn.textContent = 'Added to Cart';
        btn.disabled = true;
    }
}

// Book Rendering
function renderBooks(filterBranch = 'all') {
    const container = document.getElementById('bookGrid');
    if (!container) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    container.innerHTML = '';

    books.filter(book => filterBranch === 'all' || book.branch === filterBranch).forEach(book => {
        const isInCart = cart.some(item => item.id === book.id);
        container.innerHTML += `
            <div class="book-card ${book.branch}">
                <div class="book-content">
                    <h3 class="book-title">${book.name}</h3>
                    <p class="book-author">By ${book.author}</p>
                    <div class="book-meta">
                        <span class="book-badge pages-badge">📖 ${book.pages} Pages</span>
                        <span class="book-badge genre-badge">${book.genre}</span>
                        <span class="book-badge branch-badge">${book.branch}</span>
                    </div>
                    <div class="book-price">₹${book.price}</div>
                    <div class="book-actions">
                        <button class="book-btn add-to-cart ${isInCart ? 'added' : ''}" 
                                onclick="addToCart(${book.id})" ${isInCart ? 'disabled' : ''}>
                            ${isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                        <button class="book-btn read-sample" onclick="readBook(${book.id})">Read Sample</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Filter Functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderBooks(btn.dataset.branch);
    });
});

// Cart Page Functions
function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart"><h3>Your cart is empty</h3><p>Browse our collection and add some books!</p></div>`;
        updateCartSummary(0);
        return;
    }

    container.innerHTML = cart.map(item => {
        const book = books.find(b => b.id === item.id);
        if (!book) return '';
        return `
            <div class="cart-item">
                <div class="item-image"></div>
                <div class="item-details">
                    <h4 class="item-title">${book.name}</h4>
                    <p class="item-author">${book.author}</p>
                    <div class="item-meta">
                        <p>Genre: ${book.genre}</p>
                        <p class="item-price">Price: ₹${book.price}</p>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, 0, this.value)">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <span class="remove-btn" onclick="removeFromCart(${item.id})">Remove</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    updateCartSummary();
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (books.find(b => b.id === item.id)?.price * item.quantity || 0), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

function updateQuantity(bookId, change, newValue) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === bookId);
    if (index === -1) return;
    
    cart[index].quantity = newValue !== undefined ? parseInt(newValue) || 1 : Math.max(1, cart[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function removeFromCart(bookId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert('Your cart is empty!');
    if (!localStorage.getItem('currentUser')) return alert('Please login to complete your purchase!');
    
    if (confirm('Proceed to payment?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        alert('Order placed successfully!');
        window.location.href = 'index.html';
    }
}

// Login and Registration
document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    localStorage.setItem('currentUser', 'loggedIn');
    window.location.href = 'index.html';
});

document.getElementById('registerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) return alert('Passwords do not match!');
    
    const user = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('registerEmail').value,
        branch: document.getElementById('branch').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value)
    };
    
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('currentUser', user.email);
    window.location.href = 'index.html';
});

// Password Strength Indicator
document.getElementById('registerPassword')?.addEventListener('input', e => {
    const strengthBar = document.querySelector('.password-strength-bar');
    const strength = Math.min(e.target.value.length * 10, 100);
    strengthBar.style.width = strength + '%';
    strengthBar.style.background = strength < 40 ? '#e74c3c' : strength < 70 ? '#f1c40f' : '#2ecc71';
});

// Sample PDF Viewer (Placeholder)
function readBook(bookId) {
    alert('Sample PDF viewer would open here');
}



// Update the loadBooks function for homepage
function loadBooks() {
    const branch = document.getElementById('branchSelect').value;
    const container = document.getElementById('bookContainer');
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    container.innerHTML = '';

    // Filter books by selected branch
    const filteredBooks = books.filter(book => book.branch === branch);

    if (filteredBooks.length === 0) {
        container.innerHTML = `<div class="empty-message">No books found for this branch.</div>`;
        return;
    }

    // Render books in card format
    filteredBooks.forEach(book => {
        const isInCart = cart.some(item => item.id === book.id);
        container.innerHTML += `
            <div class="book-card ${book.branch}">
                <div class="book-content">
                    <h3 class="book-title">${book.name}</h3>
                    <p class="book-author">By ${book.author}</p>
                    <div class="book-meta">
                        <span class="book-badge pages-badge">📖 ${book.pages} Pages</span>
                        <span class="book-badge genre-badge">${book.genre}</span>
                        <span class="book-badge branch-badge">${book.branch}</span>
                    </div>
                    <div class="book-price">₹${book.price}</div>
                    <div class="book-actions">
                        <button class="book-btn add-to-cart ${isInCart ? 'added' : ''}" 
                                onclick="addToCart(${book.id})" ${isInCart ? 'disabled' : ''}>
                            ${isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                        <button class="book-btn read-sample" onclick="readBook(${book.id})">Read Sample</button>
                    </div>
                </div>
            </div>
        `;
    });
}



// PDF Viewer Functionality
function readBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfViewer');
    
    // Set the iframe source to the PDF file
    iframe.src = book.samplePDF;
    modal.style.display = "block";

    // Close modal when clicking X
    document.querySelector('.close-modal').onclick = () => {
        modal.style.display = "none";
        iframe.src = ""; // Clear the iframe source
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            iframe.src = ""; // Clear the iframe source
        }
    };
}