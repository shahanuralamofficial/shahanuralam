function validateForm() {
    var fName = document.getElementById("fName").value;
    var lName = document.getElementById("lName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (!fName || !lName || !email || !password || !confirmPassword) {
        alert("Please fill the form completely.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }

    return true;
}

function checkPasswordMatch() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var message = document.getElementById("passwordMatchMessage");

    if (password === confirmPassword) {
        message.style.color = "#4CAF50";
        message.innerHTML = "Passwords match!";
    } else {
        message.style.color = "#f44336";
        message.innerHTML = "Passwords do not match!";
    }
}

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var confirmPasswordInput = document.getElementById("confirmPassword");
    var checkbox = document.querySelector('input[type="checkbox"]');

    if (checkbox.checked) {
        passwordInput.type = "text";
        confirmPasswordInput.type = "text";
    } else {
        passwordInput.type = "password";
        confirmPasswordInput.type = "password";
    }
}
