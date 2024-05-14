<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { auth } from '../firebase/firebase.js'
import StatsRelay from '@/components/StatsRelay.vue'
import ImpDates from '@/components/ImpDates.vue'
// firestore imports
import { collection, onSnapshot, query, addDoc, doc, deleteDoc, orderBy } from 'firebase/firestore'
import { db } from '../firebase/firebase.js'

const confirm = useConfirm()
const toast = useToast()

const router = useRouter()
const notebooks = ref([])
const todos = ref([])

// collection references
const todoCollectionRef = collection(db, 'ToDoLists')
const notebookCollectionRef = collection(db, 'TestNotebooks')

// query references
const todoCollectionQuery = query(todoCollectionRef, orderBy('CreationDate', 'desc'))
const notebookCollectionQuery = query(notebookCollectionRef, orderBy('CreationDate', 'desc'))

// dialog popup triggers
const visible = ref(false)
const visible2 = ref(false)

onMounted(() => {
  loadLists()
  loadNotebooks()
})

const loadLists = () => {
  onSnapshot(todoCollectionQuery, (querySnapshot) => {
    const fbList = []
    querySnapshot.forEach((doc) => {
      if (doc.data().Author === auth.currentUser.email) {
        const todo = {
          id: doc.id,
          Name: doc.data().Name,
          Color: doc.data().Color,
          Icon: doc.data().Icon,
          CreationDate: doc.data().CreationDate,
          Complete: doc.data().Complete,
          ToDoCount: doc.data().ToDoCount,
          CompleteCount: doc.data().CompleteCount
        }
        fbList.push(todo)
      }
    })
    todos.value = fbList
  })
}

/** Notebook Constants **/
const newToDoName = ref('')
const newToDoColor = ref('')
const newToDoIcon = ref('')
const newToDoTask = ref('')
/** Create a new to do list **/
const createToDoList = () => {
  addDoc(todoCollectionRef, {
    Name: newToDoName.value,
    Color: newToDoColor.value,
    Icon: newToDoIcon.value,
    Complete: false,
    CreationDate: Date.now,
    ToDoCount: 0,
    CompleteCount: 0,
    Author: auth.currentUser.email
  })
  loadLists()
  newToDoName.value = ''
  newToDoColor.value = ''
  newToDoIcon.value = ''
  newToDoTask.value = ''
}
/* Delete to do list */
const deleteList = (id) => {
  deleteDoc(doc(todoCollectionRef, id))
}
const deleteNotebook = (id) => {
  deleteDoc(doc(notebookCollectionRef, id))
}

const loadNotebooks = () => {
  onSnapshot(notebookCollectionQuery, (querySnapshot) => {
    const fbNotebook = []
    querySnapshot.forEach((doc) => {
      if (doc.data().Author === auth.currentUser.email) {
        const note = {
          id: doc.id,
          Name: doc.data().Name,
          Subject: doc.data().Subject,
          Color: doc.data().Color,
          Icon: doc.data().Icon,
          CreationDate: doc.data().CreationDate,
          Complete: doc.data().Complete
        }
        fbNotebook.push(note)
      }
    })
    notebooks.value = fbNotebook
  })
}
/** List Constants **/
const newNotebookName = ref('')
const newNotebookSubject = ref('')
const newNotebookColor = ref('')
const newNotebookIcon = ref('')
const newNotebookSection = ref('')

/* Create a new notebook */
const createNotebook = () => {
  addDoc(notebookCollectionRef, {
    Name: newNotebookName.value,
    Subject: newNotebookSubject.value,
    Color: newNotebookColor.value,
    Icon: newNotebookIcon.value,
    CreationDate: Date.now(),
    Complete: false,
    Author: auth.currentUser.email
  })
  loadNotebooks()
  newNotebookName.value = ''
  newNotebookSubject.value = ''
  newNotebookColor.value = ''
  newNotebookIcon.value = ''
  newNotebookSection.value = ''
}

