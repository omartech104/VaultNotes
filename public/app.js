const API_URL = 'http://localhost:3000';
let isLogin = true;
let currentEditingId = null;

// --- AUTHENTICATION ---
function toggleAuth() {
    isLogin = !isLogin;
    document.getElementById('reg-field').classList.toggle('hidden');
    document.getElementById('auth-title').innerText = isLogin ? 'VAULTNOTES' : 'JOIN VAULT';
    document.getElementById('auth-btn').innerText = isLogin ? 'Login' : 'Create Account';
    document.getElementById('toggle-link').innerText = isLogin ? 'Create account' : 'Login';
}

async function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin ? { email, password } : { email, password, username };

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('v_user_id', data.id);
            showDashboard();
        } else {
            alert(data.message || "Authentication failed");
        }
    } catch (e) { alert("Server connection failed."); }
}

// --- DASHBOARD & CRUD ---
function showDashboard() {
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('dash-page').classList.remove('hidden');
    loadNotes();
}

async function loadNotes() {
    const userId = localStorage.getItem('v_user_id');
    const res = await fetch(`${API_URL}/notes/user/${userId}`);
    const notes = await res.json();
    
    const grid = document.getElementById('notes-grid');
    grid.innerHTML = notes.map(note => `
        <div onclick="openEditModal(${note.id})" class="note-card flex flex-col justify-between">
            <div>
                <h3 class="font-bold text-lg text-gray-800 mb-2 truncate">${note.title || 'No Title'}</h3>
                <p class="text-gray-500 text-sm line-clamp-3">${note.content || 'No content'}</p>
            </div>
            <div class="mt-4 text-xs text-gray-300 font-medium uppercase tracking-widest">
                Last updated: ${new Date(note.updatedAt).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

async function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const userId = localStorage.getItem('v_user_id');

    if (!title && !content) return;

    await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId: Number(userId) })
    });

    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    loadNotes();
}

// --- EDIT & DELETE LOGIC ---
async function openEditModal(id) {
    currentEditingId = id;
    const res = await fetch(`${API_URL}/notes/${id}`);
    const note = await res.json();

    document.getElementById('edit-title').value = note.title;
    document.getElementById('edit-content').value = note.content;
    document.getElementById('view-modal').classList.remove('hidden');

    // Attach click handler for saving
    document.getElementById('save-edit-btn').onclick = () => updateNote(id);
}

async function updateNote(id) {
    const title = document.getElementById('edit-title').value;
    const content = document.getElementById('edit-content').value;

    try {
        const res = await fetch(`${API_URL}/notes/${id}`, {
            method: 'PATCH', // Matches your @Patch(':id') controller
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });

        if (res.ok) {
            closeModal();
            loadNotes();
        }
    } catch (e) { alert("Failed to update note"); }
}

async function deleteNoteFromModal() {
    if (!confirm("Delete this note?")) return;
    
    try {
        const res = await fetch(`${API_URL}/notes/${currentEditingId}/delete`, {
            method: 'POST' // Matches your @Post(':id/delete') controller
        });

        if (res.ok) {
            closeModal();
            loadNotes();
        }
    } catch (e) { alert("Failed to delete note"); }
}

function closeModal() {
    document.getElementById('view-modal').classList.add('hidden');
    currentEditingId = null;
}

function logout() {
    localStorage.clear();
    window.location.reload();
}

if (localStorage.getItem('v_user_id')) showDashboard();