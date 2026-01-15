// Selección de elementos
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Renderiza la lista
function render() {
  list.innerHTML = '';
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = t.done ? 'completed' : '';
    li.innerHTML = `
      <div class="left">
        <input type="checkbox" ${t.done ? 'checked' : ''} data-i="${i}" class="chk" />
        <span>${escapeHtml(t.text)}</span>
      </div>
      <div class="actions">
        <button data-i="${i}" class="edit">Editar</button>
        <button data-i="${i}" class="del">Eliminar</button>
      </div>`;
    list.appendChild(li);
  });
}

// Guarda en localStorage
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Añadir tarea
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = '';
  save();
  render();
});

// Delegación de eventos para editar, eliminar y marcar
list.addEventListener('click', (e) => {
  const i = e.target.dataset.i;
  if (e.target.classList.contains('del')) {
    tasks.splice(i,1);
    save(); render();
  } else if (e.target.classList.contains('edit')) {
    const newText = prompt('Editar tarea', tasks[i].text);
    if (newText !== null) { tasks[i].text = newText.trim(); save(); render(); }
  } else if (e.target.classList.contains('chk')) {
    tasks[i].done = e.target.checked;
    save(); render();
  }
});

// Borrar todo
clearBtn.addEventListener('click', () => {
  if (!confirm('Borrar todas las tareas?')) return;
  tasks = []; save(); render();
});

// Escape para evitar inyección
function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Inicializa
render();
