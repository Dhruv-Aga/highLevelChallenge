<template>
  <v-container>
    <v-row>
      <v-card width='1000' align-content-space-around class='ma-auto my-12 pa-8'>
        <v-dialog v-model='showModal' max-width='300'>
          <v-date-picker
            v-model='date'
            v-on:change='getSlots()'
          ></v-date-picker>
        </v-dialog>
        <v-card-title>
          <p class='text-decoration-underline'>Book Appointment for <i> Dr. John</i> </p>
        </v-card-title>

        <v-card-text class='white--text mt-8'>
          <v-select :items="timezones" v-on:change='getSlots()' v-model="timezone" label="Timezone"></v-select>
        </v-card-text>

        <v-card-text v-on:click='showModal = true' class='white--text mt-8'>
          <v-text-field
            v-model='dateRangeText'
            label='Date'
            prepend-icon='mdi-calendar'
            readonly
          ></v-text-field>
        </v-card-text>
        <v-card-text>
          <v-col cols='12'>
            <v-row>
              <v-col cols='4' v-for="slot in slots" :key="slot">
                <v-checkbox
                  v-model='selectedSlot'
                  :label="`Duration ${duration}: ${transformTime(slot)}`"
                  :value='slot'
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-actions color="green">
          <v-spacer></v-spacer>
          <v-btn v-on:click="saveSlots()" class="pa-4" color="green" dark>
            <v-icon class="mr-4">mdi-content-save-all</v-icon>
              BOOK SLOTS
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import APIS from '@/data'
import store from '@/store'
import timezones from '@/timwzones'
const moment = require('moment-timezone')

export default {
  name: 'Home',
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    showModal: false,
    slots: [],
    selectedSlot: [],
    timezone: 'Australia/Sydney',
    duration: '',
    timezones: timezones.timezones
  }),
  methods: {
    transformDate: date => {
      return moment(date).format('YYYY/MM/DD')
    },
    transformTime: function (date) {
      return moment.tz(date, this.timezone).format('hh:mm A')
    },
    getSlots: async function () {
      var data = await APIS.slots(this.date, this.timezone)
      if (data) {
        this.slots = data.data.slots
        this.duration = data.data.duration
      } else {
        this.slots = []
      }
    },
    saveSlots: async function () {
      for (var x in this.selectedSlot) {
        var sendData = {
          event: {
            slot: this.selectedSlot[x],
            duration: this.duration
          }
        }
        var data = await APIS.createEvents(sendData)
        if (data) {
          store.dispatch('showMsg', `Slot ${this.transformTime(this.selectedSlot[x])} is booked successfully`)
        }
      }
      this.getSlots()
    }
  },
  computed: {
    dateRangeText () {
      return this.transformDate(this.date)
    }
  },
  mounted: function () {
    this.getSlots()
  }
}
</script>
