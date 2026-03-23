import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

class StudentDataEntry {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        this.auth = getAuth(this.app);
        this.init();
    }

    async init() {
        await this.signInAnonymously();
        this.bindEvents();
    }

    async signInAnonymously() {
        try {
            await signInAnonymously(this.auth);
            console.log('Signed in anonymously');
        } catch (error) {
            console.error('Auth error:', error);
        }
    }

    bindEvents() {
        document.getElementById('studentForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('dashboardBtn').addEventListener('click', () => this.goToDashboard());
    }

    async handleSubmit(e) {
        e.preventDefault();
        const showMessage = (type, text) => {
            const msg = document.getElementById('message');
            msg.textContent = text;
            msg.className = `message ${type}`;
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 3000);
        };

        try {
            const studentData = {
                name: document.getElementById('name').value,
                age: parseInt(document.getElementById('age').value),
                gender: document.getElementById('gender').value,
                class: document.getElementById('class').value,
                rollNo: document.getElementById('rollNo').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(this.db, 'students'), studentData);

            showMessage('success', '✅ Student data saved successfully!');
            document.getElementById('studentForm').reset();

        } catch (error) {
            console.error('Error:', error);
            showMessage('error', '❌ Error saving data. Try again!');
        }
    }

    goToDashboard() {
        window.location.href = 'dashboard.html';
    }
}

// Initialize app
new StudentDataEntry();