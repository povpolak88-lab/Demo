import { reactive, watch } from 'vue'

/* =========================
   Types
========================= */

export interface ClassInfo {
  id: number
  name: string
  room: string
  course: string
}

/* =========================
   LocalStorage persistence
========================= */

const STORAGE_KEY = 'ams_classes'

function loadClasses(): ClassInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('Failed to read classes from localStorage:', err)
  }

  // Default seed data — used only the very first time (nothing in storage yet)
  return [
    { id: 1, name: 'Class A', room: 'Room 305', course: 'Web Frontend Development' },
    { id: 2, name: 'Class B', room: 'Room 204', course: 'Web Backend Development' },
    { id: 3, name: 'Class C', room: 'Room 105', course: 'C++' }
  ]
}

function persistClasses(classes: ClassInfo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes))
  } catch (err) {
    console.error('Failed to save classes to localStorage:', err)
  }
}

/* =========================
   Shared state (singleton)
========================= */

const state = reactive<{ classes: ClassInfo[] }>({
  classes: loadClasses()
})

// Any change to the class list (add / edit / delete) is written straight to
// localStorage, so classes persist across refreshes and browser restarts.
watch(
  () => state.classes,
  val => persistClasses(val),
  { deep: true }
)

/* =========================
   Store API
========================= */

export function useClassStore() {
  function addClass(input: { name: string; room: string; course: string }): ClassInfo {
    const newClass: ClassInfo = {
      id: Date.now(),
      name: input.name,
      room: input.room,
      course: input.course
    }
    state.classes.push(newClass)
    return newClass
  }

  function updateClass(id: number, input: { name: string; room: string; course: string }) {
    const target = state.classes.find(c => c.id === id)
    if (!target) return
    target.name = input.name
    target.room = input.room
    target.course = input.course
  }

  function deleteClass(id: number) {
    state.classes = state.classes.filter(c => c.id !== id)
  }

  function getClassByName(name: string): ClassInfo | undefined {
    return state.classes.find(c => c.name === name)
  }

  return {
    state,
    addClass,
    updateClass,
    deleteClass,
    getClassByName
  }
}