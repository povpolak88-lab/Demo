<template>
  <div class="schedule-page">

    <!-- Page Heading -->
    <div class="page-heading">
      <div>
        <h1>Class Schedule</h1>
        <p>View and manage your class and study schedules.</p>
      </div>

      <button class="primary-btn" @click="openAddModal">
        <i class="bi bi-plus-lg"></i>
        Add Schedule
      </button>
    </div>

    <!-- Major Filter -->
    <div class="filter-bar">
      <div class="filter-group">
        <label>Major</label>

        <select v-model="selectedMajor">
          <option value="All">All Majors</option>

          <option
            v-for="major in majors"
            :key="major"
            :value="major"
          >
            {{ major }}
          </option>
        </select>
      </div>
    </div>

    <!-- Schedule Grid -->
    <div class="schedule-grid">

      <div
        v-for="day in filteredSchedules"
        :key="day.day"
        class="schedule-card"
        :style="{ '--day-accent': dayAccent(day.day) }"
      >

        <!-- Day Header -->
        <div class="schedule-card-header">
          <div>
            <span>{{ day.day }}</span>
            <small>
              {{ day.classes.length }}
              {{ day.classes.length === 1 ? 'class' : 'classes' }}
            </small>
          </div>

          <i class="bi bi-calendar3"></i>
        </div>

        <!-- Classes -->
        <div v-if="day.classes.length">

          <div
            v-for="classItem in day.classes"
            :key="classItem.id"
            class="class-box"
            :class="classItem.type === 'Study' ? 'is-study' : 'is-class'"
            @click="viewClass(classItem)"
          >

            <div class="class-top">
              <strong>{{ classItem.subject }}</strong>

              <div class="class-top-actions">
                <span class="type-chip" :class="classItem.type === 'Study' ? 'chip-study' : 'chip-class'">
                  {{ classItem.type }}
                </span>

                <button
                  class="delete-btn"
                  @click.stop="deleteSchedule(day.day, classItem.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <span class="major">
              <i class="bi bi-mortarboard"></i>
              {{ classItem.major }}
            </span>

            <span>
              <i class="bi bi-clock"></i>
              {{ classItem.time }}
            </span>

            <span>
              <i class="bi bi-door-open"></i>
              {{ classItem.room }}
            </span>

          </div>

        </div>

        <!-- Empty Day -->
        <div v-else class="empty-day">
          <i class="bi bi-calendar-x"></i>
          <p>No classes</p>

          <button
            class="small-add-btn"
            @click="openAddModalForDay(day.day)"
          >
            <i class="bi bi-plus"></i>
            Add
          </button>
        </div>

      </div>

    </div>


    <!-- Add Schedule Modal -->
    <div
      v-if="showAddModal"
      class="modal-overlay"
      @click.self="showAddModal = false"
    >

      <div class="schedule-modal">

        <div class="modal-header">
          <div>
            <h2>Add Schedule</h2>
            <p>Create a new class or study session.</p>
          </div>

          <button
            class="close-btn"
            @click="showAddModal = false"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>


        <!-- Schedule Type -->
        <div class="form-group">
          <label>Schedule Type</label>

          <div class="type-buttons">

            <button
              type="button"
              :class="{ active: newSchedule.type === 'Class' }"
              @click="newSchedule.type = 'Class'"
            >
              <i class="bi bi-book"></i>
              Class
            </button>

            <button
              type="button"
              :class="{ active: newSchedule.type === 'Study' }"
              @click="newSchedule.type = 'Study'"
            >
              <i class="bi bi-pencil-square"></i>
              Study
            </button>

          </div>
        </div>


        <!-- Day -->
        <div class="form-group">
          <label>Day</label>

          <select v-model="newSchedule.day">
            <option
              v-for="day in days"
              :key="day"
              :value="day"
            >
              {{ day }}
            </option>
          </select>
        </div>


        <!-- Major -->
        <div class="form-group">
          <label>Major</label>

          <select v-model="newSchedule.major">
            <option disabled value="">
              Select major
            </option>

            <option
              v-for="major in majors"
              :key="major"
              :value="major"
            >
              {{ major }}
            </option>
          </select>
        </div>


        <!-- Subject -->
        <div class="form-group">
          <label>
            {{ newSchedule.type === 'Study' ? 'Study Subject' : 'Subject' }}
          </label>

          <input
            v-model="newSchedule.subject"
            type="text"
            :placeholder="
              newSchedule.type === 'Study'
                ? 'Example: Database Revision'
                : 'Example: Web Development'
            "
          />
        </div>


        <!-- Time -->
        <div class="time-row">

          <div class="form-group">
            <label>Start Time</label>

            <input
              v-model="newSchedule.startTime"
              type="time"
            />
          </div>

          <div class="form-group">
            <label>End Time</label>

            <input
              v-model="newSchedule.endTime"
              type="time"
            />
          </div>

        </div>


        <!-- Room -->
        <div class="form-group">
          <label>Room</label>

          <input
            v-model="newSchedule.room"
            type="text"
            placeholder="Room 301 / Library / Home"
          />
        </div>


        <!-- Actions -->
        <div class="modal-actions">

          <button
            class="cancel-btn"
            @click="showAddModal = false"
          >
            Cancel
          </button>

          <button
            class="primary-btn"
            @click="addSchedule"
          >
            <i class="bi bi-check-lg"></i>
            Add Schedule
          </button>

        </div>

      </div>

    </div>


    <!-- View Class Modal -->
    <div
      v-if="selectedClass"
      class="modal-overlay"
      @click.self="selectedClass = null"
    >

      <div class="schedule-modal">

        <div class="modal-header">

          <div>
            <h2>Schedule Details</h2>
            <p>{{ selectedClass.type }}</p>
          </div>

          <button
            class="close-btn"
            @click="selectedClass = null"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <div class="class-details">

          <div class="detail-item">
            <i class="bi bi-book"></i>

            <div>
              <small>Subject</small>
              <strong>{{ selectedClass.subject }}</strong>
            </div>
          </div>


          <div class="detail-item">
            <i class="bi bi-mortarboard"></i>

            <div>
              <small>Major</small>
              <strong>{{ selectedClass.major }}</strong>
            </div>
          </div>


          <div class="detail-item">
            <i class="bi bi-calendar3"></i>

            <div>
              <small>Day</small>
              <strong>{{ selectedClass.day }}</strong>
            </div>
          </div>


          <div class="detail-item">
            <i class="bi bi-clock"></i>

            <div>
              <small>Time</small>
              <strong>{{ selectedClass.time }}</strong>
            </div>
          </div>


          <div class="detail-item">
            <i class="bi bi-door-open"></i>

            <div>
              <small>Location</small>
              <strong>{{ selectedClass.room }}</strong>
            </div>
          </div>

        </div>


        <div class="modal-actions">

          <button
            class="cancel-btn"
            @click="selectedClass = null"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { computed, ref } from 'vue'


