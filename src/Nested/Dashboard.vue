<template>
  <div>
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div>
        <h1>Good Afternoon, Admin!</h1>
        <p>
          Welcome back to your Attendance Management System.
          Here's what's happening today.
        </p>
      </div>

      <button class="primary-btn" @click="goAttendance">
        <i class="bi bi-plus-lg"></i>
        Take Attendance
      </button>
    </div>

    <!-- Statistics -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon students">
          <i class="bi bi-people-fill"></i>
        </div>
        <div>
          <p>Total Students</p>
          <h2>{{ totalStudents }}</h2>
          <span class="success-text">
            <i class="bi bi-arrow-up"></i> 8.2%
          </span>
          <small> vs last month</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon present">
          <i class="bi bi-person-check-fill"></i>
        </div>
        <div>
          <p>Present Today</p>
          <h2>{{ presentToday }}</h2>
          <span class="success-text">
            {{ presentPct }}%
          </span>
          <small> attendance</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon absent">
          <i class="bi bi-person-x-fill"></i>
        </div>
        <div>
          <p>Absent Today</p>
          <h2>{{ absentToday }}</h2>
          <span class="danger-text">
            {{ absentPct }}%
          </span>
          <small> of students</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon late">
          <i class="bi bi-clock-fill"></i>
        </div>
        <div>
          <p>Late Today</p>
          <h2>{{ lateToday }}</h2>
          <span class="warning-text">
            {{ latePct }}%
          </span>
          <small> of students</small>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Attendance Overview Chart -->
      <div class="dashboard-card">
        <div class="card-header-custom">
          <div>
            <h3>Attendance Overview</h3>
            <p>Weekly attendance statistics</p>
          </div>

          <select v-model="selectedOverviewPeriod">
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        <div class="attendance-chart">
          <div class="chart-bar">
            <div class="bar" style="height: 80%"></div>
            <span>Mon</span>
          </div>

          <div class="chart-bar">
            <div class="bar" style="height: 92%"></div>
            <span>Tue</span>
          </div>

          <div class="chart-bar">
            <div class="bar" style="height: 76%"></div>
            <span>Wed</span>
          </div>

          <div class="chart-bar">
            <div class="bar" style="height: 88%"></div>
            <span>Thu</span>
          </div>

          <div class="chart-bar">
            <div class="bar" style="height: 95%"></div>
            <span>Fri</span>
          </div>
        </div>
      </div>

      <!-- Today's Schedule -->
      <div class="dashboard-card">
        <div class="card-header-custom">
          <div>
            <h3>Today's Schedule</h3>
            <p>Classes scheduled today</p>
          </div>

          <router-link to="/schedule">
            View All
          </router-link>
        </div>

        <div class="schedule-item">
          <div class="schedule-time">
            02:00
            <small>PM</small>
          </div>

          <div class="schedule-info">
            <strong>Web Fronend Development</strong>
            <span>Room 305 | Class A</span>
          </div>

          <span class="status active">Active</span>
        </div>

        <div class="schedule-item">
          <div class="schedule-time">
            02:00
            <small>PM</small>
          </div>

          <div class="schedule-info">
            <strong>Web Backend Development</strong>
            <span>Room 204 | Class B</span>
          </div>

          <span class="status upcoming">Active</span>
        </div>

        <div class="schedule-item">
          <div class="schedule-time">
            02:00
            <small>PM</small>
          </div>

          <div class="schedule-info">
            <strong>C++</strong>
            <span>Room 105 | Class C</span>
          </div>

          <span class="status upcoming">Active</span>
        </div>
      </div>
    </div>

    <!-- Recent Attendance Section (Shows All Students across Class A, B, and C) -->
    <div class="dashboard-card recent-card">
      <div class="card-header-custom">
        <div>
          <h3>Recent Attendance</h3>
          <p>Latest attendance records across all classes</p>
        </div>

        <router-link to="/attendance">
          View All
        </router-link>
      </div>

      <div class="table-responsive">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="entry in displayAttendance" :key="entry.student.id">
              <td>
                <div class="student-cell">
                  <div class="student-avatar">{{ initials(entry.student.name) }}</div>
                  <strong>{{ entry.student.name }}</strong>
                </div>
              </td>

              <td>
                <span class="class-badge">{{ entry.student.className }}</span>
              </td>
              <td>Today</td>
              <td>{{ entry.record.time }}</td>

              <td>
                <span
                  class="attendance-status"
                  :class="{
                    'present-status': entry.record.status === 'Present',
                    'late-status': entry.record.status === 'Late',
                    'danger-status': entry.record.status === 'Absent'
                  }"
                >
                  {{ entry.record.status }}
                </span>
              </td>
            </tr>

            <tr v-if="displayAttendance.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                No attendance records available for today.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAttendanceStore } from '../Data/AttendanceStore'