const toNotebooks = () => {
  router.push('/notebooks')
}
const toToDos = () => {
  router.push('/todos')
}

const confirmMsg = ref('')
const confirmList = (event, id, name) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this To Do list?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      confirmMsg.value = `To Do List: ${name} Deleted`
      toast.add({ severity: 'info', summary: 'Confirmed', detail: confirmMsg.value, life: 3000 })
      deleteList(id)
      confirmMsg.value = ''
    },
    reject: () => {
      confirmMsg.value = `You have rejected the deletion of to do list: ${name}.`
      toast.add({ severity: 'error', summary: 'Rejected', detail: confirmMsg.value, life: 3000 })
      confirmMsg.value = ''
    }
  })
}
const confirmNotebook = (event, id, name) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Do you want to delete this Notebook?',
    icon: 'pi pi-info-circle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    accept: () => {
      confirmMsg.value = `Notebook: ${name} Deleted`
      toast.add({ severity: 'info', summary: 'Confirmed', detail: confirmMsg.value, life: 3000 })
      deleteNotebook(id)
      confirmMsg.value = ''
    },
    reject: () => {
      confirmMsg.value = `You have rejected the deletion of Notebook: ${name}.`
      toast.add({ severity: 'error', summary: 'Rejected', detail: confirmMsg.value, life: 3000 })
      confirmMsg.value = ''
    }
  })
}
</script>

