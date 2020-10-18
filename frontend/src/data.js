import HTTP from '@/plugins/http-common'
import store from '@/store'

var api = {}
api.events = async function (start, end) {
  try {
    var res = await HTTP.get('event', {
      params: {
        start_date: start,
        end_date: end
      }
    })

    if (res) return res.data
  } catch (error) {
    store.dispatch('showError', error.response)
  }
}

api.slots = async function (date, timezone) {
  var res = await HTTP.get('/event/slots', {
    params: {
      date: date,
      timezone: timezone
    }
  }).catch(function (error) {
    store.dispatch('showError', error.response)
    return null
  })
  if (res) return res.data
}

/*
{
    "event": {
        "slot": "2020-10-16T01:30:00+11:00",
        "duration": 30
    }
}
*/
api.createEvents = async function (event) {
  var res = await HTTP.post('event/create', event).catch(function (error) {
    store.dispatch('showError', error.response)
    return null
  })
  if (res) return res.data
}

export default api
