<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoEtiIoFXNIwSiYNEzNYtF1FX5TtXcI1n1pPfdSy-mBg&s=10" width="62" alt="ETEC Logo">
        </div>
        <div>
          <h4>ETEC CENTER</h4>
          <small>Management System</small>
        </div>
      </div>
       <hr>

      <!-- Menu -->
      <nav class="sidebar-menu">
        <p class="menu-title">MAIN MENU</p>

        <router-link to="/dashboard" class="menu-item">
          <i class="bi bi-grid-1x2-fill"></i>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/attendance" class="menu-item">
          <i class="bi bi-calendar-check-fill"></i>
          <span>Attendance</span>
        </router-link>

        <router-link to="/schedule" class="menu-item">
          <i class="bi bi-calendar3"></i>
          <span>Schedule</span>
        </router-link>

        <router-link to="/information" class="menu-item">
          <i class="bi bi-info-circle-fill"></i>
          <span>Information</span>
        </router-link>

        <router-link to="/message" class="menu-item">
          <i class="bi bi-chat-left-text-fill"></i>
          <span>Messages</span>
          <span class="message-badge">3</span>
        </router-link>

        <p class="menu-title">MANAGEMENT</p>

        <router-link to="/user" class="menu-item">
          <i class="bi bi-people-fill"></i>
          <span>Students</span>
        </router-link>

        <router-link to="/admin" class="menu-item">
          <i class="bi bi-person-gear"></i>
          <span>Admin</span>
        </router-link>
      </nav>

      <!-- Sidebar Bottom -->
      <div class="sidebar-bottom">
        <div class="help-box">
          <i class="bi bi-question-circle-fill"></i>
          <div>
            <strong>Need Help?</strong>
            <small>Contact administrator</small>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div>
          <button class="mobile-menu">
            <i class="bi bi-list"></i>
          </button>
        </div>

        <div class="header-right">
          <button class="header-icon">
            <i class="bi bi-bell"></i>
            <span class="notification-dot"></span>
          </button>

          <!-- Interactive Profile Trigger Container -->
          <div class="profile-container">
            <div 
              class="profile" 
              :class="{ active: isDropdownOpen }"
              @click="toggleDropdown"
            >
              <div class="profile-image">
                <i class="bi bi-person-fill"></i>
              </div>
              
              <div class="profile-info">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
              <i class="bi bi-chevron-down dropdown-arrow" :class="{ rotated: isDropdownOpen }"></i>
            </div>

            <!-- Dropdown Menu Options Panel -->
            <Transition name="slide-fade">
              <div v-if="isDropdownOpen" class="profile-dropdown">
                <router-link to="/admin" class="dropdown-item" @click="isDropdownOpen = false">
                  <i class="bi bi-person"></i>
                  <span>My Profile</span>
                </router-link>
                <hr class="dropdown-divider" />
                <button class="dropdown-item logout-btn" @click="handleLogout">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Log Out</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page Content Screen -->
      <section class="page-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const profileImage = ref("https://scontent.fpnh5-3.fna.fbcdn.net/v/t39.30808-6/326740429_1933386307027242_4544503231498968043_n.png?stp=dst-png&cstp=mx265x265&ctp=s265x265&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFqEDwPBYh4gLmEP7-Hs9jurxABM_T-NmevEAEz9P42Z528dX7hswD3z9LOlgxxTTTIkl4qrIi80esFO22uJudq&_nc_ohc=9mQnPo-dFK8Q7kNvwHX6kTn&_nc_oc=AdonI8aQf6zDVuIk8zx5Fq6vXzdVHCOa90xlfX5DyYyLosDS3sqwMcAniaHVt0_8q2w&_nc_zt=23&_nc_ht=scontent.fpnh5-3.fna&_nc_gid=rSK5_hDLKHP18hhgxBpRGg&_nc_ss=7b2a8&oh=00_AQGjph-qWn8E-dRT0oY7hg0i7w9n1CzlDQm3-80RIacyaA&oe=6A89B718")

const isDropdownOpen = ref(false)

function toggleDropdown(event) {
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdownOutside(event) {
  const container = document.querySelector('.profile-container')
  if (container && !container.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

function handleLogout() {
  isDropdownOpen.value = false
  alert('Logging out of the management system...')
}

onMounted(() => {
  window.addEventListener('click', closeDropdownOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOutside)
})
</script>

<style scoped>
/* Profile Container Layout Configuration */
.profile-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.profile {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  user-select: none;
}

.profile:hover, .profile.active {
  background-color: #f4f6fa;
}

.dropdown-arrow {
  font-size: 0.85rem;
  color: #a0aec0;
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Styled Dropdown Overlay Panel Box Match */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  min-width: 175px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f2f5;
  padding: 8px;
  z-index: 100;
}

/* Individual Dropdown Item Alignment */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.92rem;
  font-weight: 400;
  color: #4a5568;
  text-decoration: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.dropdown-item i {
  font-size: 1.1rem;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover style configuration */
.dropdown-item:hover:not(.logout-btn) {
  background-color: #f7fafc;
  color: #1a202c;
}

.dropdown-item:hover:not(.logout-btn) i {
  color: #4a5568;
}

.dropdown-divider {
  margin: 6px 0;
  border: 0;
  border-top: 1px solid #edf0f5;
}

/* Destructive Exit Button configuration Layout */
.logout-btn {
  color: #e53e3e;
}

.logout-btn i {
  color: #e53e3e;
}

.logout-btn:hover {
  background-color: #fff5f5;
  color: #c53030;
}

.logout-btn:hover i {
  color: #c53030;
}

/* Dropdown Slide & Fade Transition Animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-4px);
  opacity: 0;
}
/* Container positioning */
.profile-container {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Profile Trigger Card */
.profile {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: #f8fafc;
  transition: background-color 0.2s ease;
  user-select: none;
}

.profile:hover, .profile.active {
  background-color: #f1f5f9;
}

/* Circular Icon Badge */
.profile-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image i {
  color: #2563eb;
  font-size: 1.25rem;
}

/* User Info Styling */
.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info strong {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.profile-info small {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 2px;
}

/* Dropdown Arrow */
.dropdown-arrow {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-left: 6px;
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Floating Dropdown Card */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  min-width: 190px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  padding: 10px 8px;
  z-index: 100;
}

/* Items Inside Dropdown */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.92rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  cursor: pointer;
  border-radius: 10px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.dropdown-item i {
  font-size: 1.15rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropdown-item:hover:not(.logout-btn) {
  background-color: #f8fafc;
  color: #1e293b;
}

.dropdown-item:hover:not(.logout-btn) i {
  color: #2563eb;
}

.dropdown-divider {
  margin: 6px 0;
  border: 0;
  border-top: 1px solid #f1f5f9;
}

/* Logout Item Styling */
.logout-btn {
  color: #ef4444;
}

.logout-btn i {
  color: #ef4444;
}

.logout-btn:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.logout-btn:hover i {
  color: #dc2626;
}

/* Vue Slide Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}
</style>
