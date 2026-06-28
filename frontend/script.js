/**
 * @file script.js
 * @description Frontend business logic for Student Management System.
 * Connects UI events to Express API endpoints using asynchronous Fetch API.
 */

// API Configuration - Uses relative path as Express serves this statically
const API_URL = '/students';

// State Management
let studentDatabase = [];
let studentToDeleteId = null;

// DOM Elements
const studentsTbody = document.getElementById('students-tbody');
const loadingIndicator = document.getElementById('loading-indicator');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const departmentFilter = document.getElementById('department-filter');

// Modals
const studentModal = document.getElementById('student-modal');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');

// Buttons
const openRegisterBtn = document.getElementById('open-register-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Form
const studentForm = document.getElementById('student-form');
const formAction = document.getElementById('form-action');
const modalTitle = document.getElementById('modal-title');
const submitBtnText = document.getElementById('submit-btn-text');

// Form Inputs
const studentIdInput = document.getElementById('student-id');
const studentNameInput = document.getElementById('student-name');
const studentDeptInput = document.getElementById('student-department');
const studentYearInput = document.getElementById('student-year');
const studentEmailInput = document.getElementById('student-email');
const studentPhoneInput = document.getElementById('student-phone');

// Stats Counters
const statTotal = document.getElementById('stat-total');
const statDepartments = document.getElementById('stat-departments');

/**
 * Show a modern self-destructing toast alert
 */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span class="toast-text">${message}</span>
  `;
  
  container.appendChild(toast);
  lucide.createIcons(); // Hydrate the icon
  
  // Fade out and remove after 4 seconds
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 4000);
}

/**
 * Open/Close Modals
 */
function openStudentModal(actionType = 'create', student = null) {
  studentForm.reset();
  formAction.value = actionType;
  studentIdInput.disabled = false; // Enable by default
  
  if (actionType === 'create') {
    modalTitle.textContent = 'Register New Student';
    submitBtnText.textContent = 'Register Student';
  } else if (actionType === 'edit' && student) {
    modalTitle.textContent = 'Edit Student Details';
    submitBtnText.textContent = 'Save Changes';
    
    // Populate form fields
    studentIdInput.value = student.id;
    studentIdInput.disabled = true; // Student ID cannot be modified once set
    studentNameInput.value = student.name;
    studentDeptInput.value = student.department;
    studentYearInput.value = student.year;
    studentEmailInput.value = student.email;
    studentPhoneInput.value = student.phone;
  }
  
  studentModal.classList.remove('hidden');
}

function closeStudentModal() {
  studentModal.classList.add('hidden');
}

function openDeleteModal(id, name) {
  studentToDeleteId = id;
  document.getElementById('delete-student-name').textContent = name;
  deleteConfirmModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteConfirmModal.classList.add('hidden');
  studentToDeleteId = null;
}

/**
 * Fetch All Students from Backend API
 */
async function fetchStudents() {
  loadingIndicator.classList.remove('hidden');
  studentsTbody.innerHTML = '';
  emptyState.classList.add('hidden');

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    studentDatabase = data;
    renderStudentsTable(data);
    updateStats(data);
  } catch (error) {
    console.error('Error fetching student lists:', error);
    showToast('Failed to load student data. Ensure the server is online.', 'error');
    emptyState.classList.remove('hidden');
  } finally {
    loadingIndicator.classList.add('hidden');
  }
}

/**
 * Render database array to the HTML Table
 */
function renderStudentsTable(students) {
  studentsTbody.innerHTML = '';
  
  if (students.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  students.forEach(student => {
    // Generate department visual classes
    let deptClass = 'dept-default';
    if (student.department === 'Computer Science') deptClass = 'dept-cs';
    else if (student.department === 'Information Technology') deptClass = 'dept-it';
    else if (student.department === 'Electrical Engineering') deptClass = 'dept-ee';
    else if (student.department === 'Mechanical Engineering') deptClass = 'dept-me';
    else if (student.department === 'Civil Engineering') deptClass = 'dept-ce';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight: 600; color: #1e293b;">${escapeHtml(student.id)}</td>
      <td style="font-weight: 500; color: #0f172a;">${escapeHtml(student.name)}</td>
      <td><span class="dept-badge ${deptClass}">${escapeHtml(student.department)}</span></td>
      <td><span class="year-badge">${escapeHtml(student.year)}</span></td>
      <td style="color: #475569;">${escapeHtml(student.email)}</td>
      <td style="color: #475569; white-space: nowrap;">${escapeHtml(student.phone)}</td>
      <td class="text-right">
        <div class="actions-cell">
          <button class="btn-icon edit-action-btn" title="Edit Student">
            <i data-lucide="edit-3" style="width: 15px; height: 15px;"></i>
          </button>
          <button class="btn-icon delete delete-action-btn" title="Delete Student">
            <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
          </button>
        </div>
      </td>
    `;
    
    // Wire actions
    row.querySelector('.edit-action-btn').addEventListener('click', () => {
      openStudentModal('edit', student);
    });
    
    row.querySelector('.delete-action-btn').addEventListener('click', () => {
      openDeleteModal(student.id, student.name);
    });
    
    studentsTbody.appendChild(row);
  });
  
  // Re-hydrate Lucide icons
  lucide.createIcons();
}

