import { createRouter, createWebHistory } from 'vue-router'

import NestedLayout from '../Layout/NestedLayout.vue'

import Dashboard from '../Nested/Dashboard.vue'
import Admin from '../Nested/Admin.vue'
import Attendance from '../Nested/Attendance.vue' 
import Information from '../Nested/Information.vue'
import Message from '../Nested/Message.vue'
import Schedule from '../Nested/Schedule.vue'
import User from '../Nested/User.vue'
import { useAttendanceStore } from '../Data/AttendanceStore'
const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: NestedLayout,
      children: [
        {
          path: '',
          // 💡 ប្តូរមកប្រើ Named Route Redirect វិញ ដើម្បីសុវត្ថិភាពខ្ពស់ និងជៀសវាង Loop Error
          redirect: { name: 'dashboard' }
        },
        {
          // 💡 ដំណោះស្រាយ៖ ដកសញ្ញា / ចេញពីខាងមុខ children paths ទាំងអស់
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'class',
          name: 'class',
          component: () => import('../Nested/Class.vue')
        },
        {
          path: 'admin',
          name: 'admin',
          component: Admin
        },
        {
          path: 'attendance',
          name: 'attendance',
          component: Attendance
        },
        {
          path: 'information',
          name: 'information',
          component: Information
        },
        {
          path: 'message',
          name: 'message',
          component: Message
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: Schedule
        },
        {
          path: 'user',
          name: 'user',
          component: User
        }
      ]
    }
  ]
})

export default router