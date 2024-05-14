<template>
  <div class="login surface-card p-4 shadow-2 border-round w-full lg:w-6 mt-5">
    <div class="text-center mb-5">
      <!-- <img src="/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3" /> -->
      <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
      <span class="text-600 font-medium line-height-3">Don't have an account?</span>
      <a class="font-medium no-underline ml-2 text-primary-600 cursor-pointer" href="/register"
        >Create today!</a
      >
    </div>
    <div class="ml-3 mr-3">
      <label for="email" class="block text-900 font-medium mb-2">Email</label>
      <p-InputText v-model="email" id="email" type="email" class="w-full mb-3" />

      <label for="password" class="block text-900 font-medium mb-2">Password</label>
      <p-InputText v-model="password" id="password" type="password" class="w-full mb-3" />

      <div class="flex align-items-center justify-content-between mb-6">
        <a
          class="font-medium no-underline ml-2 text-right cursor-pointer text-primary-600"
          @click="passwordReset()"
          >Forgot password?</a
        >
      </div>
      <p-Button
        @click="login()"
        id="login"
        label="Sign In"
        icon="pi pi-user"
        class="w-full"
      ></p-Button>
    </div>
  </div>
  <p-Toast></p-Toast>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import router from '@/router'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
// const checked = ref(false)
const email = ref('')
const password = ref('')

const login = () => {
  localStorage.clear()
  console.log('Logging in...')
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user

      // navigate to home page
      router.push('/')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log('Error Code: ', errorCode)
      console.log('Error Message: ', errorMessage)
    })
}

const passwordReset = () => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Password reset email sent!
      toast.add({
        severity: 'info',
        summary: 'Password Reset',
        detail: 'Email instructions sent',
        life: 2000
      })
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
      console.log('Error Code: ', errorCode)
      console.log('Error Message: ', errorMessage)
    })
}
</script>

<style scoped>
.login {
  margin: 0 auto;
}
</style>