// Interface matching AttendanceStore exactly
interface StudentRecord {
  student: {
    id: string
    name: string
    email: string
    className: string
    room?: string
  }
  record: {
    status: 'Present' | 'Late' | 'Absent'
    time: string
    subject?: string
  }
}

const router = useRouter()
const store = useAttendanceStore()
const selectedOverviewPeriod = ref('This Week')

function goAttendance() {
  router.push('/attendance')
}

function initials(name: string): string {
  if (!name) return ''
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Default records matching your screenshot
const fallbackAttendanceRecords: StudentRecord[] = [
  {
    student: { id: 'STU001', name: 'lors piseth', email: 'piseth@gmail.com', className: 'Class C' },
    record: { status: 'Present', time: '08:07 AM', subject: 'Web Development' }
  },
  {
    student: { id: 'STU002', name: 'Nouy Odom', email: 'odom@gmail.com', className: 'Class A' },
    record: { status: 'Present', time: '08:07 AM', subject: 'Web Development' }
  },
  {
    student: { id: 'STU003', name: 'Kev Visal', email: 'visal@gmail.com', className: 'Class A' },
    record: { status: 'Late', time: '07:58 AM', subject: 'Web Development' }
  },
  {
    student: { id: 'STU004', name: 'chan mony', email: 'mony@gmail.com', className: 'Class A' },
    record: { status: 'Present', time: '08:07 AM', subject: 'Web Development' }
  },
  {
    student: { id: 'STU005', name: 'Pov Somrach', email: 'somrach@gmail.com', className: 'Class A' },
    record: { status: 'Late', time: '07:58 AM', subject: 'Web Development' }
  }
]

const totalStudents = computed(() => {
  return store.state.students.length > 0 ? store.state.students.length : 5
})

const todayRecords = computed(() => store.state.records[store.todayStr()] ?? {})

// Safe, error-free computed property
const storeAttendanceRecords = computed<StudentRecord[]>(() => {
  return store.state.students
    .filter(s => !!todayRecords.value[s.id])
    .map(s => ({
      student: s,
      record: todayRecords.value[s.id]
    })) as StudentRecord[]
})

const displayAttendance = computed<StudentRecord[]>(() => {
  if (storeAttendanceRecords.value.length > 0) {
    return storeAttendanceRecords.value.slice().reverse() // បង្ហាញសិស្សទាំងអស់
  }
  return fallbackAttendanceRecords
})

const presentToday = computed(() =>
  displayAttendance.value.filter(r => r.record.status === 'Present').length
)
const absentToday = computed(() =>
  displayAttendance.value.filter(r => r.record.status === 'Absent').length
)
const lateToday = computed(() =>
  displayAttendance.value.filter(r => r.record.status === 'Late').length
)

function pct(count: number): string {
  if (totalStudents.value === 0) return '0'
  return ((count / totalStudents.value) * 100).toFixed(1)
}

const presentPct = computed(() => pct(presentToday.value))
const absentPct = computed(() => pct(absentToday.value))
const latePct = computed(() => pct(lateToday.value))
</script>

<style scoped>
.class-badge {
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.present-status {
  background-color: #d1fae5;
  color: #065f46;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.late-status {
  background-color: #fef3c7;
  color: #92400e;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.danger-status {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>