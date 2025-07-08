document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const activeCount = document.getElementById('activeCount');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Инициализация приложения
    function init() {
        renderTasks();
        updateActiveCount();
        
        // Обработчики событий
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                renderTasks();
            });
        });
    }

    // Добавление задачи
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateActiveCount();
            taskInput.value = '';
        }
    }

    // Сохранение задач в Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Отображение задач
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">Нет задач</li>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', toggleTask);
            
            const span = document.createElement('span');
            span.className = 'task-text' + (task.completed ? ' completed' : '');
            span.textContent = task.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'x';
            deleteBtn.addEventListener('click', deleteTask);
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            
            taskList.appendChild(li);
        });
    }

    // Переключение статуса задачи
    function toggleTask(e) {
        const taskId = parseInt(e.target.parentElement.dataset.id);
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = e.target.checked;
            saveTasks();
            renderTasks();
            updateActiveCount();
        }
    }

    // Удаление задачи
    function deleteTask(e) {
        const taskId = parseInt(e.target.parentElement.dataset.id);
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateActiveCount();
    }

    // Обновление счетчика активных задач
    function updateActiveCount() {
        const activeTasksCount = tasks.filter(task => !task.completed).length;
        activeCount.textContent = activeTasksCount;
    }

    init();
});