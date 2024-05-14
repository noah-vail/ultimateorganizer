<template>
  <div class="notebook">
    <!-- Side Menu -->
    <div class="ml-2 mt-5">
      <p-Menu :model="notebooks">
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
          <div class="ml-2 mb-3 mt-3 font-bold">Your Notebooks</div>
          <div v-for="book in notebooks" :key="book">
            <p-Button
              :label="book.Name"
              :icon="book.Icon"
              class="bg-primary-reverse mb-2 ml-2 hover:surface-200"
              @click="selectNotebook(book.id)"
            />
          </div>
        </template>
        <template #end>
          <div>
            <p-Button
              label="Add Section"
              class="ml-2 bg-indigo-400 hover:bg-indigo-200 border-indigo-500"
              @click="sectionDialog = true"
              v-if="choseNotebook"
            />
            <p-Dialog header="Create Section" modal v-model:visible="sectionDialog" position="top">
              <div class="flex align-items-center gap-3 mb-3">
                <label for="icon" class="font-semibold w-6rem">Section Name</label>
                <p-InputText
                  v-model="newSectionName"
                  id="sectiom"
                  class="flex-auto"
                  autocomplete="off"
                />
              </div>
              <p-Button label="Add" style="float: right" @click="addNewSection()" />
            </p-Dialog>
          </div>
          <p-Button
            v-ripple
            style="border-radius: 8px !important"
            class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 mt-5 text-color hover:surface-200 border-noround"
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
    <p-Card class="content mt-5">
      <template #header>
        <div class="title">
          <h1 class="ml-5">{{ chosenNotebook.Name }}</h1>
          <i
            class="mr-5 text-indigo-300"
            style="font-size: 1.3rem"
            :class="chosenNotebook.Icon"
          ></i></div
      ></template>
      <template #title
        ><div class="text-center" v-if="choseNotebook">
          <h2 class="mt-2">
            <strong class="text-primary ml-1">{{ chosenNotebook.Subject }}</strong>
          </h2>
        </div></template
      >
      <template #subtitle
        ><div class="text-center mb-4" v-if="choseNotebook">
          Moments away from tackling all of your organizational worries
        </div></template
      >
      <template #content>
        <div v-if="choseNotebook">
          <div v-for="note in notebookNotes" :key="note" class="mb-5">
            <div :class="note.Color" style="border-radius: 8px" class="pt-1">
              <h2 class="ml-4 mb-4">
                <strong class="text-primary">{{ note.SectionName }}</strong>
              </h2>

              <div class="ml-5 mr-5 mt-3 mb-5">
                <div
                  class="notes border-round-3xl mt-2 mb-4 shadow-2"
                  v-for="content in note.Notes"
                  :key="content"
                >
                  <div class="note is-mobile text-center text-lg pt-3 pb-3">
                    <div class="ml-4 mt-1" style="white-space: pre-wrap">{{ content }}</div>
                    <div>
                      <p-Button
                        rounded
                        class="btn p-button-danger hover:bg-red-300 ml-3 mr-4 shadow-3"
                        @click="deleteNote(note, content)"
                        >&cross;</p-Button
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="pb-7">
                <p-Button
                  label="Create Note"
                  @click="findNote(note), (modalVis = true)"
                  v-if="choseNotebook"
                  style="float: right; margin-right: 2rem"
                />
                <p-Dialog v-model:visible="modalVis" position="right" header="Create new Note">
                  <form @submit="addNote" class="myform m-3 p-1 border-round-md">
                    <div
                      class="field has-addons is-grouped mb-5 mt-5"
                      style="display: flex; align-items: center; justify-content: center"
                    >
                      <div class="control is-expanded ml-3">
                        <p-FloatLabel>
                          <p-Textarea
                            class="mt-3"
                            v-model="newNote"
                            autoResize
                            varient="filled"
                            rows="8"
                            cols="35"
                          />
                          <label class="mt-2" style="font-size: 1rem">Note Content</label>
                        </p-FloatLabel>
                      </div>
                      <div class="control">
                        <p-Button
                          :disabled="!newNote"
                          @click="addNewNote(findSectionRef.value), (modalVis = false)"
                          class="btn btn-info ml-3 mr-3"
                          >Add</p-Button
                        >
                      </div>
                    </div>
                  </form>
                </p-Dialog>
              </div>
            </div>
          </div>
        </div>
      </template>
    </p-Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
  updateDoc,
  addDoc,
  increment
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { auth } from '@/firebase/firebase'