/* =========================
   Types
========================= */

interface ClassItem {
  id: number
  subject: string
  time: string
  room: string
  major: string
  type: 'Class' | 'Study'
  day: string
}

interface ScheduleDay {
  day: string
  classes: ClassItem[]
}


/* =========================
   Constants
========================= */

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const majors = [
  'Programming Language',
  'Computer Fundamentals',
  'English for Computing',
  'Centery Skill',
  'Basic Electronics'
]

// One accent color per day, used to color-code each schedule card dynamically
const dayAccentMap: Record<string, string> = {
  Monday: '#2563eb',
  Tuesday: '#7c3aed',
  Wednesday: '#0891b2',
  Thursday: '#d97706',
  Friday: '#db2777',
  Saturday: '#16a34a',
  Sunday: '#64748b'
}

function dayAccent(day: string) {
  return dayAccentMap[day] || '#2563eb'
}


/* =========================
   Schedule Data
========================= */

const schedules = ref<ScheduleDay[]>([
  {
    day: 'Monday',
    classes: [
      {
        id: 1,
        subject: 'Programming Language',
        time: '07:30 AM - 09:00 AM',
        room: 'Room 103',
        major: 'Information Technology',
        type: 'Class',
        day: 'Monday'
      },
      {
        id: 2,
        subject: 'Computer Fundamentals',
        time: '09:30 AM - 11:00 AM',
        room: 'Room 104',
        major: 'Information Technology',
        type: 'Class',
        day: 'Monday'
      }
    ]
  },

  {
    day: 'Tuesday',
    classes: [
      {
        id: 3,
        subject: 'Basic Electronics',
        time: '07:30 AM - 09:00 AM',
        room: 'Room 105',
        major: 'Information Technology',
        type: 'Class',
        day: 'Tuesday'
      },
      {
        id: 4,
        subject: 'Programming Language',
        time: '09:30 AM - 11:00 AM',
        room: 'Room 103',
        major: 'Information Technology',
        type: 'Class',
        day: 'Tuesday'
      }
    ]
  },

  {
    day: 'Wednesday',
    classes: [
      {
        id: 5,
        subject: 'Centery Skill',
        time: '07:30 AM - 09:00 AM',
        room: 'Room 102',
        major: 'Information Technology',
        type: 'Class',
        day: 'Wednesday'
      },
      {
        id: 6,
        subject: 'Mathematics',
        time: '09:30 AM - 11:00 AM',
        room: 'Room 101',
        major: 'Information Technology',
        type: 'Class',
        day: 'Wednesday'
      }
    ]
  },

  {
    day: 'Thursday',
    classes: [
      {
        id: 7,
        subject: 'Programming Language',
        time: '07:30 AM - 09:00 AM',
        room: 'Room 103',
        major: 'Information Technology',
        type: 'Class',
        day: 'Thursday'
      },
      {
        id: 8,
        subject: 'English for Computing',
        time: '09:30 AM - 11:00 AM',
        room: 'Room 106',
        major: 'Information Technology',
        type: 'Class',
        day: 'Thursday'
      }
    ]
  },

  {
    day: 'Friday',
    classes: [
      {
        id: 9,
        subject: 'Computer Fundamentals',
        time: '07:30 AM - 09:00 AM',
        room: 'Room 104',
        major: 'Information Technology',
        type: 'Class',
        day: 'Friday'
      },
      {
        id: 10,
        subject: 'Centery Skill',
        time: '09:30 AM - 11:00 AM',
        room: 'Room 101',
        major: 'Information Technology',
        type: 'Class',
        day: 'Friday'
      }
    ]
  },

  {
    day: 'Saturday',
    classes: [
      {
        id: 11,
        subject: 'Mathematics',
        time: '07:30 AM - 09:00 AM',
        room: 'Room 103',
        major: 'Information Technology',
        type: 'Class',
        day: 'Saturday'
      },
      {
        id: 12,
        subject: 'English for Computing',
        time: '09:30 AM - 11:00 AM',
        room: 'Room 106z',
        major: 'Information Technology',
        type: 'Class',
        day: 'Saturday'
      }
    ]
  },

  {
    day: 'Sunday',
    classes: []
  }
])


