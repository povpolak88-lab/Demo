<template>
  <div>

    <!-- Welcome -->
    <div class="welcome-section">

      <div>
        <h1>Good Morning, Admin! </h1>

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


    <!-- Main Dashboard -->
    <div class="dashboard-grid">

      <!-- Attendance Overview -->
      <div class="dashboard-card">

        <div class="card-header-custom">

          <div>
            <h3>Attendance Overview</h3>
            <p>Weekly attendance statistics</p>
          </div>

          <select>
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
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
            08:00
            <small>AM</small>
          </div>

          <div class="schedule-info">
            <strong>Web Development</strong>
            <span>Room 301 • Class A</span>
          </div>

          <span class="status active">Active</span>

        </div>


        <div class="schedule-item">

          <div class="schedule-time">
            10:00
            <small>AM</small>
          </div>

          <div class="schedule-info">
            <strong>Database Management</strong>
            <span>Room 204 • Class B</span>
          </div>

          <span class="status upcoming">Upcoming</span>

        </div>


        <div class="schedule-item">

          <div class="schedule-time">
            01:30
            <small>PM</small>
          </div>

          <div class="schedule-info">
            <strong>Computer Network</strong>
            <span>Room 105 • Class C</span>
          </div>

          <span class="status upcoming">Upcoming</span>

        </div>

      </div>

    </div>


    <!-- Recent Attendance -->
    <div class="dashboard-card recent-card">

      <div class="card-header-custom">

        <div>
          <h3>Recent Attendance</h3>
          <p>Latest attendance records</p>
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

            <tr v-for="entry in recentAttendance" :key="entry.student.id">
              <td>
                <div class="student-cell">
                  <div class="student-avatar">{{ initials(entry.student.name) }}</div>
                  <strong>{{ entry.student.name }}</strong>
                </div>
              </td>

              <td>{{ entry.student.className }}</td>
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

            <tr v-if="recentAttendance.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                No attendance taken yet today.
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAttendanceStore } from '../Data/AttendanceStore'

const router = useRouter()
const store = useAttendanceStore()

function goAttendance() {
  router.push('/attendance')
}

function initials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const totalStudents = computed(() => store.state.students.length)

const todayRecords = computed(() => store.state.records[store.todayStr()] ?? {})

const presentToday = computed(() =>
  Object.values(todayRecords.value).filter(r => r.status === 'Present').length
)
const absentToday = computed(() =>
  Object.values(todayRecords.value).filter(r => r.status === 'Absent').length
)
const lateToday = computed(() =>
  Object.values(todayRecords.value).filter(r => r.status === 'Late').length
)

function pct(count: number): string {
  if (totalStudents.value === 0) return '0'
  return ((count / totalStudents.value) * 100).toFixed(1)
}

const presentPct = computed(() => pct(presentToday.value))
const absentPct = computed(() => pct(absentToday.value))
const latePct = computed(() => pct(lateToday.value))

// Most recently marked students today (last 5), newest first
const recentAttendance = computed(() => {
  return store.state.students
    .map(s => ({ student: s, record: todayRecords.value[s.id] }))
    .filter((r): r is { student: typeof store.state.students[number]; record: NonNullable<typeof r.record> } => !!r.record)
    .slice(-5)
    .reverse()
})
</script>