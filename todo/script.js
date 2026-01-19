/**
 * Girly To-Do List Application
 * Features: Add, edit, delete tasks, mark as complete, filtering, falling flowers animation
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    const emptyState = document.getElementById('emptyState');
    const flowerContainer = document.getElementById('flower-container');
    
    // Application State
    let todos = JSON.parse(localStorage.getItem('girlyTodos')) || [];
    let currentFilter = 'all';
    let mouseX = 0;
    let mouseY = 0;
    
    // Initialize application
    initApp();
    
    function initApp() {
        renderTodos();
        updateStats();
        createFlowers();
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Add task event listeners
        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTodo();
        });
        
        // Filter buttons event listeners
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                renderTodos();
            });
        });
        
        // Mouse movement tracking for flower interaction
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Create a burst of flowers when mouse moves quickly
            if (Math.random() > 0.9) {
                createFlowerBurst(mouseX, mouseY);
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', function() {
            // Remove any flowers that might be outside the new viewport
            document.querySelectorAll('.flower').forEach(flower => {
                const rect = flower.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    flower.remove();
                }
            });
        });
    }
    
    // Functions for falling flowers animation
    function createFlowers() {
        // Create initial flowers
        for (let i = 0; i < 15; i++) {
            createFlower();
        }
        
        // Add new flowers periodically
        setInterval(() => {
            if (Math.random() > 0.7) {
                createFlower();
            }
        }, 1000);
    }
    
    function createFlower() {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // Random flower type
        const flowerTypes = ['🌸', '🌺', '🌷', '💮', '🏵️', '🌼', '🌹', '🥀'];
        const randomFlower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        flower.innerHTML = randomFlower;
        
        // Random position
        const left = Math.random() * 100;
        flower.style.left = `${left}vw`;
        
        // Random size
        const size = 20 + Math.random() * 20;
        flower.style.fontSize = `${size}px`;
        
        // Random animation duration
        const duration = 10 + Math.random() * 20;
        flower.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        flower.style.animationDelay = `${delay}s`;
        
        // Random opacity
        const opacity = 0.3 + Math.random() * 0.5;
        flower.style.opacity = opacity;
        
        flowerContainer.appendChild(flower);
        
        // Remove flower after animation completes
        setTimeout(() => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        }, duration * 1000);
    }
    
    function createFlowerBurst(x, y) {
        // Create a small burst of flowers at mouse position
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const flower = document.createElement('div');
                flower.className = 'flower';
                
                // Random flower type
                const flowerTypes = ['🌸', '🌺', '🌷', '💮', '🏵️', '🌼'];
                const randomFlower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
                flower.innerHTML = randomFlower;
                
                // Position at mouse
                flower.style.left = `${x}px`;
                flower.style.top = `${y}px`;
                
                // Small size for burst
                const size = 15 + Math.random() * 10;
                flower.style.fontSize = `${size}px`;
                
                // Fast animation for burst
                const duration = 3 + Math.random() * 5;
                flower.style.animationDuration = `${duration}s`;
                
                // Random opacity
                const opacity = 0.5 + Math.random() * 0.5;
                flower.style.opacity = opacity;
                
                flowerContainer.appendChild(flower);
                
                // Remove flower after animation completes
                setTimeout(() => {
                    if (flower.parentNode) {
                        flower.parentNode.removeChild(flower);
                    }
                }, duration * 1000);
            }, i * 100);
        }
    }
    
    // To-do list functionality
    function addTodo() {
        const text = todoInput.value.trim();
        if (text === '') {
            showNotification('Please enter a task!', 'warning');
            return;
        }
        
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        todos.unshift(newTodo);
        saveTodos();
        renderTodos();
        updateStats();
        
        todoInput.value = '';
        todoInput.focus();
        
        // Create a flower burst when adding a task
        createFlowerBurst(window.innerWidth / 2, window.innerHeight / 2);
        
        showNotification('Task added successfully!', 'success');
    }
    
    function toggleTodo(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
        updateStats();
    }
    
    function editTodo(id, newText) {
        if (newText.trim() === '') {
            showNotification('Task cannot be empty!', 'warning');
            return;
        }
        
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: newText.trim() };
            }
            return todo;
        });
        
        saveTodos();
        renderTodos();
        showNotification('Task updated successfully!', 'success');
    }
    
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateStats();
        
        // Create a small flower burst when deleting a task
        createFlowerBurst(
            Math.random() * window.innerWidth, 
            Math.random() * window.innerHeight
        );
        
        showNotification('Task deleted!', 'info');
    }
    
    function renderTodos() {
        // Filter todos based on current filter
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }
        
        // Show/hide empty state
        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
        
        // Render todos
        todoList.innerHTML = '';
        filteredTodos.forEach(todo => {
            const todoElement = document.createElement('div');
            todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoElement.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
                <div class="todo-text">${escapeHtml(todo.text)}</div>
                <div class="todo-actions">
                    <button class="edit-btn" data-id="${todo.id}" title="Edit task"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${todo.id}" title="Delete task"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            todoList.appendChild(todoElement);
        });
        
        // Add event listeners to the new todo elements
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                toggleTodo(id);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const todo = todos.find(t => t.id === id);
                const newText = prompt('Edit your task:', todo.text);
                if (newText !== null) {
                    editTodo(id, newText);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this task?')) {
                    deleteTodo(id);
                }
            });
        });
    }
    
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        
        totalTasksSpan.textContent = `Total: ${total} task${total !== 1 ? 's' : ''}`;
        completedTasksSpan.textContent = `Completed: ${completed} task${completed !== 1 ? 's' : ''}`;
    }
    
    function saveTodos() {
        localStorage.setItem('girlyTodos', JSON.stringify(todos));
    }
    
    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles for notification
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .notification-success { background: #4CAF50; }
            .notification-warning { background: #FF9800; }
            .notification-info { background: #2196F3; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
            style.remove();
        });
    }
});