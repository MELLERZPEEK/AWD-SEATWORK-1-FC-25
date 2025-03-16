document.addEventListener("DOMContentLoaded", () => {
    let user = localStorage.getItem("user");
    let balance = localStorage.getItem("balance");
    let history = JSON.parse(localStorage.getItem("transactions")) || [];

    if (user) {
        document.getElementById("user").innerText = user;
        document.getElementById("balance").innerText = balance || 10000;
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-container").style.display = "block";
        updateHistory(history);
    }
});

function login() {
    let username = document.getElementById("username").value.trim();
    if (username === "") {
        alert("Please enter a username.");
        return;
    }
    localStorage.setItem("user", username);
    localStorage.setItem("balance", "10000"); // Starting balance ₱10,000
    localStorage.setItem("transactions", JSON.stringify([]));

    document.getElementById("user").innerText = username;
    document.getElementById("balance").innerText = "10000";
    document.getElementById("login-container").style.display = "none";
    document.getElementById("main-container").style.display = "block";
}

function updateBalance(amount) {
    localStorage.setItem("balance", amount);
    document.getElementById("balance").innerText = amount;
}

function showError(message) {
    document.getElementById("error").innerText = message;
    setTimeout(() => { document.getElementById("error").innerText = ""; }, 3000);
}

function cashIn() {
    let amount = parseFloat(document.getElementById("amount").value);
    let balance = parseFloat(localStorage.getItem("balance")) || 10000;
    let history = JSON.parse(localStorage.getItem("transactions")) || [];

    if (isNaN(amount) || amount <= 0) {
        showError("Enter a valid amount!");
        return;
    }

    balance += amount;
    updateBalance(balance);

    history.push({ type: "Deposit", amount: amount });
    localStorage.setItem("transactions", JSON.stringify(history));

    updateHistory(history);
    document.getElementById("amount").value = "";
}

function cashOut() {
    let amount = parseFloat(document.getElementById("amount").value);
    let receiver = document.getElementById("receiver").value.trim();
    let balance = parseFloat(localStorage.getItem("balance")) || 10000;
    let history = JSON.parse(localStorage.getItem("transactions")) || [];

    // Validate receiver's name (only letters and spaces, at least two characters)
    let nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(receiver) || receiver.length < 2) {
        showError("Receiver's name must contain only letters and spaces, and be at least 2 characters long!");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showError("Enter a valid amount!");
        return;
    }
    if (amount > balance) {
        showError("Insufficient balance!");
        return;
    }
    if (receiver === "") {
        showError("Enter a receiver's name!");
        return;
    }

    balance -= amount;
    updateBalance(balance);

    history.push({ type: "Withdraw", amount: amount, receiver: receiver });
    localStorage.setItem("transactions", JSON.stringify(history));

    updateHistory(history);
    document.getElementById("amount").value = "";
    document.getElementById("receiver").value = "";
}

function updateHistory(history) {
    let historyList = document.getElementById("transaction-history");
    historyList.innerHTML = "";

    history.forEach(entry => {
        let li = document.createElement("li");
        li.className = entry.type === "Deposit" ? "transaction-deposit" : "transaction-withdraw";
        li.innerText = entry.type === "Deposit" 
            ? `Deposit: ₱${entry.amount}`
            : `Sent ₱${entry.amount} to ${entry.receiver}`;
        historyList.appendChild(li);
    });
}

function logout() {
    localStorage.clear();
    location.reload();
}
