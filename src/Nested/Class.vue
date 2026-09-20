<template>
  <div class="page-container">

    <!-- Header Section -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Class Management</h1>
        <p class="page-description">Manage classes, room assignments, and course offerings.</p>
      </div>

      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-lg btn-icon"></i>
        <span>Add Class</span>
      </button>
    </header>

    <!-- Content Card -->
    <main class="dashboard-card">

      <div class="card-toolbar">
        <div class="toolbar-info">
          <h2 class="card-title">Class List</h2>
          <p class="card-subtitle">
            All registered classes
            <span class="badge-separator">•</span>
            <span class="badge-total">Total: {{ classes.length }}</span>
          </p>
        </div>

        <div class="search-input-wrapper">
          <i class="bi bi-search search-icon"></i>
          <input 
            v-model="search" 
            type="text" 
            class="search-input" 
            placeholder="Search classes..." 
          />
        </div>
      </div>

      <div class="table-container">
        <table class="custom-table">
          <thead>
            <tr>
              <th class="th-no">No</th>
              <th>Class Name</th>
              <th>Room</th>
              <th>Course</th>
              <th>Students</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(classItem, index) in filteredClasses"
              :key="classItem.id"
              class="table-row-clickable"
              @click="openViewModal(classItem)"
            >
              <td class="td-no">{{ index + 1 }}</td>

              <td>
                <div class="entity-cell">
                  <div class="entity-avatar">
                    {{ classItem.name.charAt(0) }}
                  </div>
                  <span class="entity-name">{{ classItem.name }}</span>
                </div>
              </td>

              <td>
                <span class="room-tag">{{ classItem.room }}</span>
              </td>
              
              <td>
                <span class="course-tag">{{ classItem.course }}</span>
              </td>

              <td>
                <span class="status-badge status-present">
                  {{ studentCount(classItem.name) }} Students
                </span>
              </td>

              <td class="td-actions" @click.stop>
                <div class="action-buttons">
                  <button class="btn-icon-action view-btn" @click="openViewModal(classItem)" title="View Attendance">
                    <i class="bi bi-eye-fill"></i>
                  </button>
                  <button class="btn-icon-action edit-btn" @click="openEditModal(classItem)" title="Edit Class">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn-icon-action delete-btn" @click="deleteClass(classItem.id)" title="Delete Class">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredClasses.length === 0">
              <td colspan="6" class="empty-state">
                <i class="bi bi-inbox empty-icon"></i>
                <p>No classes match your query.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Add/Edit Class Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">

          <div class="modal-header">
            <div>
              <h3 class="modal-title">{{ isEditMode ? 'Edit Class' : 'Add Class' }}</h3>
              <p class="modal-subtitle">{{ isEditMode ? 'Update class details below.' : 'Enter information for the new class.' }}</p>
            </div>

            <button class="btn-close" @click="closeModal" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleSubmit">

            <div class="form-group">
              <label class="form-label">Class Name</label>
              <input
                v-model="formClass.name"
                type="text"
                class="form-control"
                placeholder="Enter Class A"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Room</label>
              <input
                v-model="formClass.room"
                type="text"
                class="form-control"
                placeholder="Enter Room 305"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Course</label>
              <select v-model="formClass.course" class="form-control" required>
                <option disabled value="">Select a course</option>
                <option
                  v-for="course in courses"
                  :key="course"
                  :value="course"
                >
                  {{ course }}
                </option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                <i :class="isEditMode ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="btn-icon"></i>
                <span>{{ isEditMode ? 'Save Changes' : 'Add Class' }}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>

    <!-- View Class Attendance Modal -->
    <Transition name="fade">
      <div v-if="viewingClass" class="view-overlay" @click.self="closeViewModal">
        <div class="view-class-modal">

          <header class="modal-header view-header">
            <div>
              <h2 class="view-title">{{ viewingClass.name }}  </h2>
              <p class="view-subtitle"> {{ viewingClass.course }}  <span class="dot-separator">|</span> {{ viewingClass.room }}</p>
            </div>

            <button class="btn-close" @click="closeViewModal" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </header>

          <!-- Date Picker -->
          <div class="form-group date-picker-group">
            <label class="form-label">Date</label>
            <input v-model="viewDate" type="date" class="form-control date-input" />
          </div>

          <!-- Attendance Summary Metrics -->
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon-wrapper total-wrapper">
                <i class="bi bi-people-fill"></i>
              </div>
              <div class="metric-details">
                <span class="metric-label">Total</span>
                <strong class="metric-value">{{ viewClassStudents.length }}</strong>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon-wrapper present-wrapper">
                <i class="bi bi-person-check-fill"></i>
              </div>
              <div class="metric-details">
                <span class="metric-label">Present</span>
                <strong class="metric-value">{{ viewPresentCount }}</strong>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon-wrapper absent-wrapper">
                <i class="bi bi-person-x-fill"></i>
              </div>
              <div class="metric-details">
                <span class="metric-label">Absent</span>
                <strong class="metric-value">{{ viewAbsentCount }}</strong>
              </div>
            </div>

            <div class="metric-card">
              <div class="metric-icon-wrapper late-wrapper">
                <i class="bi bi-clock-fill"></i>
              </div>
              <div class="metric-details">
                <span class="metric-label">Late</span>
                <strong class="metric-value">{{ viewLateCount }}</strong>
              </div>
            </div>
          </div>

          <!-- Student Attendance Table -->
          <div class="table-container view-table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th class="th-no">No</th>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(student, index) in viewClassStudents" :key="student.id">
                  <td class="td-no">{{ index + 1 }}</td>

                  <td>
                    <div class="entity-cell">
                      <div class="entity-avatar">
                        {{ student.name.charAt(0) }}
                      </div>
                      <span class="entity-name">{{ student.name }}</span>
                    </div>
                  </td>

                  <td>
                    <span class="id-tag">{{ student.id }}</span>
                  </td>

                  <td>
                    <span
                      class="status-badge"
                      :class="{
                        'status-present': student.status === 'Present',
                        'status-late': student.status === 'Late',
                        'status-absent': student.status === 'Absent'
                      }"
                    >
                      <i class="status-dot"></i>
                      {{ student.status }}
                    </span>
                  </td>

                  <td class="time-cell">{{ student.time }}</td>
                </tr>

                <tr v-if="viewClassStudents.length === 0">
                  <td colspan="5" class="empty-state">
                    <i class="bi bi-people empty-icon"></i>
                    <p>No students enrolled in this class.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <footer class="modal-footer view-footer">
            <button class="btn btn-secondary" @click="closeViewModal">
              Close
            </button>
          </footer>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAttendanceStore } from '../Data/AttendanceStore'

