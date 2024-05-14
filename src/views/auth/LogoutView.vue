<template>
  <div class="logout surface-card p-4 shadow-5 border-round w-full lg:w-6 mt-5">
    <div class="text-center mb-5">
      <!-- <img src="/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3" /> -->
      <div class="text-900 text-5xl font-medium mb-5">You've Been Logged Out</div>
      <div class="text-900 text-3xl font-medium mb-5">Hope to See you Again!</div>
      <span class="text-600 font-medium line-height-3">Good-Bye!</span>
      <!-- <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer mt-4" href="/register"
        >Create today!</a
      > -->
    </div>
    <div>
      Don't want to leave yet?
      <a class="font-medium no-underline ml-2 text-primary cursor-pointer mt-4" href="/login">
        Login again</a
      >
    </div>
  </div>
</template>

<style scoped>
.logout {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
}
</style>
