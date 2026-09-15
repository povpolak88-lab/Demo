<template>
  <div>
    <!-- Modern Notification Banner -->
    <Transition name="fade">
      <div v-if="showSuccessToast" class="success-toast">
        <i class="bi bi-check-circle-fill"></i>
        <span>Attendance saved successfully!</span>
      </div>
    </Transition>

    <div class="page-heading">
      <div>
        <h1>Student Attendance</h1>
        <p>Take attendance and manage student attendance records.</p>
      </div>

      <button
        v-if="canEdit"
        class="primary-btn"
        @click="saveAttendance"
      >
        <i class="bi bi-check-circle"></i>
        Save Attendance
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-card">
      <div class="filter-group">
        <label>Date</label>
        <input v-model="date" type="date" />
      </div>

      <div class="filter-group">
        <label>Class</label>
        <select v-model="selectedClass">
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="Class C">Class C</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Subject</label>
        <select v-model="subject">
          <option>Web Development</option>
          <option>Database Management</option>
          <option>Computer Network</option>
        </select>
      </div>

      <div class="filter-group search-group">
        <label>Search Student</label>
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Search student..."
          />
        </div>
      </div>
    </div>

    <!-- Attendance Summary -->
    <div class="attendance-summary">
      <div>
        <i class="bi bi-people-fill"></i>
        <span>Total</span>
        <strong>{{ filteredStudents.length }}</strong>
      </div>
      <div>
        <i class="bi bi-person-check-fill"></i>
        <span>Present</span>
        <strong>{{ presentCount }}</strong>
      </div>
      <div>
        <i class="bi bi-person-x-fill"></i>
        <span>Absent</span>
        <strong>{{ absentCount }}</strong>
      </div>
      <div>
        <i class="bi bi-clock-fill"></i>
        <span>Late</span>
        <strong>{{ lateCount }}</strong>
      </div>
    </div>

    <!-- Attendance Table -->
    <div class="dashboard-card">
      <div class="card-header-custom">
        <div>
          <h3>Attendance List</h3>
          <p>{{ selectedClass }} • {{ subject }}</p>
        </div>
        <span class="date-label">{{ date }}</span>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Student</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(student, index) in filteredStudents" :key="student.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="student-cell">
                  <div class="student-avatar">
                    {{ student.name.charAt(0) }}
                  </div>
                  <strong>{{ student.name }}</strong>
                </div>
              </td>
              <td>{{ student.id }}</td>
              <td>
                <div class="attendance-buttons">
                  <button
                    :disabled="!canEdit"
                    :class="{ selected: student.status === 'Present' }"
                    class="status-btn present-btn"
                    @click="setStatus(student, 'Present')"
                  >
                    <i class="bi bi-check-lg"></i> Present
                  </button>

                  <button
                    :disabled="!canEdit"
                    :class="{ selected: student.status === 'Late' }"
                    class="status-btn late-btn"
                    @click="setStatus(student, 'Late')"
                  >
                    <i class="bi bi-clock"></i> Late
                  </button>

                  <button
                    :disabled="!canEdit"
                    :class="{ selected: student.status === 'Absent' }"
                    class="status-btn absent-btn"
                    @click="setStatus(student, 'Absent')"
                  >
                    <i class="bi bi-x-lg"></i> Absent
                  </button>
                </div>
              </td>
              <td>{{ student.time }}</td>
            </tr>
            <tr v-if="filteredStudents.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                No students found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAttendanceStore } from '../Data/AttendanceStore'

interface User {
  name: string
  role: 'Admin' | 'Teacher' | 'Viewer'
}

const store = useAttendanceStore()

const currentUser = ref<User>({
  name: 'Teacher',
  role: 'Teacher'
})

// Control visibility of the modern success toast
const showSuccessToast = ref(false)

const canEdit = computed(() => {
  return currentUser.value.role === 'Admin' || currentUser.value.role === 'Teacher'
})

const date = ref(store.todayStr())
const selectedClass = ref('Class A')
const subject = ref('Web Development')
const search = ref('')

const filteredStudents = computed(() => {
  return store.state.students
    .filter(student => student.className === selectedClass.value)
    .filter(student => student.name.toLowerCase().includes(search.value.toLowerCase()))
    .map(student => {
      const record = store.getAttendance(date.value, student.id)
      return {
        id: student.id,
        name: student.name,
        status: record?.status ?? 'Present',
        time: record?.time ?? '--'
      }
    })
})

const presentCount = computed(() => filteredStudents.value.filter(s => s.status === 'Present').length)
const absentCount = computed(() => filteredStudents.value.filter(s => s.status === 'Absent').length)
const lateCount = computed(() => filteredStudents.value.filter(s => s.status === 'Late').length)

function setStatus(student: { id: string }, status: 'Present' | 'Late' | 'Absent') {
  if (!canEdit.value) {
    alert('You do not have permission to change attendance.')
    return
  }
  store.setAttendance(date.value, student.id, status, subject.value)
}

function saveAttendance() {
  if (!canEdit.value) {
    alert('You do not have permission to save attendance.')
    return
  }

  // Trigger the customized toast banner
  showSuccessToast.value = true

  // Automatically hide the toast banner after 3 seconds
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}
</script>

<style scoped>
/* Scoped Styling for the Notification Toast */
.success-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #d1e7dd;
  color: #0f5132;
  border: 1px solid #badbcc;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  font-weight: 500;
}

.success-toast i {
  font-size: 1.2rem;
}

/* Vue Fade Transition Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
