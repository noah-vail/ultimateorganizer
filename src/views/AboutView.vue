<template>
  <div class="about-container">
    <h1 class="mt-5 mb-5">Project Details</h1>
    <div class="cards-container">
      <p-Card class="client-card mr-4 shadow-2">
        <template #title>
          <h2 class="text-left">
            Client Side
            <i class="pi pi-desktop icon text-primary-800" style="font-size: 2rem"></i>
          </h2>
        </template>
        <template #subtitle><div style="text-align: center">Client Composition</div></template>
        <template #content>
          <div class="font-bold">Vue js + Vite</div>
          <div style="display: flex; flex-direction: row">
            <p class="ml-2">Vue Version: <strong class="text-primary">^ 3.4.21</strong></p>
            <p class="ml-2">Vite Version: <strong class="text-primary">^ 5.2.8</strong></p>
          </div>
          <ul style="list-style: none" class="mt-3">
            <div>
              <li class="font-bold">PrimeVue</li>
              <p class="ml-2">Version: <strong class="text-primary">^ 3.52.0</strong></p>
              <p></p>
            </div>
            <div>
              <li class="font-bold">PrimeFlex</li>
              <p class="ml-2">Version: <strong class="text-primary">^ 3.3.1</strong></p>
              <p></p>
            </div>
            <div>
              <li class="font-bold">PrimeIcons</li>
              <p class="ml-2">Version: <strong class="text-primary">^ 7.0.0</strong></p>
              <p></p>
            </div>
          </ul>
        </template>
      </p-Card>
      <p-Card class="server-card ml-4 shadow-2">
        <template #title>
          <h2 class="text-left">
            Server Side
            <i class="pi pi-server icon text-primary-800" style="font-size: 2rem"></i>
          </h2>
        </template>
        <template #subtitle><div style="text-align: center">Server Composition</div></template>
        <template #content>
          <div>
            <div class="font-bold">Google Firebase</div>
            <p class="ml-2">Version: <strong class="text-primary">^ 10.11.1</strong></p>
            <ul style="list-style: none" class="mt-5">
              <div>
                <li class="font-bold">Authentication & Authorization</li>
                <p class="ml-2">Securely store user login / registration information</p>
              </div>
              <div>
                <li class="font-bold">Firestore Database</li>
                <p class="ml-2">Data storage / retrieval</p>
              </div>
              <div>
                <li class="font-bold">Performance</li>
                <p class="ml-2">Application monitoring</p>
              </div>
              <div>
                <li class="font-bold">Hosting</li>
                <p class="ml-2">Online viewing</p>
              </div>
            </ul>
          </div>
        </template>
      </p-Card>
    </div>
  </div>
</template>

<style>
.icon {
  margin-left: 28rem;
}
.icon2 {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
.about-container {
  min-height: 10vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
}
.cards-container {
  display: flex;
  flex-direction: row;
}
.client-card {
  min-width: 40vw;
}
.server-card {
  min-width: 40vw;
}
.oc-container {
  display: flex;
  flex-direction: row;
}
.obsticles-card {
  min-width: 60vw;
}
@media (min-width: 1024px) {
  .about-container {
    min-height: 10vh;
    display: flex;
    align-items: center;
  }
}
</style>
