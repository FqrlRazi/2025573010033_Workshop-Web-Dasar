const STORAGE_KEY = 'tugasModul6';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const inputError = document.getElementById('inputError');
const taskList = document.getElementById('taskList');
const remainingCount = document.getElementById('remainingCount');
const filterButtons = document.querySelectorAll('.filter-button');
const clearCompletedButton = document.getElementById('clearCompleted');

let tasks = [];
let activeFilter = 'semua';
let dragSourceId = null;

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : [];
}

function validateTask(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 'Tugas tidak boleh kosong.';
  }
  if (trimmed.length < 3) {
    return 'Tugas minimal 3 karakter.';
  }
  if (trimmed.length > 100) {
    return 'Tugas maksimal 100 karakter.';
  }
  return '';
}

function getRemainingCount() {
  return tasks.filter(task => !task.completed).length;
}

function filterTasks() {
  if (activeFilter === 'aktif') {
    return tasks.filter(task => !task.completed);
  }
  if (activeFilter === 'selesai') {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

function sortPriorityLabel(priority) {
  return priority === 'tinggi' ? 'Tinggi' : priority === 'rendah' ? 'Rendah' : 'Sedang';
}

function createTaskItem(task) {
  const listItem = document.createElement('li');
  listItem.className = 'task-item';
  listItem.dataset.id = task.id;
  listItem.dataset.priority = task.priority;
  listItem.draggable = true;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTaskCompleted(task.id));

  const label = document.createElement('label');
  label.appendChild(checkbox);

  const taskText = document.createElement('p');
  taskText.className = 'task-text';
  taskText.textContent = task.text;
  if (task.completed) {
    taskText.classList.add('completed');
  }
  taskText.addEventListener('dblclick', () => beginTaskEdit(task.id, taskText));

  label.appendChild(taskText);

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  meta.innerHTML = `
    <span class="priority-pill">${sortPriorityLabel(task.priority)}</span>
    <span>${task.completed ? 'Selesai' : 'Aktif'}</span>
  `;

  const taskMain = document.createElement('div');
  taskMain.className = 'task-main';
  taskMain.appendChild(label);
  taskMain.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const prioritySelect = document.createElement('select');
  prioritySelect.className = 'priority-select';
  prioritySelect.innerHTML = `
    <option value="rendah" ${task.priority === 'rendah' ? 'selected' : ''}>Rendah</option>
    <option value="sedang" ${task.priority === 'sedang' ? 'selected' : ''}>Sedang</option>
    <option value="tinggi" ${task.priority === 'tinggi' ? 'selected' : ''}>Tinggi</option>
  `;
  prioritySelect.addEventListener('change', () => updateTaskPriority(task.id, prioritySelect.value));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => deleteTask(task.id));

  actions.appendChild(prioritySelect);
  actions.appendChild(deleteButton);

  listItem.appendChild(taskMain);
  listItem.appendChild(actions);

  listItem.addEventListener('dragstart', () => {
    dragSourceId = task.id;
    listItem.classList.add('dragging');
  });

  listItem.addEventListener('dragend', () => {
    listItem.classList.remove('dragging');
    dragSourceId = null;
  });

  listItem.addEventListener('dragover', event => {
    event.preventDefault();
    listItem.classList.add('drag-over');
  });

  listItem.addEventListener('dragleave', () => {
    listItem.classList.remove('drag-over');
  });

  listItem.addEventListener('drop', event => {
    event.preventDefault();
    listItem.classList.remove('drag-over');
    const targetId = Number(listItem.dataset.id);
    if (dragSourceId !== null && dragSourceId !== targetId) {
      moveTask(dragSourceId, targetId);
    }
  });

  return listItem;
}

function renderTasks() {
  taskList.innerHTML = '';
  const visibleTasks = filterTasks();
  remainingCount.textContent = getRemainingCount();

  if (visibleTasks.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = 'Belum ada tugas yang sesuai kriteria.';
    taskList.appendChild(emptyMessage);
    return;
  }

  visibleTasks.forEach(task => taskList.appendChild(createTaskItem(task)));
}

function addTask(text, priority) {
  const errorMessage = validateTask(text);
  if (errorMessage) {
    inputError.textContent = errorMessage;
    return;
  }

  inputError.textContent = '';
  tasks.push({
    id: Date.now(),
    text: text.trim(),
    completed: false,
    priority,
  });
  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
}

function toggleTaskCompleted(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function updateTaskPriority(id, priority) {
  tasks = tasks.map(task => task.id === id ? { ...task, priority } : task);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderTasks();
}

function beginTaskEdit(id, taskTextElement) {
  const task = tasks.find(item => item.id === id);
  if (!task) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = task.text;
  input.className = 'edit-input';
  input.maxLength = 100;
  input.addEventListener('blur', () => finishTaskEdit(id, input));
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      input.blur();
    }
    if (event.key === 'Escape') {
      renderTasks();
    }
  });

  taskTextElement.replaceWith(input);
  input.focus();
  input.select();
}

function finishTaskEdit(id, inputElement) {
  const newText = inputElement.value.trim();
  const errorMessage = validateTask(newText);
  if (errorMessage) {
    inputError.textContent = errorMessage;
    inputElement.focus();
    return;
  }

  inputError.textContent = '';
  tasks = tasks.map(task => task.id === id ? { ...task, text: newText } : task);
  saveTasks();
  renderTasks();
}

function moveTask(sourceId, targetId) {
  const sourceIndex = tasks.findIndex(task => task.id === sourceId);
  const targetIndex = tasks.findIndex(task => task.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [movedTask] = tasks.splice(sourceIndex, 1);
  tasks.splice(targetIndex, 0, movedTask);
  saveTasks();
  renderTasks();
}

function initEventListeners() {
  taskForm.addEventListener('submit', event => {
    event.preventDefault();
    addTask(taskInput.value, priorityInput.value);
  });

  filterButtons.forEach(button => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });

  clearCompletedButton.addEventListener('click', clearCompletedTasks);
}

function init() {
  loadTasks();
  initEventListeners();
  renderTasks();
}

init();
