// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onChildRemoved, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Admin Login (You)
signInWithEmailAndPassword(auth, "YOUR_EMAIL", "YOUR_PASSWORD")
    .then(() => {
        console.log("Admin logged in successfully!");
    })
    .catch((error) => {
        console.error("Error logging in:", error.message);
    });

// References
const confessionForm = document.getElementById("confessionForm");
const confessionInput = document.getElementById("confessionInput");
const confessionList = document.getElementById("confessionList");

// Store confession elements by their Firebase key
const confessionElements = {};

// Add a new confession
confessionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const confessionText = confessionInput.value.trim();

    if (confessionText) {
        const confessionsRef = ref(database, "confessions");
        push(confessionsRef, {
            text: confessionText,
            timestamp: Date.now()
        });
        confessionInput.value = ""; // Clear input field
    } else {
        alert("Confession cannot be empty!");
    }
});

// Display confessions when added
const confessionsRef = ref(database, "confessions");
onChildAdded(confessionsRef, (data) => {
    const confessionData = data.val();
    const confessionKey = data.key;

    // Create a confession element
    const confessionElement = document.createElement("div");
    confessionElement.classList.add("confession");
    confessionElement.textContent = confessionData.text;

    // Add delete button (only for admin)
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => {
        remove(ref(database, `confessions/${confessionKey}`))
            .then(() => {
                console.log("Confession deleted successfully.");
            })
            .catch((error) => {
                console.error("Error deleting confession:", error.message);
            });
    };

    confessionElement.appendChild(deleteButton);
    confessionList.insertBefore(confessionElement, confessionList.firstChild); // Add newest on top

    // Save the element reference
    confessionElements[confessionKey] = confessionElement;
});

// Handle deletions
onChildRemoved(confessionsRef, (data) => {
    const confessionKey = data.key;

    // Remove the element from the DOM
    const confessionElement = confessionElements[confessionKey];
    if (confessionElement) {
        confessionElement.remove();
        delete confessionElements[confessionKey];
    }
});