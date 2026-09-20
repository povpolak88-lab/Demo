import { reactive } from 'vue'

/*
|--------------------------------------------------------------------------
| Shared Schedule Store
|--------------------------------------------------------------------------
| Single source of truth for class schedule entries. Both Schedule.vue
| (create/manage schedules) and Dashboard.vue (Today's Schedule card)
| read from this same reactive state, so they always stay in sync.
*/

export interface ScheduleItem {
  id: number
  subject: string
  startTime: string // 24h "HH:mm", used for sorting / status calc
  endTime: string   // 24h "HH:mm"
  time: string       // pre-formatted display string, e.g. "02:00 PM - 03:30 PM"
  room: string
  className: string
  teacher: string
  type: 'Class' | 'Study'
  day: string
}

interface ScheduleState {
  items: ScheduleItem[]
}

export function formatTime(time: string): string {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  let hour = Number(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${String(hour).padStart(2, '0')}:${minutes} ${ampm}`
}

const state = reactive<ScheduleState>({
  items: [
    {
      id: 1,
      subject: 'Web Frontend Development',
      startTime: '14:00',
      endTime: '15:30',
      time: '02:00 PM - 03:30 PM',
      room: 'Room 305',
      className: 'Class A',
      teacher: 'Chantha Mony',
      type: 'Class',
      day: 'Monday to Thursday'
    },
    {
      id: 2,
      subject: 'Database Management',
      startTime: '14:00',
      endTime: '15:30',
      time: '02:00 PM - 03:30 PM',
      room: 'Room 204',
      className: 'Class B',
      teacher: 'Sokha Rith',
      type: 'Class',
      day: 'Monday to Thursday'
    },
    {
      id: 3,
      subject: 'Computer Network',
      startTime: '14:00',
      endTime: '17:00',
      time: '02:00 PM - 05:00 PM',
      room: 'Room 105',
      className: 'Class C',
      teacher: 'Vannak Dara',
      type: 'Class',
      day: 'Saturday to Sunday'
    }
  ]
})

function addItem(item: Omit<ScheduleItem, 'id'>) {
  state.items.push({ ...item, id: Date.now() })
}

function deleteItem(id: number) {
  state.items = state.items.filter(item => item.id !== id)
}

export function useScheduleStore() {
  return {
    state,
    addItem,
    deleteItem,
    formatTime
  }
}