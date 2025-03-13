document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update tab buttons
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
        });
    });
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        showWelcomeSection();
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');
        
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageEl.textContent = data.message;
                messageEl.className = 'message success';
                
                // Save token and show welcome section
                localStorage.setItem('token', data.token);
                showWelcomeSection();
                
                // Clear form
                loginForm.reset();
            } else {
                messageEl.textContent = data.error;
                messageEl.className = 'message error';
            }
        } catch (error) {
            messageEl.textContent = 'An error occurred. Please try again.';
            messageEl.className = 'message error';
            console.error('Error:', error);
        }
    });
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const messageEl = document.getElementById('signup-message');
        
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                messageEl.textContent = data.message;
                messageEl.className = 'message success';
                
                // Clear form
                signupForm.reset();
                
                // Switch to login tab after successful signup
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                }, 2000);
            } else {
                messageEl.textContent = data.error;
                messageEl.className = 'message error';
            }
        } catch (error) {
            messageEl.textContent = 'An error occurred. Please try again.';
            messageEl.className = 'message error';
            console.error('Error:', error);
        }
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('token');
        hideWelcomeSection();
    });
    
    function showWelcomeSection() {
        // Parse the token to get user info
        const token = localStorage.getItem('token');
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        
        // Set user name
        document.getElementById('user-name').textContent = payload.name;
        
        // Hide forms and show welcome section
        document.querySelector('.tab-container').classList.add('hidden');
        document.getElementById('welcome-section').classList.remove('hidden');
    }
    
    function hideWelcomeSection() {
        // Show forms and hide welcome section
        document.querySelector('.tab-container').classList.remove('hidden');
        document.getElementById('welcome-section').classList.add('hidden');
    }
});