interface ClassInfo {
  id: number
  name: string
  room: string
  course: string
}

const store = useAttendanceStore()

const courses = [
  'Web Frontend Development',
  'Web Backend Development',
  'Computer Network',
  'Database',
  'C++',
  'Design',
  'Microsoft Office'
]

const classes = ref<ClassInfo[]>([
  { id: 1, name: 'Class A', room: 'Room 305', course: 'Web Frontend Development' },
  { id: 2, name: 'Class B', room: 'Room 204', course: 'Web Backend Development' },
  { id: 3, name: 'Class C', room: 'Room 105', course: 'C++' }
])

const search = ref('')
const showModal = ref(false)
const isEditMode = ref(false)
const currentClassId = ref<number | null>(null)

const formClass = ref({
  name: '',
  room: '',
  course: ''
})

const filteredClasses = computed(() => {
  const keyword = search.value.toLowerCase()
  return classes.value.filter(
    classItem =>
      classItem.name.toLowerCase().includes(keyword) ||
      classItem.room.toLowerCase().includes(keyword) ||
      classItem.course.toLowerCase().includes(keyword)
  )
})

function studentCount(className: string): number {
  return store.state.students.filter(
    student => student.className === className
  ).length
}

function openAddModal() {
  isEditMode.value = false
  formClass.value = { name: '', room: '', course: '' }
  showModal.value = true
}

