<template>
  <div class="ml-4 mr-4 mt-3">
    <p-Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
        <div class="flex align-items-center gap-2">
          <p-Button icon="pi pi-home text-primary" label="Dashboard" @click="toHome()" text plain />
          <p-Button
            icon="pi pi-list-check text-primary"
            label="To Do Lists"
            @click="route.push('/todos')"
            text
            plain
          />
          <p-Button
            icon="pi pi-pen-to-square text-primary"
            label="Notebooks"
            @click="route.push('/test')"
            text
            plain
          />
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2">
          <p-Button
            icon="pi pi-info-circle text-primary"
            label="About"
            @click="route.push('/details')"
            text
            plain
          />
          <p-Button icon="pi pi-shield text-primary" label="Logout" @click="toLogout" text plain />
          <img
            class="mr-2"
            src="../assets/img/me.jpg"
            style="width: 50px; height: 50px; border-radius: 1.5rem"
          />
        </div>
      </template>
    </p-Toolbar>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
const route = useRouter()
const toHome = () => {
  route.push('/')
}

const toLogout = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('User')
      console.log('User Successfully Signed Out')
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ..
      console.log('Error Code: ', errorCode)
      console.log('Error Message: ', errorMessage)
    })
  route.push('/logout')
}
</script>
