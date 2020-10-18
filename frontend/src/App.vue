<template>
  <v-app id="app">
    <Header />
    <v-content>
      <router-view></router-view>
    </v-content>
    <Loader></Loader>
    <Snackbar></Snackbar>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import Loader from '@/components/Loader'
import Snackbar from '@/components/Snackbar'
export default {
  name: 'App',

  components: {
    Loader,
    Header,
    Snackbar
  }
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px lightblue;
  border-radius: 1px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: grey;
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: darkgrey;
}
</style>
