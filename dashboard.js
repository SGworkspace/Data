import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, orderBy, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

class StudentDashboard {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        this.students = [];
        this.init();
    }

    async init() {
        await this.loadStudents();
        this.bindEvents();
        this.updateStats();
        this.renderTable();
    }

    bindEvents() {
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterStudents(e.target.value);
        });
    }

    async loadStudents() {
        try {
            const q = query(collection(this.db, 'students'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            this.students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    updateStats() {
        document.getElementById('totalStudents').textContent = this.students.length;
    }

    renderTable(filteredStudents = this.students) {
        const tbody = document.getElementById('studentsBody');
        tbody.innerHTML = '';

        filteredStudents.forEach(student => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${student.name}</strong></td>
                <td>${student.class}</td>
                <td>${student.rollNo}</td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td>${student.phone || '-'}</td>
                <td>${student.createdAt ? new Date(student.createdAt.toDate()).toLocaleDateString() : 'N/A'}</td>
            `;
        });
    }

    filterStudents(searchTerm) {
        const filtered = this.students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderTable(filtered);
    }
}

new StudentDashboard();