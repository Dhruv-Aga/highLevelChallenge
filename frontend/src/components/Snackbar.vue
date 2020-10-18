<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="0"
    class="text-capitalize"
  >
    {{ snackbar.msg }}
    <v-btn dark text v-on:click="snackbar.show = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Snackbar',
  computed: {
    snackbar: function () {
      return this.$store.state.snackbar
    }
  }
}
</script>
