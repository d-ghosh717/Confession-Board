// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT-zvpgBlED0MyEEm2XLUKeKwDriPb9S8",
  authDomain: "confession-board.firebaseapp.com",
  databaseURL: "https://confession-board-default-rtdb.firebaseio.com",
  projectId: "confession-board",
  storageBucket: "confession-board.firebasestorage.app",
  messagingSenderId: "603725575015",
  appId: "1:603725575015:web:b5321c5b1df0dc0f97f5c2"
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

// Display confessions and add delete functionality
const confessionsRef = ref(database, "confessions");
onChildAdded(confessionsRef, (data) => {
    const confessionData = data.val();
    const confessionElement = document.createElement("div");
    confessionElement.classList.add("confession");
    confessionElement.textContent = confessionData.text;

    // Add delete button (only for admin)
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = () => {
        remove(ref(database, `confessions/${data.key}`))
            .then(() => {
                confessionElement.remove();
                console.log("Confession deleted successfully.");
            })
            .catch((error) => {
                console.error("Error deleting confession:", error.message);
            });
    };

    confessionElement.appendChild(deleteButton);
    confessionList.insertBefore(confessionElement, confessionList.firstChild); // Add newest on top
});