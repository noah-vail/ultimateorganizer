<template>
  <div class="container mt-5">
    <!-- Side Menu -->
    <div class="ml-2">
      <p-Menu :model="lists">
        <template #start>
          <span class="inline-flex align-items-center gap-1 px-2 py-2">
            <svg
              width="35"
              height="40"
              viewBox="0 0 35 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-2rem"
            >
              <path d="..." fill="var(--primary-color)" />
              <path d="..." fill="var(--text-color)" />
            </svg>
            <span class="font-medium text-xl font-semibold"
              >PRIME<span class="text-primary">APP</span></span
            >
          </span>
          <div class="ml-2 mb-3 mt-3 font-bold">Your Lists</div>
          <div v-for="list in lists" :key="list">
            <p-Button
              :label="list.Name"
              :icon="list.Icon"
              @click="selectList(list.id)"
              class="bg-primary-reverse mb-2 ml-2 hover:surface-200"
            />
          </div>
        </template>
        <template #end>
          <p-Button
            v-ripple
            style="border-radius: 8px !important"
            class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround"
          >
            <img
              class="mr-3"
              src="../assets/img/me.jpg"
              style="height: 2rem; width: 2rem; border-radius: 3rem"
            />
            <span class="inline-flex flex-column">
              <span class="font-bold">Noah V</span>
              <span class="text-sm">Admin</span>
            </span>
          </p-Button>
        </template>
      </p-Menu>
    </div>
    <!-- Selected List -->
    <p-Card class="content">
      <template #header
        ><h1 class="text-center">{{ chosenListName }}</h1></template
      >
      <template #title><div class="ml-4" v-if="choseList">To Dos</div></template>
      <template #subtitle
        ><div class="ml-5" v-if="choseList">Moments away from tackling all your list worries</div>
        <div class="mt-2 ml-5" v-if="choseList">
          To Dos Created: <strong class="text-primary">{{ chosenListCount }}</strong>
        </div>
      </template>

      <template #content>
        <div class="ml-5 mr-5 mt-3 mb-5" v-if="choseList">
          <div v-for="item in todos" :key="item.id" class="tasks border-round-3xl mt-2 mb-4">
            <div class="task is-mobile text-center text-md pt-3 pb-3">
              <p-Button
                icon="pi pi-question-circle"
                class="ml-4 bg-primary-reverse"
                @click="displayInfo(item.id)"
              />
              <p-Dialog
                v-model:visible="detailsVis"
                style="min-width: 25rem"
                :header="dialogHeader"
              >
                <div>
                  <div class="ml-8 pl-2 mb-3">
                    Icon: <i class="ml-2 pl-2 text-primary" :class="todoDetails.Icon"></i>
                  </div>
                  <div class="ml-3 mb-3">
                    Creation Date: <strong class="ml-3">{{ todoDetails.CreationDate }}</strong>
                  </div>
                  <div class="ml-6 pl-1 mb-3">
                    Due Date: <strong class="ml-3">{{ todoDetails.DueDate }}</strong>
                  </div>
                  <div class="ml-6 pl-1 mb-3">
                    Complete: <strong class="ml-3">{{ todoDetails.MarkComplete }}</strong>
                  </div>
                </div>
              </p-Dialog>
              <div class="ml-4 mt-1" style="font-size: 1.3rem">{{ item.ToDo }}</div>
              <div>
                <p-Button
                  rounded
                  class="btn shadow-3 ml-3"
                  @click="toggleCompletion(item.id)"
                  :class="item.MarkComplete ? 'is-success' : 'is-light'"
                  >&check;</p-Button
                >
                <p-Button
                  rounded
                  class="btn p-button-danger ml-2 mr-4 shadow-3"
                  @click="deleteToDo(item.id)"
                  >&cross;</p-Button
                >
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <p-Button
          label="Add To Do"
          class="mt-2 footer mr-6"
          @click="modalVis = true"
          v-if="choseList"
        />
        <p-Dialog
          v-model:visible="modalVis"
          modal
          header="Add new Task"
          :style="{ width: '35rem' }"
        >
          <form @submit.prevent="addToDoTask" class="myform m-3 p-1 border-round-md">
            <div
              class="field has-addons is-grouped mb-4 mt-5"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
              "
            >
              <div class="control is-expanded">
                <p-InputText
                  v-model="newToDoTask"
                  class="input"
                  type="text"
                  placeholder="Task ..."
                />
              </div>
              <p-Calendar
                dateFormat="yy-mm-dd"
                v-model="newToDoDueDate"
                showIcon
                style="display: flex"
                placeholder="Add Due Date"
                class="mb-5 mt-3"
              />
              <div class="control">
                <p-Button @click="clear()" class="btn p-button-danger mr-3">Clear</p-Button>
                <p-Button
                  :disabled="!newToDoTask || !newToDoDueDate"
                  @click="addToDoTask(), (modalVis = false)"
                  class="btn btn-info"
                  >Add</p-Button
                >
              </div>
            </div>
          </form>
        </p-Dialog>
      </template>
    </p-Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// firebase imports
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  increment
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { auth } from '@/firebase/firebase'
import { formatDate } from '@/utils/formatUtils'
// collection & query references
const listCollectionRef = collection(db, 'ToDoLists')
const listCollectionQuery = query(listCollectionRef, orderBy('CreationDate', 'desc'))

