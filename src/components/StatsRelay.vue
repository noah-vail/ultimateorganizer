<template>
  <div class="grid justify-content-center mb-5">
    <div class="col-12 md:col-6 lg:col-3 mr-5">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Notebooks</span>
            <div v-for="book in notebooks" :key="book" class="pb-4">
              <div class="text-900 text-primary font-medium text-xl mb-3">
                {{ book.Name }} Notebook
              </div>
              <div class="text-900 font-medium text-lg mb-2">
                Notes: <strong class="text-indigo-300 ml-2">{{ book.NumNotes }}</strong>
              </div>
              <div class="text-900 font-medium text-lg">
                Sections: <strong class="text-indigo-300 ml-2">{{ book.NumSections }}</strong>
              </div>
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-indigo-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-book text-indigo-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6 lg:col-3 mr-5">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Notes</span>
            <div v-for="note in notes" :key="note">
              <div class="text-900 font-medium mb-2">
                {{ note.NotebookRef }}
              </div>
              <div class="text-900 text-primary font-medium text-xl mb-2 ml-2">
                {{ note.SectionName }}
                <i
                  class="pi pi-question-circle ml-2 hover:text-primary-300"
                  @click="displayInfo(note.id)"
                ></i>

                <p-Dialog
                  v-model:visible="detailsVis"
                  position="top"
                  :header="dialogHeader"
                  style="min-width: 25rem"
                >
                  <div class="mb-3 ml-4">Creation Date: {{ noteDetails.CreationDate }}</div>
                  <div v-for="n in noteDetails.Notes" :key="n">
                    <div class="ml-4 mr-4 mb-3 p-2 border-round shadow-5 bg-primary-900">
                      {{ n }}
                    </div>
                  </div>
                </p-Dialog>
              </div>
              <div class="text-900 font-medium text-lg mb-4 ml-4">
                Note Count: <strong class="text-indigo-500 ml-2">{{ note.NoteCount }}</strong>
              </div>
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-cyan-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-file text-cyan-500 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 md:col-6 lg:col-3">
      <div class="surface-card shadow-2 p-3 border-round">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">To Do Lists</span>
            <div v-for="list in lists" :key="list" class="pb-4">
              <div class="text-900 text-primary font-medium text-xl mb-3">{{ list.Name }} List</div>
              <div class="text-900 font-medium text-lg mb-2">
                To Do Count: <strong class="text-indigo-500 ml-2">{{ list.ToDoCount }}</strong>
              </div>
              <div class="text-900 font-medium text-lg">
                Complete Count:
                <strong class="text-indigo-500 ml-2">{{ list.CompleteCount }}</strong>
              </div>
            </div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-primary-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-list-check text-primary-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db, auth } from '@/firebase/firebase'

const notebooks = ref([])
const lists = ref([])
const notes = ref([])
const detailsVis = ref(false)
const notebookCollectionRef = collection(db, 'TestNotebooks')
const notebookCollectionQuery = query(notebookCollectionRef, orderBy('CreationDate', 'desc'))

const listCollectionRef = collection(db, 'ToDoLists')
const listCollectionQuery = query(listCollectionRef)

const notesCollectionRef = collection(db, 'Notes')
const notesCollectionQuery = query(notesCollectionRef, orderBy('CreationDate', 'asc'))

onMounted(() => {
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
          Complete: doc.data().Complete,
          NumNotes: doc.data().NumNotes,
          NumSections: doc.data().NumSections
        }
        fbNotebook.push(notebook)
      }
    })
    notebooks.value = fbNotebook
  })

  onSnapshot(notesCollectionQuery, (querySnapshot) => {
    const fbNotes = []
    querySnapshot.forEach((doc) => {
      const note = {
        id: doc.id,
        NotebookRef: doc.data().NotebookRef,
        SectionName: doc.data().SectionName,
        Notes: doc.data().Notes,
        Color: doc.data().Color,
        CreationDate: doc.data().CreationDate,
        NoteCount: doc.data().NoteCount
      }
      fbNotes.push(note)
    })
    notes.value = fbNotes
  })

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
          ToDoCount: doc.data().ToDoCount,
          Author: doc.data().Author,
          CompleteCount: doc.data().CompleteCount
        }
        fbList.push(list)
      }
    })
    lists.value = fbList
  })
})

const noteDetails = ref([])
const dialogHeader = ref('')
const displayInfo = (id) => {
  detailsVis.value = true
  noteDetails.value = notes.value.find((note) => note.id === id)
  dialogHeader.value = noteDetails.value.NotebookRef + ' - ' + noteDetails.value.SectionName
  detailsVis.value = true
}
</script>
<style scoped>
.table {
  margin: 0 auto;
}
</style>
