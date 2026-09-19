import { reactive, watch } from 'vue'

export interface Student {
  id: string
  name: string
  email: string
  className: string
}

export interface AttendanceRecord {
  status: 'Present' | 'Absent' | 'Late'
  time: string
  subject: string
}

// records[date][studentId] = AttendanceRecord
interface AttendanceState {
  students: Student[]
  records: Record<string, Record<string, AttendanceRecord>>
}

const STORAGE_KEY = 'attendance_app_data'

function loadState(): AttendanceState {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse attendance data', e)
    }
  }
  return {
    students: [
  { id: '1', name: 'John Smith', email: 'john@example.com', className: 'Class A' },
  { id: '2', name: 'Emma Wilson', email: 'emma@example.com', className: 'Class A' },
  { id: '3', name: 'Michael Johnson', email: 'michael@example.com', className: 'Class A' },
  { id: '4', name: 'Sophia Brown', email: 'sophia@example.com', className: 'Class A' },
  { id: '5', name: 'Daniel Davis', email: 'daniel@example.com', className: 'Class A' },
  { id: '6', name: 'Alexander White', email: 'alexander@example.com', className: 'Class A' },
  { id: '7', name: 'Mia Harris', email: 'mia.h@example.com', className: 'Class A' },
  { id: '8', name: 'Henry Martin', email: 'henry@example.com', className: 'Class A' },
  { id: '9', name: 'Amelia Thompson', email: 'amelia@example.com', className: 'Class A' },
  { id: '10', name: 'Sebastian Garcia', email: 'sebastian@example.com', className: 'Class A' },
  { id: '11', name: 'Harper Martinez', email: 'harper@example.com', className: 'Class A' },
  { id: '12', name: 'Jack Robinson', email: 'jack@example.com', className: 'Class A' },
  { id: '13', name: 'Evelyn Clark', email: 'evelyn@example.com', className: 'Class A' },
  { id: '14', name: 'Owen Rodriguez', email: 'owen@example.com', className: 'Class A' },
  { id: '15', name: 'Abigail Lewis', email: 'abigail@example.com', className: 'Class A' },
  // Class B (15 students)
  { id: '16', name: 'Olivia Miller', email: 'olivia@example.com', className: 'Class B' },
  { id: '17', name: 'James Wilson', email: 'james@example.com', className: 'Class B' },
  { id: '18', name: 'Ava Anderson', email: 'ava@example.com', className: 'Class B' },
  { id: '19', name: 'William Taylor', email: 'william@example.com', className: 'Class B' },
  { id: '20', name: 'Isabella Thomas', email: 'isabella@example.com', className: 'Class B' },
  { id: '21', name: 'Liam Walker', email: 'liam@example.com', className: 'Class B' },
  { id: '22', name: 'Emily Hall', email: 'emily@example.com', className: 'Class B' },
  { id: '23', name: 'Noah Allen', email: 'noah@example.com', className: 'Class B' },
  { id: '24', name: 'Elizabeth Young', email: 'elizabeth@example.com', className: 'Class B' },
  { id: '25', name: 'Oliver Hernandez', email: 'oliver@example.com', className: 'Class B' },
  { id: '26', name: 'Sofia King', email: 'sofia@example.com', className: 'Class B' },
  { id: '27', name: 'Elijah Wright', email: 'elijah@example.com', className: 'Class B' },
  { id: '28', name: 'Avery Lopez', email: 'avery@example.com', className: 'Class B' },
  { id: '29', name: 'Logan Hill', email: 'logan@example.com', className: 'Class B' },
  { id: '30', name: 'Ella Scott', email: 'ella@example.com', className: 'Class B' },
  // Class C (15 students)
  { id: '31', name: 'Lucas Martin', email: 'lucas@example.com', className: 'Class C' },
  { id: '32', name: 'Mia Garcia', email: 'mia@example.com', className: 'Class C' },
  { id: '33', name: 'Ethan Martinez', email: 'ethan@example.com', className: 'Class C' },
  { id: '34', name: 'Charlotte Robinson', email: 'charlotte@example.com', className: 'Class C' },
  { id: '35', name: 'Benjamin Clark', email: 'benjamin@example.com', className: 'Class C' },
  { id: '36', name: 'Mason Green', email: 'mason@example.com', className: 'Class C' },
  { id: '37', name: 'Scarlett Adams', email: 'scarlett@example.com', className: 'Class C' },
  { id: '38', name: 'Ethan Baker', email: 'ethan.b@example.com', className: 'Class C' },
  { id: '39', name: 'Grace Gonzalez', email: 'grace@example.com', className: 'Class C' },
  { id: '40', name: 'Jacob Nelson', email: 'jacob@example.com', className: 'Class C' },
  { id: '41', name: 'Chloe Carter', email: 'chloe@example.com', className: 'Class C' },
  { id: '42', name: 'Jackson Mitchell', email: 'jackson@example.com', className: 'Class C' },
  { id: '43', name: 'Camila Perez', email: 'camila@example.com', className: 'Class C' },
  { id: '44', name: 'Aiden Roberts', email: 'aiden@example.com', className: 'Class C' },
  { id: '45', name: 'Aria Turner', email: 'aria@example.com', className: 'Class C' }
    ],
    records: {}
  }
}

// Module-level singleton so every component that imports this shares ONE instance
const state = reactive<AttendanceState>(loadState())

watch(
  state,
  () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)),
  { deep: true }
)

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function currentTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function setAttendance(date: string, studentId: string, status: AttendanceRecord['status'], subject: string) {
  if (!state.records[date]) state.records[date] = {}
  state.records[date][studentId] = {
    status,
    time: status === 'Absent' ? '--' : currentTime(),
    subject
  }
}

function getAttendance(date: string, studentId: string): AttendanceRecord | undefined {
  return state.records[date]?.[studentId]
}

// Overall attendance rate for a student, across every date that has a record for them
function getStudentAttendanceRate(studentId: string): number {
  const dates = Object.keys(state.records)
  let total = 0
  let present = 0
  dates.forEach(date => {
    const rec = state.records[date][studentId]
    if (rec) {
      total++
      if (rec.status === 'Present' || rec.status === 'Late') present++
    }
  })
  return total === 0 ? 100 : Math.round((present / total) * 100)
}

function addStudent(student: Omit<Student, 'id'>) {
  const maxIdNum = state.students.reduce((max, s) => {
    const num = parseInt(s.id.replace('ST', ''), 10)
    return num > max ? num : max
  }, 0)
  const id = `ST${String(maxIdNum + 1).padStart(3, '0')}`
  state.students.push({ id, ...student })
}

function updateStudent(id: string, data: Partial<Student>) {
  const idx = state.students.findIndex(s => s.id === id)
  if (idx !== -1) state.students[idx] = { ...state.students[idx], ...data }
}

function deleteStudent(id: string) {
  state.students = state.students.filter(s => s.id !== id)
  Object.keys(state.records).forEach(date => delete state.records[date][id])
}

export function useAttendanceStore() {
  return {
    state,
    todayStr,
    setAttendance,
    getAttendance,
    getStudentAttendanceRate,
    addStudent,
    updateStudent,
    deleteStudent
  }
}