function openEditModal(classItem: ClassInfo) {
  currentClassId.value = classItem.id
  formClass.value = {
    name: classItem.name,
    room: classItem.room,
    course: classItem.course
  }
  isEditMode.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function handleSubmit() {
  if (isEditMode.value && currentClassId.value !== null) {
    const target = classes.value.find(c => c.id === currentClassId.value)
    if (target) {
      target.name = formClass.value.name
      target.room = formClass.value.room
      target.course = formClass.value.course
    }
  } else {
    classes.value.push({
      id: Date.now(),
      name: formClass.value.name,
      room: formClass.value.room,
      course: formClass.value.course
    })
  }
  closeModal()
}

function deleteClass(id: number) {
  if (confirm('Are you sure you want to delete this class?')) {
    classes.value = classes.value.filter(c => c.id !== id)
  }
}

/* =========================
   View Class Attendance
========================= */

const viewingClass = ref<ClassInfo | null>(null)

const viewDate = ref(store.todayStr())

function openViewModal(classItem: ClassInfo) {
  viewingClass.value = classItem
  viewDate.value = store.todayStr()
}

function closeViewModal() {
  viewingClass.value = null
}

const viewClassStudents = computed(() => {
  if (!viewingClass.value) return []

  const className = viewingClass.value.name

  return store.state.students
    .filter(student => student.className === className)
    .map(student => {
      const record = store.getAttendance(viewDate.value, student.id)

      return {
        id: student.id,
        name: student.name,
        status: record?.status ?? 'Present',
        time: record?.time ?? '--'
      }
    })
})

const viewPresentCount = computed(() =>
  viewClassStudents.value.filter(s => s.status === 'Present').length
)

const viewAbsentCount = computed(() =>
  viewClassStudents.value.filter(s => s.status === 'Absent').length
)

const viewLateCount = computed(() =>
  viewClassStudents.value.filter(s => s.status === 'Late').length
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Color Variables & Base Reset */
.page-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  box-sizing: border-box;
}

/* Header Styling */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0;
}

.page-description {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0;
}

/* Button Component Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 10px 18px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.btn-icon {
  margin-right: 8px;
  font-size: 15px;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(13, 148, 136, 0.2);
}

.btn-primary:hover {
  background-color: #0f766e;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border-color: #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

/* Dashboard Card & Toolbar */
.dashboard-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #ffffff;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.card-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0;
}

.badge-separator {
  margin: 0 6px;
  color: #cbd5e1;
}

.badge-total {
  font-weight: 600;
  color: #0d9488;
}

/* Search Box */
.search-input-wrapper {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #f8fafc;
  color: #0f172a;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  background-color: #ffffff;
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}

/* Data Table Styling */
.table-container {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.custom-table th {
  background-color: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.custom-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
  vertical-align: middle;
}

.th-no, .td-no {
  width: 60px;
  color: #94a3b8;
  font-weight: 500;
}

.table-row-clickable {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.table-row-clickable:hover {
  background-color: #f8fafc;
}

.entity-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.entity-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: #ccfbf1;
  color: #0f766e;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.entity-name {
  font-weight: 600;
  color: #0f172a;
}

.room-tag {
  display: inline-block;
  padding: 4px 10px;
  background-color: #f1f5f9;
  color: #475569;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.course-tag {
  font-weight: 500;
  color: #334155;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.status-present {
  background-color: #dcfce7;
  color: #15803d;
}

.status-late {
  background-color: #fef9c3;
  color: #a16207;
}

.status-absent {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

/* Table Actions */
.th-actions {
  text-align: right;
  width: 120px;
}

.td-actions {
  text-align: right;
}

.action-buttons {
  display: inline-flex;
  gap: 6px;
}

.btn-icon-action {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background-color: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.edit-btn:hover {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.delete-btn:hover {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Standard Modal Overlay & Box */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.modal-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0;
}

.btn-close {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: color 0.15s ease;
}

.btn-close:hover {
  color: #0f172a;
}

/* Form Styling */
.modal-form {
  padding: 20px 24px 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-control {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #0f172a;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
}

/* Fullscreen View Modal Overlay */
.view-overlay {
  position: fixed;
  inset: 0;
  background-color: #f8fafc;
  z-index: 1000;
  overflow-y: auto;
}

.view-class-modal {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  box-sizing: border-box;
}

.view-header {
  padding: 0 0 20px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.view-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.view-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 6px 0 0;
}

.dot-separator {
  margin: 0 6px;
  color: #cbd5e1;
}

.date-picker-group {
  max-width: 240px;
  margin-bottom: 24px;
}

.date-input {
  background-color: #ffffff;
}

/* Metrics Dashboard Strip */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.metric-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.total-wrapper {
  background-color: #eff6ff;
  color: #2563eb;
}

.present-wrapper {
  background-color: #dcfce7;
  color: #16a34a;
}

.absent-wrapper {
  background-color: #fee2e2;
  color: #dc2626;
}

.late-wrapper {
  background-color: #fef9c3;
  color: #ca8a04;
}

.metric-details {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.view-table-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.id-tag {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

.time-cell {
  font-size: 13px;
  color: #64748b;
}

.view-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .card-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .search-input-wrapper {
    width: 100%;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>