const notebookCollectionRef = collection(db, 'TestNotebooks')
const notebookCollectionQuery = query(notebookCollectionRef, orderBy('CreationDate', 'desc'))
const notebookNotesCollectionRef = collection(db, 'Notes')
const notebookNotesCollectionQuery = query(
  notebookNotesCollectionRef,
  orderBy('CreationDate', 'asc')
)

/* NOTEBOOK REFS */
const notebooks = ref([])
const chosenNotebook = ref({})
const selectedNotebookName = ref('')
/* NOTES REFS */
const notebookNotes = ref([])
/* DIALOG VISIBILITY REFS */
const modalVis = ref(false)
const sectionDialog = ref(false)
const choseNotebook = ref(false)
/* NEW DATA REFS */
const newNote = ref('')
const NotesTemp = ref([])
const tempSectionNotes = ref([])
const newSectionName = ref('')
/* FIND DATA REFS */
const findSectionRef = ref({})

onMounted(() => {
  loadNotebooks()
})

const loadNotebooks = () => {
  onSnapshot(notebookCollectionQuery, (querySnapshot) => {
    const fbNotebook = []
    querySnapshot.forEach((doc) => {
      if (doc.data().Author === auth.currentUser.email) {
        const notebook = {
          id: doc.id,
          Name: doc.data().Name,
          Subject: doc.data().Subject,
          Color: doc.data().Color,
          Icon: doc.data().Icon,
          CreationDate: doc.data().CreationDate,
          Complete: doc.data().Complete
        }
        fbNotebook.push(notebook)
      }
    })
    notebooks.value = fbNotebook
  })
}

const findNote = (n) => {
  findSectionRef.value = n
}

const addNewNote = () => {
  NotesTemp.value = []
  const notesRef = doc(db, 'Notes', findSectionRef.value.id)
  NotesTemp.value = findSectionRef.value.Notes
  NotesTemp.value.push(newNote.value)
  updateDoc(notesRef, {
    Notes: NotesTemp.value,
    NoteCount: increment(1),
    Author: auth.currentUser.email
  })

  const notebookRef = doc(db, 'TestNotebooks', chosenNotebook.value.id)
  updateDoc(notebookRef, {
    NumNotes: increment(1)
  })
  newNote.value = ''
  console.log('Note Added')
}

const deleteNote = (noteref, noteContent) => {
  const notesRef = doc(db, 'Notes', noteref.id)
  for (let i = 0; i < noteref.Notes.length; i++) {
    if (noteref.Notes[i] !== noteContent) {
      tempSectionNotes.value.push(noteref.Notes[i])
    }
  }
  updateDoc(notesRef, {
    Notes: tempSectionNotes.value
  })
  console.log('Note Deleted')
}

const selectNotebook = (id) => {
  chosenNotebook.value = notebooks.value.find((book) => book.id === id)
  selectedNotebookName.value = chosenNotebook.value.Name
  getNotes(chosenNotebook.value.Name)
  choseNotebook.value = true
}

const getNotes = (notebookname) => {
  onSnapshot(notebookNotesCollectionQuery, (querySnapshot) => {
    const fbNotebookNotes = []
    querySnapshot.forEach((doc) => {
      if (doc.data().Author === auth.currentUser.email) {
        if (doc.data().NotebookRef === notebookname) {
          const notebookSec = {
            id: doc.id,
            NotebookRef: doc.data().NotebookRef,
            SectionName: doc.data().SectionName,
            Notes: doc.data().Notes,
            Color: doc.data().Color,
            SectionHeader: doc.data().SectionHeader
          }
          fbNotebookNotes.push(notebookSec)
        }
      }
    })
    notebookNotes.value = fbNotebookNotes
  })
}

const date = ref('')
const addNewSection = () => {
  getDate()
  addDoc(notebookNotesCollectionRef, {
    NotebookRef: chosenNotebook.value.Name,
    SectionName: newSectionName.value,
    CreationDate: date.value,
    Notes: []
  })

  const notebookRef = doc(db, 'TestNotebooks', chosenNotebook.value.id)
  updateDoc(notebookRef, {
    NumSections: increment(1)
  })

  sectionDialog.value = false
}

const getDate = () => {
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
    date.value = year + '-' + month + '-' + day + ' ' + hour + ':' + min + night
  } else {
    date.value = year + '-' + month + '-' + day + ' ' + hour + ':' + min + morn
  }
}
</script>

<style>
.notebook {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
}
.content {
  min-width: 75vw;
  max-width: 77vw;
  min-height: 80vh;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
}
.notes {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-200);
}
.note {
  display: flex;
  justify-content: space-between;
}
.footer {
  float: right;
}
@media (min-width: 1024px) {
  .notebook {
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-evenly;
  }
}
</style>