/**
 * Handle form submit (Create or Update student)
 */
studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const action = formAction.value;
  const id = studentIdInput.value.trim();
  const name = studentNameInput.value.trim();
  const department = studentDeptInput.value;
  const year = studentYearInput.value;
  const email = studentEmailInput.value.trim();
  const phone = studentPhoneInput.value.trim();

  // Basic Validations
  if (!id || !name || !department || !year || !email || !phone) {
    showToast('Please fill out all fields.', 'error');
    return;
  }

  const payload = { id, name, department, year, email, phone };
  
  try {
    let response;
    if (action === 'create') {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // For editing, ID is passed in path parameter
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();

    if (response.ok) {
      showToast(result.message || 'Success!', 'success');
      closeStudentModal();
      fetchStudents(); // Reload table data
    } else {
      showToast(result.message || 'An error occurred.', 'error');
    }
  } catch (error) {
    console.error('API integration error:', error);
    showToast('Failed to connect to the server API.', 'error');
  }
});

/**
 * Delete student execution
 */
confirmDeleteBtn.addEventListener('click', async () => {
  if (!studentToDeleteId) return;

  try {
    const response = await fetch(`${API_URL}/${studentToDeleteId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();

    if (response.ok) {
      showToast(result.message || 'Student deleted successfully.', 'success');
      closeDeleteModal();
      fetchStudents();
    } else {
      showToast(result.message || 'Failed to delete student.', 'error');
    }
  } catch (error) {
    console.error('Delete API call error:', error);
    showToast('Server connection failed.', 'error');
  }
});

/**
 * Search and Filter Logic
 */
function handleFilterSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedDept = departmentFilter.value;
  
  const filtered = studentDatabase.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm) ||
      student.id.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.department.toLowerCase().includes(searchTerm);
      
    const matchesDept = selectedDept === '' || student.department === selectedDept;
    
    return matchesSearch && matchesDept;
  });
  
  renderStudentsTable(filtered);
}

// Bind search and filter events
searchInput.addEventListener('input', handleFilterSearch);
departmentFilter.addEventListener('change', handleFilterSearch);

/**
 * Update Stats Cards
 */
function updateStats(students) {
  statTotal.textContent = students.length;
  
  // Calculate distinct departments
  const depts = new Set(students.map(s => s.department));
  statDepartments.textContent = depts.size;
}

/**
 * Helper to prevent XSS vulnerability
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Bind navigation events
openRegisterBtn.addEventListener('click', () => openStudentModal('create'));
closeModalBtn.addEventListener('click', closeStudentModal);
cancelModalBtn.addEventListener('click', closeStudentModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// Close modals clicking outside cards
window.addEventListener('click', (e) => {
  if (e.target === studentModal) closeStudentModal();
  if (e.target === deleteConfirmModal) closeDeleteModal();
});

// Initial Database Fetch on page load
document.addEventListener('DOMContentLoaded', fetchStudents);
