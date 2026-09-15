```vue
<template>
  <div>

    <div class="page-heading">

      <div>
        <h1>Admin</h1>
        <p>Manage your attendance system settings.</p>
      </div>

    </div>


    <div class="settings-grid">


      <div class="setting-card">

        <div class="setting-icon">
          <i class="bi bi-person-gear"></i>
        </div>

        <h3>Account Settings</h3>

        <p>
          Manage administrator account information.
        </p>

        <button
          class="secondary-btn"
          @click="openAccount"
        >
          Manage Account
        </button>

      </div>



      <div class="setting-card">

        <div class="setting-icon">
          <i class="bi bi-shield-check"></i>
        </div>

        <h3>Security</h3>

        <p>
          Manage password and security preferences.
        </p>

        <button
          class="secondary-btn"
          @click="openSecurity"
        >
          Security Settings
        </button>

      </div>



      <div class="setting-card">

        <div class="setting-icon">
          <i class="bi bi-gear-fill"></i>
        </div>

        <h3>System Settings</h3>

        <p>
          Configure attendance system settings.
        </p>

        <button
          class="secondary-btn"
          @click="openSystem"
        >
          System Settings
        </button>

      </div>


    </div>



    <!-- Account Settings Modal -->

    <div
      v-if="activeSetting === 'account'"
      class="setting-modal-overlay"
      @click.self="closeModal"
    >

      <div class="setting-modal">

        <div class="modal-title">

          <div>
            <h3>Account Settings</h3>
            <p>Manage administrator account information.</p>
          </div>

          <button
            class="close-btn"
            @click="closeModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <div class="form-group">

          <label>Administrator Name</label>

          <input
            v-model="adminName"
            type="text"
            placeholder="Enter administrator name"
          />

        </div>


        <div class="form-group">

          <label>Email</label>

          <input
            v-model="adminEmail"
            type="email"
            placeholder="Enter email"
          />

        </div>


        <div class="modal-actions">

          <button
            class="secondary-btn"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            class="primary-btn"
            @click="saveAccount"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>



    <!-- Security Modal -->

    <div
      v-if="activeSetting === 'security'"
      class="setting-modal-overlay"
      @click.self="closeModal"
    >

      <div class="setting-modal">

        <div class="modal-title">

          <div>
            <h3>Security Settings</h3>
            <p>Manage password and security preferences.</p>
          </div>

          <button
            class="close-btn"
            @click="closeModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <div class="form-group">

          <label>Current Password</label>

          <input
            v-model="currentPassword"
            type="password"
            placeholder="Current password"
          />

        </div>


        <div class="form-group">

          <label>New Password</label>

          <input
            v-model="newPassword"
            type="password"
            placeholder="New password"
          />

        </div>


        <div class="form-group">

          <label>Confirm Password</label>

          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
          />

        </div>


        <div class="modal-actions">

          <button
            class="secondary-btn"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            class="primary-btn"
            @click="changePassword"
          >
            Update Password
          </button>

        </div>

      </div>

    </div>



    <!-- System Settings Modal -->

    <div
      v-if="activeSetting === 'system'"
      class="setting-modal-overlay"
      @click.self="closeModal"
    >

      <div class="setting-modal">

        <div class="modal-title">

          <div>
            <h3>System Settings</h3>
            <p>Configure attendance system settings.</p>
          </div>

          <button
            class="close-btn"
            @click="closeModal"
          >
            <i class="bi bi-x-lg"></i>
          </button>

        </div>


        <div class="form-group">

          <label>System Name</label>

          <input
            v-model="systemName"
            type="text"
            placeholder="System name"
          />

        </div>


        <div class="form-group">

          <label>Work Start Time</label>

          <input
            v-model="startTime"
            type="time"
          />

        </div>


        <div class="form-group">

          <label>Work End Time</label>

          <input
            v-model="endTime"
            type="time"
          />

        </div>


        <div class="modal-actions">

          <button
            class="secondary-btn"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            class="primary-btn"
            @click="saveSystem"
          >
            Save Settings
          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue'


type SettingType =
  | 'account'
  | 'security'
  | 'system'
  | null


const activeSetting = ref<SettingType>(null)


const adminName = ref('Administrator')
const adminEmail = ref('admin@example.com')


const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')


const systemName = ref('Attendance Management System')
const startTime = ref('08:00')
const endTime = ref('17:00')



function openAccount() {
  activeSetting.value = 'account'
}


function openSecurity() {
  activeSetting.value = 'security'
}


function openSystem() {
  activeSetting.value = 'system'
}


function closeModal() {
  activeSetting.value = null
}



function saveAccount() {

  if (!adminName.value || !adminEmail.value) {
    alert('Please fill in all account information.')
    return
  }

  alert('Account information saved successfully.')

  closeModal()
}



function changePassword() {

  if (
    !currentPassword.value ||
    !newPassword.value ||
    !confirmPassword.value
  ) {
    alert('Please fill in all password fields.')
    return
  }


  if (newPassword.value !== confirmPassword.value) {
    alert('New password and confirm password do not match.')
    return
  }


  alert('Password updated successfully.')

  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''

  closeModal()
}



function saveSystem() {

  if (!systemName.value) {
    alert('Please enter the system name.')
    return
  }


  alert('System settings saved successfully.')

  closeModal()
}

</script>


<style scoped>

.setting-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
}


.setting-modal {
  width: 460px;
  max-width: 90%;

  background: white;

  border-radius: 12px;

  padding: 24px;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}


.modal-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 22px;
}


.modal-title h3 {
  margin: 0;
}


.modal-title p {
  margin: 5px 0 0;
  color: #777;
}


.close-btn {
  border: none;
  background: transparent;

  font-size: 18px;

  cursor: pointer;
}


.form-group {
  margin-bottom: 16px;
}


.form-group label {
  display: block;

  margin-bottom: 7px;

  font-weight: 600;
}


.form-group input {
  width: 100%;

  padding: 10px 12px;

  border: 1px solid #ddd;

  border-radius: 7px;

  outline: none;
}


.form-group input:focus {
  border-color: #2f8f7e;
}


.modal-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 20px;
}


.primary-btn,
.secondary-btn,
.close-btn {
  cursor: pointer;
}

</style>
```
