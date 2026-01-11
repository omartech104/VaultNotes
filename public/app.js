const BASE_URL = 'http://localhost:3000';
let isLogin = true;

// --- AUTH LOGIC ---
function toggleAuth() {
    isLogin = !isLogin;
    document.getElementById('signup-fields').classList.toggle('hidden');
    document.getElementById('auth-title').innerText = isLogin ? "VaultNotes" : "Create Account";
    document.getElementById('auth-btn').innerText = isLogin ? "Login" : "Sign Up";
    document.getElementById('toggle-text').innerText = isLogin ? "New here?" : "Already have an account?";
    document.getElementById('toggle-link').innerText = isLogin ? "Create account" : "Login";
}

async function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const path = isLogin ? '/auth/login' : '/auth/register';
    const body = isLogin ? { email, password } : { email, password, username };

    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            if (isLogin) {
                showDashboard();
            } else {
                alert("Account created! Now login.");
                toggleAuth();
            }
        } else {
            const err = await res.json();
            alert(err.message || "Auth failed");
        }
    } catch (e) {
        alert("Server error. Is NestJS running?");
    }
}

// --- DASHBOARD LOGIC ---
function showDashboard() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('notes-section').classList.remove('hidden');
    fetchNotes();
}

async function fetchNotes() {
    const res = await fetch(`${BASE_URL}/notes`);
    const notes = await res.json();
    const grid = document.getElementById('notes-grid');
    
    grid.innerHTML = notes.map(note => `
        <div class="note-card bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
            <div>
                <h3 class="font-bold text-lg mb-2 truncate">${note.title}</h3>
                <p class="text-gray-500 text-sm line-clamp-3 mb-4">${note.content}</p>
            </div>
            <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                <button onclick="viewNote(${note.id})" class="text-yellow-600 font-bold text-sm hover:underline">View</button>
                <button onclick="deleteNote(${note.id})" class="text-red-400 hover:text-red-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    `).join('');
}

async function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    fetchNotes();
}

async function deleteNote(id) {
    await fetch(`${BASE_URL}/notes/${id}/delete`, { method: 'POST' });
    fetchNotes();
}

// --- MODAL LOGIC ---
async function viewNote(id) {
    const res = await fetch(`${BASE_URL}/notes/${id}`);
    const note = await res.json();
    
    document.getElementById('modal-title').innerText = note.title;
    document.getElementById('modal-content').innerText = note.content;
    document.getElementById('view-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('view-modal').classList.add('hidden');
}

function logout() {
    window.location.reload();
}