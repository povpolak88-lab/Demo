<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>Students</h1>
        <p>Manage student information and enrollment.</p>
      </div>
      <button class="primary-btn" @click="openAddModal">
        <i class="bi bi-person-plus-fill"></i> Add Student
      </button>
    </div>

    <div class="dashboard-card">
      <div class="card-header-custom">
        <div>
          <h3>Student List</h3>
          <p>
            All registered students • 
            <span class="badge-total"> Total: {{ store.state.students.length }}</span>
          </p>
        </div>
        <div class="search-box small-search">
          <i class="bi bi-search"></i>
          <input v-model="search" placeholder="Search..." />
        </div>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="width: 70px;">No</th>
              <th>Student</th>
              <th>Student ID</th>
              <th>Email</th>
              <th>Class</th>
              <th>Room</th>
              <th>Attendance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in filteredStudents" :key="student.id">
              <td>{{ index + 1 }}</td>
              
              <td>
                <div class="student-cell">
                  <div class="student-avatar">
                    {{ (student.name || 'S').charAt(0) }}
                  </div>
                  <strong>{{ student.name }}</strong>
                </div>
              </td>
              
              <td class="id-number-cell">
                {{ student.id }}
              </td>
              
              <td>{{ student.email || '--' }}</td>
              <td>{{ student.className }}</td>
              <td>{{ student.room || '--' }}</td>
              <td>
                <span
                  class="attendance-status"
                  :class="student.attendance >= 90 ? 'present-status' : 'late-status'"
                >
                  {{ student.attendance }}%
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 5px;">
                  <button class="icon-action edit-btn" @click="openEditModal(student)" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="icon-action delete-btn" @click="deleteStudent(student.id)" title="Delete">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="8" style="text-align: center; padding: 30px;">
                No students found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Add/Edit Student -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="student-modal">
        <div class="modal-header">
          <div>
            <h3>{{ isEditMode ? 'Edit Student' : 'Add Student' }}</h3>
            <p>{{ isEditMode ? 'Update student information' : 'Enter student information' }}</p>
          </div>
          <button class="close-btn" @click="closeModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Student Name</label>
            <input v-model="formStudent.name" type="text" placeholder="Enter student name" required />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="formStudent.email" type="email" placeholder="Enter email" required />
          </div>

          <div class="form-group">
            <label>Class</label>
            <select v-model="formStudent.className" @change="onClassChange" required>
              <option value="">Select class</option>
              <option value="Class A">Class A</option>
              <option value="Class B">Class B</option>
              <option value="Class C">Class C</option>
            </select>
          </div>

          <div class="form-group">
            <label>Room</label>
            <input v-model="formStudent.room" type="text" placeholder="e.g. 305" readonly />
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="primary-btn">
              <i :class="isEditMode ? 'bi bi-check-lg' : 'bi bi-person-plus-fill'"></i>
              {{ isEditMode ? 'Save Changes' : 'Add Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAttendanceStore } from '../Data/AttendanceStore'

interface StudentData {
  id?: string
  name: string
  email: string
  className: string
  room?: string
}

interface FormState {
  name: string
  email: string
  className: string
  room: string
}

const store = useAttendanceStore()

const search = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const currentStudentId = ref('')

// Class to room mapping synchronized with Dashboard Schedule
const classRoomMap: Record<string, string> = {
  'Class A': '305',
  'Class B': '204',
  'Class C': '105'
}

const formStudent = ref<FormState>({
  name: '',
  email: '',
  className: '',
  room: ''
})

const filteredStudents = computed(() => {
  const keyword = search.value.toLowerCase()
  return store.state.students
    .filter(student =>
      (student.name || '').toLowerCase().includes(keyword) ||
      (student.email || '').toLowerCase().includes(keyword) ||
      (student.id || '').toLowerCase().includes(keyword) ||
      (student.className || '').toLowerCase().includes(keyword) ||
      (student.room || classRoomMap[student.className] || '').toLowerCase().includes(keyword)
    )
    .map(student => ({
      ...student,
      // Default to room mapping if room is missing on student record
      room: student.room || classRoomMap[student.className] || '--',
      attendance: typeof store.getStudentAttendanceRate === 'function' 
        ? store.getStudentAttendanceRate(student.id) 
        : 100
    }))
})

// Automatically assigns room matching the dashboard schedule on selection
function onClassChange() {
  formStudent.value.room = classRoomMap[formStudent.value.className] || ''
}

function openAddModal() {
  isEditMode.value = false
  formStudent.value = { name: '', email: '', className: '', room: '' }
  showModal.value = true
}

function openEditModal(student: StudentData & { id: string }) {
  currentStudentId.value = student.id
  const assignedRoom = student.room || classRoomMap[student.className] || ''
  
  formStudent.value = {
    name: student.name || '',
    email: student.email || '',
    className: student.className || '',
    room: assignedRoom
  }
  isEditMode.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function handleSubmit() {
  if (isEditMode.value) {
    if (typeof store.updateStudent === 'function') {
      store.updateStudent(currentStudentId.value, { ...formStudent.value })
    }
  } else {
    if (typeof store.addStudent === 'function') {
      store.addStudent({ ...formStudent.value })
    }
  }
  closeModal()
}

function deleteStudent(id: string) {
  if (confirm('Are you sure you want to delete this student?')) {
    if (typeof store.deleteStudent === 'function') {
      store.deleteStudent(id)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.student-modal {
  width: 450px;
  max-width: 90%;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}
.modal-header h3 {
  margin: 0;
}
.modal-header p {
  margin: 5px 0 0;
  color: #777;
}
.close-btn {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 7px;
  font-weight: 600;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 7px;
  outline: none;
  box-sizing: border-box;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #2f8f7e;
}
.form-group input[readonly] {
  background-color: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.cancel-btn {
  background: #f3f4f6;
  border: none;
  padding: 10px 16px;
  border-radius: 7px;
  cursor: pointer;
}
</style>