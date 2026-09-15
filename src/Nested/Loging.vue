<template>
  <div class="login-page">

    <div class="login-box">

      <div class="login-icon">
        <i class="bi bi-person-fill"></i>
      </div>

      <h1>Welcome Back</h1>

      <p>Login to your account</p>

      <form @submit.prevent="login">

        <div class="form-group">
          <label>Username</label>

          <input
            v-model="username"
            type="text"
            placeholder="Enter username"
          >
        </div>

        <div class="form-group">
          <label>Password</label>

          <input
            v-model="password"
            type="password"
            placeholder="Enter password"
          >
        </div>

        <button type="submit">
          <i class="bi bi-box-arrow-in-right"></i>
          Login
        </button>

      </form>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')

function login() {

  if (username.value === 'admin' && password.value === '1234') {

    router.push('/dashboard')

  } else {

    alert('Username or password is incorrect.')

  }

}

</script>

<style scoped>

.login-page {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f1f5f9;
}

.login-box {
  width: 90%;
  max-width: 400px;

  padding: 35px;

  background: white;

  border-radius: 18px;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);

  text-align: center;
}

.login-icon {
  width: 65px;
  height: 65px;

  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #2563eb;
  color: white;

  font-size: 28px;
}

.login-box h1 {
  margin: 0;

  color: #1e293b;
}

.login-box p {
  color: #64748b;

  margin-bottom: 25px;
}

.form-group {
  text-align: left;

  margin-bottom: 18px;
}

.form-group label {
  display: block;

  margin-bottom: 7px;

  font-weight: 600;

  color: #334155;
}

.form-group input {
  width: 100%;

  box-sizing: border-box;

  padding: 12px;

  border: 1px solid #cbd5e1;

  border-radius: 8px;

  outline: none;
}

.form-group input:focus {
  border-color: #2563eb;
}

.login-box button {
  width: 100%;

  padding: 12px;

  border: none;

  border-radius: 8px;

  background: #2563eb;

  color: white;

  font-size: 15px;

  cursor: pointer;
}

.login-box button:hover {
  background: #1d4ed8;
}

</style>