<template>
  <div class="register surface-card p-4 shadow-2 border-round w-full lg:w-6 mt-5">
    <div class="text-center mb-5">
      <!-- <img src="/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3" /> -->
      <div class="text-900 text-3xl font-medium mb-3">Welcome To Ultimate Organizer</div>
      <span class="text-600 font-medium line-height-3">Already have an account?</span>
      <a class="font-medium no-underline ml-2 text-primary-600 cursor-pointer" href="/login"
        >Login Now!</a
      >
    </div>
    <div class="ml-3 mr-3">
      <label for="firstname" class="block text-900 font-medium mb-2">First Name</label>
      <p-InputText v-model="first" id="firstname" type="text" class="w-full mb-3" />

      <label for="lastname" class="block text-900 font-medium mb-2">Last Name</label>
      <p-InputText v-model="last" id="lastname" type="text" class="w-full mb-3" />

      <label for="email1" class="block text-900 font-medium mb-2">Email</label>
      <p-InputText v-model="email" id="email1" type="text" class="w-full mb-3" />

      <label for="password1" class="block text-900 font-medium mb-2">Password</label>
      <p-InputText v-model="password" id="password1" type="password" class="w-full mb-3" />
      <p-Button
        label="Register"
        icon="pi pi-user"
        class="w-full mt-6"
        @click="register()"
      ></p-Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'

const first = ref('')
const last = ref('')
const email = ref('')
const password = ref('')

const register = () => {
  console.log('Registering User...')

  // Create user with firebase
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user
      //console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
      console.log('Error Code: ', errorCode)
      console.log('Error Message: ', errorMessage)
    })
  console.log('User Registered')

  // add user
  addUserToFirestore()
}

const addUserToFirestore = () => {
  console.log('Adding User')
  // add user
  addDoc(collection(db, 'Users'), {
    Firstname: first.value,
    Lastname: last.value,
    Email: email.value,
    RegisterDate: Date.now().toString()
  })
  // clear refs
  clear()
}

const clear = () => {
  // clear refs
  first.value = ''
  last.value = ''
  email.value = ''
  password.value = ''
}
</script>

<style scoped>
.register {
  margin: 0 auto;
}
</style>
