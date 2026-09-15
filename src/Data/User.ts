import { reactive } from 'vue'

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Permission' | ''

export interface User {
  id: number
  name: string
  gender: string
  attendance: AttendanceStatus
  permissionNote?: string
} 

export const users = reactive<User[]>([
  { id: 1, name: 'Sok Dara', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 2, name: 'Keo Bopha', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 3, name: 'Chan Vanna', gender: 'Male', attendance: 'Permission', permissionNote: 'Doctor appointment' },
  { id: 4, name: 'Ly Sophea', gender: 'Female', attendance: 'Absent', permissionNote: '' },
  { id: 5, name: 'Nguon Narin', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 6, name: 'Chhim Sreyneang', gender: 'Female', attendance: 'Late', permissionNote: '' },
  { id: 7, name: 'Ouk Samnang', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 8, name: 'Seng Malis', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 9, name: 'Bun Thoeun', gender: 'Male', attendance: 'Absent', permissionNote: '' },
  { id: 10, name: 'Khim Sreypov', gender: 'Female', attendance: 'Permission', permissionNote: 'Family event' },
  { id: 11, name: 'Ros Sopheap', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 12, name: 'Chea Chanda', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 13, name: 'Vong Socheat', gender: 'Male', attendance: 'Late', permissionNote: '' },
  { id: 14, name: 'Lim Sreymom', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 15, name: 'Kong Piseth', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 16, name: 'San Sreyleak', gender: 'Female', attendance: 'Absent', permissionNote: '' },
  { id: 17, name: 'Heng Borey', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 18, name: 'Touch Sophea', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 19, name: 'Meas Rithy', gender: 'Male', attendance: 'Permission', permissionNote: 'Sick leave' },
  { id: 20, name: 'Pek Sreyroth', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 21, name: 'Rath Seyha', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 22, name: 'Phon Chanthou', gender: 'Female', attendance: 'Late', permissionNote: '' },
  { id: 23, name: 'Tep Kalyan', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 24, name: 'Kiv Sovann', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 25, name: 'Suon Sreynit', gender: 'Female', attendance: 'Absent', permissionNote: '' },
  { id: 26, name: 'Srey Makara', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 27, name: 'Chan Sreypich', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 28, name: 'Yim Vibol', gender: 'Male', attendance: 'Late', permissionNote: '' },
  { id: 29, name: 'Long Leakhena', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 30, name: 'Khun Sambath', gender: 'Male', attendance: 'Permission', permissionNote: 'Personal business' },
  { id: 31, name: 'Men Sophat', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 32, name: 'Choun Davin', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 33, name: 'Preap Rith', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 34, name: 'Noun Sreynoch', gender: 'Female', attendance: 'Absent', permissionNote: '' },
  { id: 35, name: 'In Sovannarith', gender: 'Male', attendance: 'Late', permissionNote: '' },
  { id: 36, name: 'Keo Montha', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 37, name: 'Mao Sarin', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 38, name: 'Soy Sreyoun', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 39, name: 'Ung Vathanak', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 40, name: 'Sorn Sreymeas', gender: 'Female', attendance: 'Permission', permissionNote: 'Toothache' },
  { id: 41, name: 'Phorn Rotha', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 42, name: 'Sam Ath Sreynet', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 43, name: 'Thon Chamroeun', gender: 'Male', attendance: 'Late', permissionNote: '' },
  { id: 44, name: 'Eam Sreylin', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 45, name: 'Loun Sovanna', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 46, name: 'Prum Sreypheap', gender: 'Female', attendance: 'Absent', permissionNote: '' },
  { id: 47, name: 'Yun Kimhong', gender: 'Male', attendance: 'Present', permissionNote: '' },
  { id: 48, name: 'Chuon Sreynu', gender: 'Female', attendance: 'Present', permissionNote: '' },
  { id: 49, name: 'Hao Chansocheat', gender: 'Male', attendance: 'Late', permissionNote: '' },
  { id: 50, name: 'Im Sreynet', gender: 'Female', attendance: 'Present', permissionNote: '' }
])

export const updateStudentAttendance = (id: number, status: AttendanceStatus) => {
  const user = users.find(u => u.id === id)
  if (user) {
    user.attendance = status
    // Clear permission note if switching away from Permission status
    if (status !== 'Permission') {
      user.permissionNote = ''
    }
  }
}
