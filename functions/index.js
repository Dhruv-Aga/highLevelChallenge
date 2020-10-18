const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const moment = require('moment-timezone');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));

var serviceAccount = require("../secret.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gothic-space-174111.firebaseio.com"
});

const db = admin.firestore();

const eventCollection = db.collection('events');
const defaultTZ = 'Etc/GMT';
process.env.TZ = defaultTZ;
moment.tz.setDefault(defaultTZ);
const dateFormat = "YYYY-MM-DDTHH:mm:ssZ";
const startHours = 10; // Number
const startMinutes = 0; // Number

const endHours = 19; // Number
const endMinutes = 30; // Number

const duration = 30; // In Minutes

const slotcreator = function (startDateTime, endDateTime, duration, timezone) {
    var allSlots = [];
    var tempDateTime = startDateTime;
    while (startDateTime < endDateTime) {
        tempDateTime = startDateTime;
        allSlots.push(moment.tz(tempDateTime, timezone));
        startDateTime.add(duration, 'minutes')
    }
    return allSlots
}

const verifySlots = function (slots, occupied, date) {
    var verifiedSlots = [];
    var lenSlots = slots.length;
    var lenOccupied = occupied.length;
    var i = j = 0;

    while (i < lenSlots && j < lenOccupied) {
        if (slots[i].format("YYYY-MM-DD") === date) {
            if (slots[i] < occupied[j]) {
                verifiedSlots.push(slots[i].format(dateFormat));
                i++;
            }
            else if (slots[i] > occupied[j]) {
                j++;
            }
            else {
                i++;
                j++;
            }
        } else {
            i++;
        }
    }

    while (i < lenSlots) {
        if (slots[i].format("YYYY-MM-DD") === date) {
            verifiedSlots.push(slots[i].format(dateFormat));
        }
        i++;
    }

    return verifiedSlots
}

const transformDateToTimestamp = function (dateTime) {
    dateTime = moment.tz(dateTime, defaultTZ).utc();
    dateTime = admin.firestore.Timestamp.fromMillis(dateTime.valueOf());
    return dateTime
}


const transformTimezone = function (timestamp, timezone) {
    return moment.tz(timestamp, timezone)
}
const transformTimestampToDate = function (timestamp, timezone) {
    var date = new Date(timestamp.toDate())
    return moment.tz(date, timezone).clone().tz(timezone, true)
}

// create
app.post('/api/event/create', (req, res) => {
    (async () => {
        try {
            if (!req.body.event)
                return res.status(402).send({ "error": true, "msg": "Missing `event` in request data" });
            if (!req.body.event.slot)
                return res.status(402).send({ "error": true, "msg": "Missing 'slot' in request data" });
            if (!req.body.event.duration)
                return res.status(402).send({ "error": true, "msg": "Missing `duration` in request data" });

            var newEvent = req.body.event;
            newEvent.slot = transformDateToTimestamp(newEvent.slot)

            var checkQuery = await eventCollection.where("slot", "==", newEvent.slot).get()

            if (checkQuery.empty) {
                await eventCollection.add(newEvent);
                return res.status(200).send({ "error": false, "msg": "Slot successfully booked" });

            } else {
                return res.status(422).send({ "error": true, "msg": "Slot already booked" });
            }

        } catch (error) {
            return res.status(500).send({ "error": true, "msg": error });
        }
    })();
});

// get all available slots
app.get('/api/event/slots', (req, res) => {
    (async () => {
        if (!req.query.date) return res.status(402).send({ "error": true, "msg": "Missing date in request" });
        if (!req.query.timezone) return res.status(402).send({ "error": true, "msg": "Missing timezone in request" });

        var reqDate = req.query.date;
        var searchDate = req.query.date;
        var timezone = req.query.timezone;
        searchDate = transformTimezone(searchDate, defaultTZ);

        var searchStartDateTime = searchDate.clone().hour(startHours).minute(startMinutes)
        var searchEndDateTime = searchDate.clone().hour(endHours).minute(endMinutes)

        var freeSlots = []
        var occupiedSlots = []

        var prevStartDateTime = searchStartDateTime.clone().subtract(1, "day")
        var startDateTime = searchStartDateTime.clone()
        var nextStartDateTime = searchStartDateTime.clone().add(1, "day")

        var prevEndDateTime = searchEndDateTime.clone().subtract(1, "day")
        var endDateTime = searchEndDateTime.clone()
        var nextEndDateTime = searchEndDateTime.clone().add(1, "day")

        freeSlots = slotcreator(prevStartDateTime, prevEndDateTime, duration, timezone)
        freeSlots = freeSlots.concat(slotcreator(startDateTime, endDateTime, duration, timezone))
        freeSlots = freeSlots.concat(slotcreator(nextStartDateTime, nextEndDateTime, duration, timezone))

        var checkStartDate = transformDateToTimestamp(prevStartDateTime.clone().hour(0).minute(0).second(0))
        var checkEndDate = transformDateToTimestamp(nextEndDateTime.clone().hour(23).minute(59).second(59))

        var rangeQuery = await eventCollection.where("slot", ">=", checkStartDate).where("slot", "<=", checkEndDate).orderBy("slot").get()
        if (!rangeQuery.empty) {
            rangeQuery.forEach(dataValue => {
                dataValue = dataValue.data();
                dataValue.slot = transformTimestampToDate(dataValue.slot, timezone);
                occupiedSlots.push(dataValue.slot);
            })
        }

        freeSlots = verifySlots(freeSlots, occupiedSlots, reqDate)

        return res.status(200).send({
            "error": false,
            "msg": "Slot found",
            "data": {
                "slots": freeSlots,
                "duration": duration + " mins"
            }
        });

    })();
});

// get all events
app.get('/api/event/', (req, res) => {
    (async () => {
        if (!req.query.start_date) return res.status(402).send({ "error": true, "msg": "Missing `start date` in request" });
        if (!req.query.end_date) return res.status(402).send({ "error": true, "msg": "Missing `end date` in request" });

        var startDate = new Date(req.query.start_date);
        var endDate = new Date(req.query.end_date);
        startDate.setUTCHours(0, 0, 0, 0)
        endDate.setUTCHours(23, 59, 59, 0)

        startDate = transformDateToTimestamp(startDate)
        endDate = transformDateToTimestamp(endDate)

        var rangeQuery = await eventCollection.where("slot", ">=", startDate).where("slot", "<=", endDate).orderBy("slot").get()

        if (rangeQuery.empty) {
            return res.status(422).send({ "error": true, "msg": "No event in given date range" });
        } else {
            var dataValues = []
            rangeQuery.forEach(dataValue => {
                dataValue = dataValue.data();
                dataValue.slot = transformTimestampToDate(dataValue.slot, defaultTZ).format(dateFormat);
                dataValues.push(dataValue);
            })
            return res.status(200).send({
                "error": false, "msg": "Events found", "data": {
                    "events": dataValues, "timezone": defaultTZ
                }
            });
        }
    })();
});

exports.app = functions.https.onRequest(app);