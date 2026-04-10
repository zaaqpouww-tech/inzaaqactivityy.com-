// State
let logs = JSON.parse(localStorage.getItem('pkl_logs')) || [
    { id: 1, date: '2024-03-20', activity: 'Instalasi Server Linux', status: 'Selesai', note: 'Menggunakan Ubuntu Server 22.04' },
    { id: 2, date: '2024-03-21', activity: 'Konfigurasi Nginx', status: 'Dalam Proses', note: 'Setting reverse proxy untuk aplikasi' }
];

let currentView = 'dashboard';
let editingId = null;

// DOM Elements
const contentArea = document.getElementById('contentArea');
const addLogBtn = document.getElementById('addLogBtn');
const logModal = document.getElementById('logModal');
const logForm = document.getElementById('logForm');
const closeModalBtns = document.querySelectorAll('.close-modal');
const navItems = document.querySelectorAll('.nav-item');
const globalSearch = document.getElementById('globalSearch');

// Initialize
function init() {
    renderView();
    setupEventListeners();
    lucide.createIcons();
}

// Event Listeners
function setupEventListeners() {
    addLogBtn.addEventListener('click', () => openModal());
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => closeModal());
    });

    logForm.addEventListener('submit', handleFormSubmit);

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentView = item.getAttribute('data-view');
            renderView();
        });
    });

    globalSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if (currentView === 'logs') {
            renderLogs(term);
        } else if (currentView === 'dashboard') {
            renderDashboard(term);
        }
    });
}

// View Rendering
function renderView() {
    if (currentView === 'dashboard') {
        renderDashboard();
    } else if (currentView === 'logs') {
        renderLogs();
    } else if (currentView === 'profile') {
        renderProfile();
    }
    lucide.createIcons();
}

function renderDashboard(searchTerm = '') {
    const filteredLogs = logs.filter(l => 
        l.activity.toLowerCase().includes(searchTerm) || 
        l.note.toLowerCase().includes(searchTerm)
    );

    const totalLogs = logs.length;
    const completedLogs = logs.filter(l => l.status === 'Selesai').length;
    const pendingLogs = logs.filter(l => l.status === 'Dalam Proses').length;

    contentArea.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon primary"><i data-lucide="book"></i></div>
                </div>
                <div class="stat-value">${totalLogs}</div>
                <div class="stat-label">Total Jurnal</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon success"><i data-lucide="check-circle"></i></div>
                </div>
                <div class="stat-value">${completedLogs}</div>
                <div class="stat-label">Selesai</div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon warning"><i data-lucide="clock"></i></div>
                </div>
                <div class="stat-value">${pendingLogs}</div>
                <div class="stat-label">Sedang Proses</div>
            </div>
        </div>

        <div class="content-card">
            <div class="card-header">
                <h3>Aktivitas Terbaru</h3>
                <button class="btn btn-secondary" onclick="changeView('logs')">Lihat Semua</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Kegiatan</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredLogs.slice(0, 5).map(log => `
                        <tr>
                            <td>${formatDate(log.date)}</td>
                            <td style="font-weight: 500;">${log.activity}</td>
                            <td><span class="badge ${getStatusClass(log.status)}">${log.status}</span></td>
                        </tr>
                    `).join('')}
                    ${filteredLogs.length === 0 ? '<tr><td colspan="3" style="text-align:center; padding: 40px;">Belum ada data kegiatan.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
}

function renderLogs(searchTerm = '') {
    const filteredLogs = logs.filter(l => 
        l.activity.toLowerCase().includes(searchTerm) || 
        l.note.toLowerCase().includes(searchTerm)
    );

    contentArea.innerHTML = `
        <div class="content-card">
            <div class="card-header">
                <h3>Daftar Jurnal PKL</h3>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Kegiatan</th>
                        <th>Keterangan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredLogs.map(log => `
                        <tr>
                            <td>${formatDate(log.date)}</td>
                            <td style="font-weight: 500;">${log.activity}</td>
                            <td style="color: var(--text-secondary); max-width: 250px;">${log.note}</td>
                            <td><span class="badge ${getStatusClass(log.status)}">${log.status}</span></td>
                            <td class="actions-cell">
                                <button class="btn-table edit" onclick="editLog(${log.id})"><i data-lucide="edit-3"></i></button>
                                <button class="btn-table delete" onclick="deleteLog(${log.id})"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                    ${filteredLogs.length === 0 ? '<tr><td colspan="5" style="text-align:center; padding: 40px;">Tidak ada data ditemukan.</td></tr>' : ''}
                </tbody>
            </table>
        </div>
    `;
    lucide.createIcons();
}

function renderProfile() {
    contentArea.innerHTML = `
        <div class="content-card" style="padding: 40px; text-align: center;">
            <div class="avatar" style="width: 100px; height: 100px; font-size: 2.5rem; margin: 0 auto 24px;">Z</div>
            <h2 style="margin-bottom: 8px;">Zaki</h2>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">Siswa SMK Informatika - Bidang Keahlian Rekayasa Perangkat Lunak</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; text-align: left; max-width: 600px; margin: 0 auto;">
                <div class="stat-card">
                    <p class="stat-label">Nama Perusahaan</p>
                    <p style="font-weight: 600;">PT Solusi Digital Kreatif</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Pembimbing Industri</p>
                    <p style="font-weight: 600;">Bpk. Ahmad Suhendar</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Periode PKL</p>
                    <p style="font-weight: 600;">Januari 2024 - Maret 2024</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Progress Laporan</p>
                    <p style="font-weight: 600;">85% Complete</p>
                </div>
            </div>
        </div>
    `;
}

// Helpers
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function getStatusClass(status) {
    if (status === 'Selesai') return 'badge-success';
    if (status === 'Dalam Proses') return 'badge-warning';
    return 'badge-danger';
}

function saveLogs() {
    localStorage.setItem('pkl_logs', JSON.stringify(logs));
}

function changeView(view) {
    currentView = view;
    navItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === view);
    });
    renderView();
}

// Modal CRUD Logic
function openModal(log = null) {
    if (log) {
        editingId = log.id;
        document.getElementById('modalTitle').innerText = 'Edit Jurnal PKL';
        document.getElementById('logId').value = log.id;
        document.getElementById('logDate').value = log.date;
        document.getElementById('logActivity').value = log.activity;
        document.getElementById('logStatus').value = log.status;
        document.getElementById('logNote').value = log.note;
    } else {
        editingId = null;
        document.getElementById('modalTitle').innerText = 'Tambah Jurnal PKL';
        logForm.reset();
        document.getElementById('logDate').value = new Date().toISOString().split('T')[0];
    }
    logModal.classList.add('active');
    lucide.createIcons();
}

function closeModal() {
    logModal.classList.remove('active');
    editingId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const newLog = {
        id: editingId || Date.now(),
        date: document.getElementById('logDate').value,
        activity: document.getElementById('logActivity').value,
        status: document.getElementById('logStatus').value,
        note: document.getElementById('logNote').value
    };

    if (editingId) {
        logs = logs.map(l => l.id === editingId ? newLog : l);
    } else {
        logs.unshift(newLog);
    }

    saveLogs();
    renderView();
    closeModal();
}

window.editLog = function(id) {
    const log = logs.find(l => l.id === id);
    if (log) openModal(log);
}

window.deleteLog = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        logs = logs.filter(l => l.id !== id);
        saveLogs();
        renderView();
    }
}

window.changeView = changeView;

// Start the app
init();
