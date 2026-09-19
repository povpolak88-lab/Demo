<template>
  <div>
    <!-- បង្ហាញផ្ទាំង Login បើសិនជាមិនទាន់បានចូលប្រើប្រាស់ -->
    <div v-if="!isLoggedIn" class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoEtiIoFXNIwSiYNEzNYtF1FX5TtXcI1n1pPfdSy-mBg&s=10" width="70" alt="ETEC Logo">
          <h3>ETEC CENTER</h3>
          <p>Management System Login</p>
        </div>

        <div class="auth-form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="admin@example.com" />
        </div>

        <div class="auth-form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="••••••••" @keyup.enter="handleLogin" />
        </div>

        <!-- បន្ថែម .prevent ដើម្បីកុំឱ្យ Submit Form ជាន់គ្នា -->
        <button class="auth-btn" @click.prevent="handleLogin">Sign In</button>
      </div>
    </div>

    <!-- បង្ហាញកូដប្រព័ន្ធទាំងមូលរបស់អ្នកឡើងវិញ នៅពេលដែលបាន Login ជោគជ័យ -->
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isLoggedIn = ref(false)
const email = ref('')
const password = ref('')
const isProcessing = ref(false) // ប្រព័ន្ធការពារការចុចទ្វេដង (Click Lock State)

// បង្កើត Function ដាច់ដោយឡែកសម្រាប់លុបវាចោលវិញពេលឈប់ប្រើ ការពារការដុះជាន់គ្នា (Memory Leak)
function onAppLogout() {
  localStorage.removeItem('etec_logged_in')
  isLoggedIn.value = false
}

// ពិនិត្យមើលស្ថានភាព Login រាល់ពេល Refresh ទំព័រ
onMounted(() => {
  if (localStorage.getItem('etec_logged_in') === 'true') {
    isLoggedIn.value = true
  }
  
  // បន្ថែម { once: false } ប៉ុន្តែធានាថាមាន Listener តែមួយគត់ដែលដំណើរការ
  window.removeEventListener('app-logout', onAppLogout)
  window.addEventListener('app-logout', onAppLogout)
})

// លុបកម្មវិធីស្តាប់ចេញនៅពេល Component ត្រូវបានបំផ្លាញ ការពារការដុះជាន់គ្នាដាច់ខាត
onUnmounted(() => {
  window.removeEventListener('app-logout', onAppLogout)
})

function handleLogin() {
  // ប្រសិនបើកំពុងដំណើរការ មិនអនុញ្ញាតឱ្យចុចទៀតឡើយ (ទប់ស្កាត់ការរត់ Login ច្រើនដង)
  if (isProcessing.value) return

  if (!email.value || !password.value) {
    alert('Please fill in all fields.')
    return
  }

  isProcessing.value = true // បើកប្រព័ន្ធចាក់សោរ

  // គណនីលំនាំដើមសម្រាប់ចូលប្រើប្រាស់
  if (email.value === 'admin@example.com' && password.value === 'admin123') {
    localStorage.setItem('etec_logged_in', 'true')
    isLoggedIn.value = true
    
    // សម្អាត Input ក្រោយចូលជោគជ័យ
    email.value = ''
    password.value = ''
  } else {
    alert('Invalid email or password!')
  }

  // ដោះសោរមកវិញក្រោយពេលដំណើរការរួចរាល់
  setTimeout(() => {
    isProcessing.value = false
  }, 500)
}
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 95vh;
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.auth-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 380px;
}

.auth-logo {
  text-align: center;
  margin-bottom: 24px;
}

.auth-logo h3 {
  margin: 12px 0 4px 0;
  color: #1e293b;
  font-size: 1.3rem;
}

.auth-logo p {
  margin: 0;
  color: #64748b;
  font-size: 0.88rem;
}

.auth-form-group {
  margin-bottom: 16px;
}

.auth-form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 0.88rem;
  color: #344054;
}

.auth-form-group input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.auth-form-group input:focus {
  border-color: #2563eb;
}

.auth-btn {
  width: 100%;
  padding: 11px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}

.auth-btn:hover {
  background: #1d4ed8;
}
</style>
