 // Register user
 document.getElementById('registerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.msg || 'Registration failed');
            return;
        }

        const data = await response.json();
        alert(`Registration successful! Welcome, ${data.user.name}`);
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
    }
});

//login user
document.getElementById('loginForm')?.addEventListener('submit',async(event)=>{

    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/v1/auth/login',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email,password})
        })
       
        
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.msg || 'Login failed');
            return;
        }
        const data = await response.json()

        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error during logging:', error);
        alert('An error occurred. Please try again later.');
    }
})