const todoCollectionRef = collection(db, 'ToDos')
const todoCollectionQuery = query(todoCollectionRef)

const modalVis = ref(false)
const choseList = ref(false)
const detailsVis = ref(false)
// List Reference
const lists = ref([])
const todos = ref([])

const chosenToDoList = ref({})

onMounted(() => {
  loadToDoLists()
})

const todoDetails = ref([])
const dialogHeader = ref('')
const displayInfo = (id) => {
  todoDetails.value = todos.value.find((todo) => todo.id === id)
  dialogHeader.value = todoDetails.value.ListRef + ' - ' + todoDetails.value.ToDo
  detailsVis.value = true
}

// load data
const loadToDoLists = () => {
  onSnapshot(listCollectionQuery, (querySnapshot) => {
    const fbList = []
    querySnapshot.forEach((doc) => {
      if (doc.data().Author === auth.currentUser.email) {
        const list = {
          id: doc.id,
          Name: doc.data().Name,
          Color: doc.data().Color,
          Icon: doc.data().Icon,
          CreationDate: doc.data().CreationDate,
          Complete: doc.data().Complete,
          ToDoCount: doc.data().ToDoCount
        }
        fbList.push(list)
      }
    })
    lists.value = fbList
  })
}
const loadToDos = () => {
  onSnapshot(todoCollectionQuery, (querySnapshot) => {
    const fbToDo = []
    querySnapshot.forEach((doc) => {
      if (doc.data().ListRef === chosenListName.value) {
        const todo = {
          id: doc.id,
          ListRef: doc.data().ListRef,
          DueDate: doc.data().DueDate,
          MarkComplete: doc.data().MarkComplete,
          CreationDate: doc.data().CreationDate,
          ToDo: doc.data().ToDo,
          Color: doc.data().Color,
          Icon: doc.data().Icon
        }
        fbToDo.push(todo)
      }
    })
    todos.value = fbToDo
  })
}

/** Select a List **/
const chosenListColor = ref('')
const chosenListIcon = ref('')
const chosenListCreationDate = ref('')
const chosenListName = ref('')
const chosenListCount = ref('')
const selectList = (id) => {
  // find selected list
  chosenToDoList.value = lists.value.find((list) => list.id === id)
  // assign selected list values
  chosenListName.value = chosenToDoList.value.Name
  chosenListColor.value = chosenToDoList.value.Color
  chosenListIcon.value = chosenToDoList.value.Icon
  chosenListCreationDate.value = chosenToDoList.value.CreationDate
  chosenListCount.value = chosenToDoList.value.ToDoCount
  // load associated todos
  loadToDos()
  // boolean to show content data
  choseList.value = true
  // clear ref values for next selection
  chosenListColor.value = ''
  chosenListIcon.value = ''
  chosenListCreationDate.value = ''
}

/** Add a New ToDo **/
const newToDoTask = ref('')
const newToDoDueDate = ref('')
const addToDoTask = () => {
  const newCreationDate = ref('')
  let createDate = new Date()
  let year = createDate.getFullYear()
  let month = createDate.getMonth() + 1
  let day = createDate.getDate()
  let hour = createDate.getHours()
  let min = createDate.getMinutes()
  const morn = ' AM'
  const night = ' PM'
  if (min < 10) {
    min = '0' + min
  }
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hour >= 12) {
    newCreationDate.value = year + '-' + month + '-' + day + ' ' + hour + ':' + min + night
  } else {
    newCreationDate.value = year + '-' + month + '-' + day + ' ' + hour + ':' + min + morn
  }

  addDoc(todoCollectionRef, {
    ListRef: chosenListName.value,
    CreationDate: newCreationDate.value,
    MarkComplete: false,
    ToDo: newToDoTask.value,
    DueDate: formatDate(newToDoDueDate.value)
  })
  chosenListCount.value++

  const notesRef = doc(db, 'ToDoLists', chosenToDoList.value.id)
  updateDoc(notesRef, {
    ToDoCount: increment(1)
  })

  //load todos
  loadToDos()

  //clear value
  newToDoTask.value = ''
  newToDoDueDate.value = ''
}

/* Mark todo complete */
const toggleCompletion = (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id)

  updateDoc(doc(todoCollectionRef, id), {
    MarkComplete: !todos[index].MarkComplete
  })

  const notesRef = doc(db, 'ToDoLists', chosenToDoList.value.id)
  updateDoc(notesRef, {
    CompleteCount: increment(1)
  })
}

/* Delete to do list */
const deleteToDo = (id) => {
  deleteDoc(doc(todoCollectionRef, id))
}

const clear = () => {
  newToDoTask.value = ''
  newToDoDueDate.value = ''
}
</script>

<style>
.container {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
}
.content {
  min-width: 75vw;
  min-height: 80vh;
}
.data-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  float: right;
}
.myform {
  min-height: 10vh;
  background-color: var(--surface-200);
  display: flex;
  flex-direction: column;
}

.tasks {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-200);
}
.task {
  display: flex;
  justify-content: space-between;
}
.footer {
  float: right;
}
@media (min-width: 1024px) {
  .todos {
    display: flex;
    align-items: center;
    flex-direction: column;
    float: right;
    margin-right: 2rem;
  }
}
</style>
