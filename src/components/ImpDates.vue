<template>
  <p-VirtualScroller
    :items="todos"
    :itemSize="20"
    class="border-1 surface-border border-round"
    style="width: 63vw; height: 50vh"
  >
    <template v-slot:item="{ item, options }">
      <div
        :class="['flex align-items-center p-2', { 'surface-hover': options.odd }]"
        style="height: 8vh"
      >
        <template v-for="(el, index) of item" :key="index">
          <div style="width: 20vw">{{ el }}</div>
        </template>
      </div>
    </template>
  </p-VirtualScroller>
</template>

<script setup>
// firestore imports
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/firebase.js'
import { ref, onMounted } from 'vue'

const dates = ref([])
const todos = ref([])
const toDosCollectionRef = collection(db, 'ToDos')
const toDosCollectionQuery = query(toDosCollectionRef, orderBy('DueDate', 'desc'))

onMounted(() => {
  onSnapshot(toDosCollectionQuery, (querySnapshot) => {
    const fbToDos = []
    querySnapshot.forEach((doc) => {
      const todo = {
        ToDo: doc.data().ToDo,
        ListRef: doc.data().ListRef,
        DueDate: doc.data().DueDate
      }
      fbToDos.push(todo)
      dates.value.push({ ToDo: todo.ToDo, DueDate: todo.DueDate, ListRef: todo.ListRef })
      //   console.log(dates.value)
    })
    todos.value = fbToDos
  })
})
</script>