/* =========================
   Modal Controls
========================= */

const showAddModal = ref(false)

const selectedClass = ref<ClassItem | null>(null)

const selectedMajor = ref('All')


/* =========================
   New Schedule
========================= */

const newSchedule = ref({
  type: 'Class' as 'Class' | 'Study',
  day: 'Monday',
  major: '',
  subject: '',
  startTime: '',
  endTime: '',
  room: ''
})


/* =========================
   Filtered Schedule
========================= */

const filteredSchedules = computed(() => {

  return schedules.value.map(day => ({
    ...day,

    classes:
      selectedMajor.value === 'All'
        ? day.classes
        : day.classes.filter(
            item => item.major === selectedMajor.value
          )
  }))

})


/* =========================
   Reset Form
========================= */

function resetForm() {

  newSchedule.value = {
    type: 'Class',
    day: 'Monday',
    major: '',
    subject: '',
    startTime: '',
    endTime: '',
    room: ''
  }

}


/* =========================
   Open Add Modal
========================= */

function openAddModal() {

  resetForm()

  showAddModal.value = true

}


/* =========================
   Open Add Modal For Day
========================= */

function openAddModalForDay(day: string) {

  resetForm()

  newSchedule.value.day = day

  showAddModal.value = true

}


/* =========================
   Format Time
========================= */

