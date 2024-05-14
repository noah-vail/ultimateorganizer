import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import Button from 'primevue/button'
import TabMenu from 'primevue/tabmenu'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Card from 'primevue/card'
import Calendar from 'primevue/calendar'
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

import Menubar from 'primevue/menubar'
import Sidebar from 'primevue/sidebar'
import Menu from 'primevue/menu'
import Toolbar from 'primevue/toolbar'
import Avatar from 'primevue/avatar'
import Textarea from 'primevue/textarea'
import FloatLabel from 'primevue/floatlabel'
import Editor from 'primevue/editor'
import Checkbox from 'primevue/checkbox'

import ColorPicker from 'primevue/colorpicker'
import Timeline from 'primevue/timeline'
import ConfirmPopup from 'primevue/confirmpopup'
import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import Column from 'primevue/column'

import VirtualScroller from 'primevue/virtualscroller'

import './firebase/firebase.js'
import 'primevue/resources/themes/aura-dark-teal/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)
app.component('p-Button', Button)
app.component('p-TabMenu', TabMenu)
app.component('p-Toast', Toast)
app.component('p-Card', Card)
app.component('p-Calendar', Calendar)
app.component('p-Chart', Chart)
app.component('p-Dialog', Dialog)
app.component('p-InputText', InputText)
app.component('p-Sidebar', Sidebar)
app.component('p-Menu', Menu)
app.component('p-Toolbar', Toolbar)
app.component('p-Avatar', Avatar)
app.component('p-Textarea', Textarea)
app.component('p-FloatLabel', FloatLabel)
app.component('p-Editor', Editor)
app.component('p-Checkbox', Checkbox)
app.component('p-ColorPicker', ColorPicker)
app.component('p-Timeline', Timeline)
app.component('p-ConfirmPopup', ConfirmPopup)
app.component('p-Menubar', Menubar)
app.component('p-VirtualScroller', VirtualScroller)
app.component('p-Column', Column)

app.directive('tooltip', Tooltip)
app.directive('ripple', Ripple)

app.mount('#app')
