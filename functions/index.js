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

// Name of Collection 
const eventCollection = db.collection('events');

const defaultTZ = 'Etc/GMT'; // Default TimeZone

const dateFormat = "YYYY-MM-DDTHH:mm:ssZ";
const startHours = 10; // Number
const startMinutes = 0; // Number

const endHours = 19; // Number
const endMinutes = 30; // Number

const duration = 30; // In Minutes

process.env.TZ = defaultTZ;
moment.tz.setDefault(defaultTZ);

// Create Slots according to Duration between given time period, 
// and also format according to Specific TimeZone Passed
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


// Verifying slots that are on date provided, also remove
// already occupied slots and also format according to 
// Specific Global Format
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

// Converter from Moment DateTime Object to UNIX TimeStamp
// used to store TimeStamp in Firestore
const transformDateToTimestamp = function (dateTime) {
    dateTime = moment.tz(dateTime, defaultTZ).utc();
    dateTime = admin.firestore.Timestamp.fromMillis(dateTime.valueOf());
    return dateTime
}

// Converter from DateTime Object to Specific Time Zone
const transformTimezone = function (timestamp, timezone) {
    return moment.tz(timestamp, timezone)
}

// Converter from UNIX TimeStamp used to store TimeStamp in 
// Firestore to Moment DateTime Object
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
            var searchStart = transformTimezone(newEvent.slot, defaultTZ);
            var searchEnd = searchStart.clone().add(newEvent.duration - 1, "minutes");
            
            newEvent.slot = transformTimezone(newEvent.slot, defaultTZ);
            
            var checkQuery = await eventCollection
                                        .where("slot", ">=", searchStart)
                                        .where("slot", "<=", searchEnd).get()

            if (checkQuery.empty) {
                var remaingSlotTime = newEvent.duration % duration
                var noOfSlots = Math.floor(newEvent.duration/duration);
                if(remaingSlotTime !== 0) {
                    noOfSlots++;
                }

                const batch = db.batch();
                
                for (let slotNo = 0; slotNo < noOfSlots; slotNo++) {
                    var newRef = eventCollection.doc();
                    batch.set(newRef, {slot: transformDateToTimestamp(newEvent.slot.add(slotNo*duration, "minutes"))});
                }

                await batch.commit();

                return res.status(200).send({ "error": false, "msg": "Slot successfully booked" });

            } else {
                return res.status(422).send({ "error": true, "msg": "Slot already booked" });
            }

        } catch (error) {
            console.log(error)
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

        // To get all slot already present in database from a day previous to a day after
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

        // To get all slot already present in database from a starting time a day to when it's end
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