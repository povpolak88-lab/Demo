<template>
  <div>

    <div class="page-heading">

      <div>
        <h1>Information</h1>
        <p>Important information about the attendance system.</p>
      </div>

    </div>


    <div class="info-grid">

      <!-- About System -->
      <div class="info-card" @click="showInfo('about')">

        <div class="info-icon">
          <i class="bi bi-info-circle-fill"></i>
        </div>

        <h3>About System</h3>

        <p>
          The Attendance Management System helps administrators
          manage students, classes, schedules, and attendance records
          efficiently.
        </p>

      </div>


      <!-- Attendance Rules -->
      <div class="info-card" @click="showInfo('rules')">

        <div class="info-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>

        <h3>Attendance Rules</h3>

        <ul>
          <li>Present when students arrive on time.</li>
          <li>Late when students arrive after class starts.</li>
          <li>Absent when students do not attend.</li>
        </ul>

      </div>


      <!-- Support -->
      <div class="info-card" @click="showInfo('support')">

        <div class="info-icon">
          <i class="bi bi-headset"></i>
        </div>

        <h3>Support</h3>

        <p>
          If you have problems using the system,
          contact the administrator for assistance.
        </p>

      </div>

    </div>


    <!-- Information Modal -->
    <div v-if="selectedInfo" class="info-modal">

      <div class="modal-content">

        <button class="close-btn" @click="closeInfo">
          <i class="bi bi-x-lg"></i>
        </button>

        <div v-if="selectedInfo === 'about'">

          <div class="modal-icon">
            <i class="bi bi-info-circle-fill"></i>
          </div>

          <h2>About System</h2>

          <p>
            The Attendance Management System is designed to help
            administrators manage students, classes, schedules,
            and attendance records easily and efficiently.
          </p>

        </div>


        <div v-if="selectedInfo === 'rules'">

          <div class="modal-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>

          <h2>Attendance Rules</h2>

          <ul>
            <li>Present - Student arrives on time.</li>
            <li>Late - Student arrives after class starts.</li>
            <li>Absent - Student does not attend class.</li>
          </ul>

        </div>


        <div v-if="selectedInfo === 'support'">

          <div class="modal-icon">
            <i class="bi bi-headset"></i>
          </div>

          <h2>Support</h2>

          <p>
            If you experience problems using the system,
            please contact the administrator for assistance.
          </p>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue'

const selectedInfo = ref<string | null>(null)

function showInfo(type: string) {
  selectedInfo.value = type
}

function closeInfo() {
  selectedInfo.value = null
}
</script>

<style>
/* ================================
   INFORMATION PAGE
================================ */

.page-heading {
  margin-bottom: 28px;
}

.page-heading h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
}

.page-heading p {
  margin-top: 7px;
  color: #64748b;
  font-size: 15px;
}


/* ================================
   INFORMATION GRID
================================ */

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}


/* ================================
   INFORMATION CARD
================================ */

.info-card {
  position: relative;
  background: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  padding: 26px;

  min-height: 250px;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
}


/* Card hover */

.info-card:hover {
  transform: translateY(-7px);

  border-color: #cbd5e1;

  box-shadow:
    0 15px 35px rgba(15, 23, 42, 0.12);
}


/* Card title */

.info-card h3 {
  margin: 18px 0 10px;

  font-size: 20px;
  font-weight: 700;

  color: #1e293b;
}


/* Card paragraph */

.info-card p {
  margin: 0;

  color: #64748b;

  font-size: 14px;

  line-height: 1.7;
}


/* Card list */

.info-card ul {
  padding-left: 20px;
  margin: 12px 0 0;

  color: #64748b;

  font-size: 14px;

  line-height: 1.8;
}

.info-card li {
  margin-bottom: 5px;
}


/* ================================
   ICON
================================ */

.info-icon {
  width: 55px;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 25px;

  transition: 0.25s ease;
}


/* Icon hover */

.info-card:hover .info-icon {
  transform: scale(1.08);
}


/* Different card icons */

.info-card:nth-child(2) .info-icon {
  background: #ecfdf5;
  color: #2563eb;
}

.info-card:nth-child(3) .info-icon {
  background: #ecfdf5;
   color: #2563eb;
}


/* ================================
   MODAL BACKGROUND
================================ */

.info-modal {
  position: fixed;

  inset: 0;

  background: rgba(15, 23, 42, 0.65);

  backdrop-filter: blur(5px);

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 20px;

  z-index: 1000;

  animation: fadeIn 0.2s ease;
}


/* ================================
   MODAL
================================ */

.modal-content {
  position: relative;

  width: 100%;
  max-width: 500px;

  background: #ffffff;

  border-radius: 20px;

  padding: 35px;

  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.25);

  animation: modalShow 0.25s ease;
}


/* Modal heading */

.modal-content h2 {
  margin: 0 0 14px;

  font-size: 24px;

  font-weight: 700;

  color: white;
}


/* Modal paragraph */

.modal-content p {
  margin: 0;

  color: #eff1f4;

  line-height: 1.8;

  font-size: 15px;
}


/* Modal list */

.modal-content ul {
  margin: 10px 0 0;

  padding-left: 22px;

  color: white;

  line-height: 1.9;
}

.modal-content li {
  margin-bottom: 7px;
}


/* ================================
   MODAL ICON
================================ */

.modal-icon {
  width: 65px;
  height: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 18px;

  border-radius: 16px;

  background: #eff6ff;

  color: #2563eb;

  font-size: 30px;
}


/* ================================
   CLOSE BUTTON
================================ */

.close-btn {
  position: absolute;

  top: 18px;
  right: 18px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 10px;

  background: #f1f5f9;

  color: white;

  font-size: 16px;

  cursor: pointer;

  transition: 0.2s ease;
}


.close-btn:hover {
  background: #e2e8f0;

  color: #1e293b;

  transform: rotate(90deg);
}


/* ================================
   ANIMATION
================================ */

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


@keyframes modalShow {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}


/* ================================
   RESPONSIVE
================================ */

@media (max-width: 1000px) {

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}


@media (max-width: 650px) {

  .info-grid {
    grid-template-columns: 1fr;
  }

  .page-heading h1 {
    font-size: 25px;
  }

  .info-card {
    min-height: auto;
  }

  .modal-content {
    padding: 28px 22px;
  }

}
</style>