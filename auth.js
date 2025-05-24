// Check if user is already logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
}

// Handle Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store current user
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                name: user.name
            }));
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid email or password';
        }
    });
}

// Handle Registration
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorMessage = document.getElementById('error-message');

        // Validate passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            errorMessage.textContent = 'Email already registered';
            return;
        }

        // Add new user
        users.push({
            name,
            email,
            password
        });

        // Save users
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after registration
        localStorage.setItem('currentUser', JSON.stringify({
            email,
            name
        }));

        window.location.href = 'index.html';
    });
}

// Check authentication on page load
checkAuth(); 