<template>
  <main>
    <h1
      class="mb-4 mt-5 text-center shadow-5 pt-2 pb-2 bg-primary-700"
      style="width: 85vw; margin: 0 auto; border-radius: 20px"
    >
      Personal
    </h1>
    <div class="container shadow-2 mt-2 mb-5 pt-5 pb-5">
      <p-Card class="card-1 shadow-3">
        <template #title>To Do Lists</template>
        <template #subtitle>All your lists in one place</template>
        <template #content>
          <div
            class="mb-5 mt-4 mr-4 ml-4 pt-2 pb-2 bg-bluegray-400 shadow-1"
            style="border-radius: 15px"
          >
            <div class="mt-3 mb-3" style="text-align: center" v-for="todo in todos" :key="todo">
              <p-Button
                rounded
                class="shadow-2"
                style="background-color: var(--indigo-400); border-color: var(--indigo-300)"
                @click="confirmList($event, todo.id, todo.Name)"
                >{{ todo.Name }}</p-Button
              >
              <p-Toast></p-Toast>
              <p-ConfirmPopup></p-ConfirmPopup>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-3 mt-1">
            <p-Button
              label="View Lists"
              severity="secondary"
              outlined
              class="w-full shadow-2"
              @click="toToDos()"
            />
            <p-Button label="Create" class="w-full shadow-2" @click="visible = true" />
          </div>
          <p-Dialog
            v-model:visible="visible"
            modal
            header="Add To Do List"
            :style="{ width: '25rem' }"
          >
            <span class="p-text-secondary block mb-5">Create a new To Do list</span>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="name" class="font-semibold w-6rem">Name</label>
              <p-InputText v-model="newToDoName" id="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="color" class="font-semibold w-6rem">Color</label>
              <p-InputText v-model="newToDoColor" id="color" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="icon" class="font-semibold w-6rem">Icon</label>
              <p-InputText v-model="newToDoIcon" id="icon" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex justify-content-end gap-2">
              <p-Button
                type="button"
                label="Cancel"
                severity="danger"
                @click="visible = false"
              ></p-Button>
              <p-Button
                type="button"
                label="Add"
                @click="createToDoList(), (visible = false)"
              ></p-Button>
            </div>
          </p-Dialog>
        </template>
      </p-Card>
      <p-Card class="card-2 shadow-3">
        <template #title>Notebooks</template>
        <template #subtitle>All your notebooks in one place</template>
        <template #content>
          <div
            class="mb-5 mt-4 mr-6 ml-6 pt-2 pb-2 bg-bluegray-400 shadow-1"
            style="border-radius: 15px"
          >
            <div
              class="card mt-3 mb-3"
              style="text-align: center"
              v-for="notebook in notebooks"
              :key="notebook"
            >
              <p-Button
                rounded
                class="shadow-2"
                @click="confirmNotebook($event, notebook.id, notebook.Name)"
                style="background-color: var(--indigo-400); border-color: var(--indigo-300)"
                >{{ notebook.Name }}</p-Button
              >
              <p-Toast></p-Toast>
              <p-ConfirmPopup></p-ConfirmPopup>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex gap-3 mt-1">
            <p-Button
              label="View Notebooks"
              severity="secondary"
              outlined
              class="w-full shadow-2"
              @click="toNotebooks()"
            />
            <p-Button label="Create" class="w-full shadow-2" @click="visible2 = true" />
          </div>
          <p-Dialog
            v-model:visible="visible2"
            modal
            header="Create Notebook"
            :style="{ width: '28rem' }"
          >
            <span class="p-text-secondary block mb-5">Add a new notebook to your collection</span>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="name" class="font-semibold w-6rem">Name</label>
              <p-InputText
                v-model="newNotebookName"
                id="name"
                class="flex-auto"
                autocomplete="off"
              />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="subject" class="font-semibold w-6rem">Subject</label>
              <p-InputText
                v-model="newNotebookSubject"
                id="subject"
                class="flex-auto"
                autocomplete="off"
              />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="color" class="font-semibold w-6rem">Color</label>
              <p-InputText
                v-model="newNotebookColor"
                id="color"
                class="flex-auto"
                autocomplete="off"
              />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
              <label for="icon" class="font-semibold w-6rem">Icon</label>
              <p-InputText
                v-model="newNotebookIcon"
                id="icon"
                class="flex-auto"
                autocomplete="off"
              />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
              <label for="icon" class="font-semibold w-6rem">First Heading</label>
              <p-InputText
                v-model="newNotebookSection"
                id="sectiom"
                class="flex-auto"
                autocomplete="off"
              />
            </div>
            <div class="flex justify-content-end gap-2">
              <p-Button
                type="button"
                label="Cancel"
                severity="danger"
                class="mr-1"
                @click="visible2 = false"
              ></p-Button>
              <p-Button
                type="button"
                label="Add"
                @click="createNotebook(), (visible2 = false)"
              ></p-Button>
            </div>
          </p-Dialog>
        </template>
      </p-Card>
    </div>
    <h1
      class="mb-4 mt-4 text-center shadow-5 pt-2 pb-2 bg-primary-700"
      style="width: 85vw; margin: 0 auto; border-radius: 20px"
    >
      Calendar Dates
    </h1>
    <div class="container-cal shadow-2 mt-2 mb-5 pt-5 pb-5">
      <p-Card class="card-cal">
        <template #title>Important Dates</template>
        <template #subtitle>Always remembering important dates</template>
        <template #content>
          <ImpDates />
        </template>
      </p-Card>
    </div>
    <h1
      class="mb-4 mt-4 text-center shadow-5 pt-2 pb-2 bg-primary-700"
      style="width: 85vw; margin: 0 auto; border-radius: 20px"
    >
      Data Sets
    </h1>
    <StatsRelay />
  </main>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: var(--surface-200);
  max-width: 70vw;
  margin: 0 auto;
  border-radius: 10px;
}
.card-1 {
  max-width: 25vw;
  min-width: 25vw;
}
.card-2 {
  max-width: 35vw;
  min-width: 33vw;
}
.container-cal {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: var(--surface-200);
  max-width: 70vw;
  margin: 0 auto;
  border-radius: 10px;
}
.card-cal {
  width: 65vw;
  margin: 0 auto;
}
.container-chart {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;

  max-width: 85vw;
  margin: 0 auto;
}
.chart-cont {
  display: flex;
  flex-direction: row;
}
</style>