function formatTime(time: string) {

  const [hours, minutes] = time.split(':')

  let hour = Number(hours)

  const ampm = hour >= 12 ? 'PM' : 'AM'

  hour = hour % 12 || 12

  return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`

}


/* =========================
   Add Schedule
========================= */

function addSchedule() {

  if (
    !newSchedule.value.major ||
    !newSchedule.value.subject ||
    !newSchedule.value.startTime ||
    !newSchedule.value.endTime ||
    !newSchedule.value.room
  ) {

    alert('Please fill in all fields.')

    return

  }


  if (newSchedule.value.startTime >= newSchedule.value.endTime) {

    alert('End time must be later than start time.')

    return

  }


  const selectedDay = schedules.value.find(
    item => item.day === newSchedule.value.day
  )


  const newClass: ClassItem = {

    id: Date.now(),

    subject: newSchedule.value.subject,

    time:
      `${formatTime(newSchedule.value.startTime)} - ` +
      `${formatTime(newSchedule.value.endTime)}`,

    room: newSchedule.value.room,

    major: newSchedule.value.major,

    type: newSchedule.value.type,

    day: newSchedule.value.day

  }


  if (selectedDay) {

    selectedDay.classes.push(newClass)

  } else {

    schedules.value.push({

      day: newSchedule.value.day,

      classes: [newClass]

    })

  }


  showAddModal.value = false

}


/* =========================
   View Schedule
========================= */

function viewClass(classItem: ClassItem) {

  selectedClass.value = classItem

}


/* =========================
   Delete Schedule
========================= */

function deleteSchedule(dayName: string, classId: number) {

  const day = schedules.value.find(
    item => item.day === dayName
  )

  if (!day) return

  day.classes = day.classes.filter(
    item => item.id !== classId
  )

}

</script>


<style scoped>

.schedule-page {
  width: 100%;
}


/* =========================
   Page Heading
========================= */

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-heading h1 {
  margin: 0;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.page-heading p {
  margin: 6px 0 0;
  color: #6b7280;
}


/* =========================
   Buttons
========================= */

.primary-btn {
  border: none;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  padding: 11px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #4338ca);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}


/* =========================
   Filter
========================= */

.filter-bar {
  background: white;
  padding: 15px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
}

.filter-group {
  width: 250px;
}

.filter-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #374151;
}

.filter-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 7px;
  background: white;
}


/* =========================
   Schedule Grid
========================= */

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}


/* =========================
   Schedule Card
========================= */

.schedule-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  min-height: 180px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  border-top: 4px solid var(--day-accent, #2563eb);
  transition: transform 0.2s, box-shadow 0.2s;
}

.schedule-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}


/* =========================
   Day Header
========================= */

.schedule-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.schedule-card-header > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.schedule-card-header span {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.schedule-card-header small {
  color: #9ca3af;
  font-size: 12px;
}

.schedule-card-header > i {
  color: var(--day-accent, #2563eb);
  font-size: 20px;
}


/* =========================
   Class Box
========================= */

.class-box {
  background: #f7f9fc;
  border: 1px solid transparent;
  border-left: 3px solid transparent;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.class-box:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.07);
}

.class-box.is-class {
  border-left-color: #2563eb;
}

.class-box.is-class:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.class-box.is-study {
  border-left-color: #d97706;
}

.class-box.is-study:hover {
  border-color: #fde68a;
  background: #fffbeb;
}

.class-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.class-top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.class-box strong {
  display: block;
  color: #111827;
  margin-bottom: 10px;
}

.class-box span {
  display: block;
  color: #666;
  font-size: 14px;
  margin-top: 6px;
}

.class-box i {
  margin-right: 6px;
}

.class-box .major {
  color: #2563eb;
  font-weight: 500;
}


/* =========================
   Type Chip
========================= */

.type-chip {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.chip-class {
  background: #dbeafe;
  color: #1d4ed8;
}

.chip-study {
  background: #fef3c7;
  color: #b45309;
}


/* =========================
   Delete Button
========================= */

.delete-btn {
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  padding: 3px;
}

.delete-btn:hover {
  color: #ef4444;
}


/* =========================
   Empty Day
========================= */

.empty-day {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.empty-day i {
  font-size: 28px;
}

.empty-day p {
  margin: 7px 0 10px;
}

.small-add-btn {
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.small-add-btn:hover {
  background: #2563eb;
  color: white;
}


/* =========================
   Modal
========================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.schedule-modal {
  width: 450px;
  max-width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 14px;
  padding: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}


/* =========================
   Modal Header
========================= */

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}

.modal-header h2 {
  margin: 0;
  color: #111827;
}

.modal-header p {
  margin: 5px 0 0;
  color: #9ca3af;
  font-size: 13px;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
}


/* =========================
   Form
========================= */

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #ddd;
  border-radius: 7px;
  outline: none;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}


/* =========================
   Type Buttons
========================= */

.type-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.type-buttons button {
  padding: 11px;
  border: 1px solid #ddd;
  background: white;
  color: #555;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.type-buttons button.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}


/* =========================
   Time
========================= */

.time-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}


/* =========================
   Modal Actions
========================= */

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  border: 1px solid #ddd;
  background: white;
  padding: 10px 17px;
  border-radius: 8px;
  cursor: pointer;
}


/* =========================
   Details
========================= */

.class-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.detail-item > i {
  font-size: 22px;
  color: #2563eb;
  width: 25px;
  text-align: center;
}

.detail-item small {
  display: block;
  color: #888;
  margin-bottom: 3px;
}

.detail-item strong {
  display: block;
  color: #111827;
}


/* =========================
   Responsive
========================= */

@media (max-width: 1000px) {

  .schedule-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}

@media (max-width: 650px) {

  .page-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .primary-btn {
    width: 100%;
  }

  .schedule-grid {
    grid-template-columns: 1fr;
  }

  .filter-group {
    width: 100%;
  }

  .time-row {
    grid-template-columns: 1fr;
  }

}

</style>