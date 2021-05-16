import { firebaseServer } from './../../config/firebase/server'
import { differenceInHours, format, addHours } from 'date-fns'

const db = firebaseServer.firestore()
const profile = db.collection('profiles')
const agenda = db.collection('schedule')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocks = []
// multabilidade. TODO: fazer de forma imutável
for (let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
    const time = format(addHours(startAt, blockIndex), 'HH:mm')
    timeBlocks.push(time)
}

const getUserId = async (username) => {
    const profileDoc = await profile
    .where('username', '===', username)
    .get()

    const { userId } = profileDoc.docs[0].data()

    return userId
}

const setSchedule = async (req, res) => { 
    const userId = await getUserId(req.body.username)
    const doc = await agenda.doc(`${userId}#${req.body.when}`).get()

    // guard clause
    if (doc.exists) {
        return res.status(400)
    }

    await agenda.doc(`${userId}#${req.body.when}`).set({
        userId,
        when: req.body.when,
        name: req.body.name,
        phone: req.body.phone
    })

    res.status(200)
}

const getSchedule = (req, res) => { 
    try {
        // const profileDoc = await profile
        // .where('username', '==', req.query.username)
        // .get()

        // const snapshot = await agenda
        // .where('userId', '==', profileDoc.userId)
        // .where('when', '==', req.query.when)
        // .get()

        return res.status(200).json(timeBlocks)
    } catch (error) {
        console.log('Firebase Error: ', error)
        return res.status(401)
    }
}

// HashMap
const methods = {
    POST: setSchedule,
    GET: getSchedule,
}

export default async (req, res) => methods[req.method] 
    ? methods[req.method](req, res) 
    : res.status(405)
    
    // if (req.method === 'POST') {
    //     console.log('POST')
    // } else if (req.method === 'GET') {
    //     console.log('GET')
    // } else {
    //     res.status(405) // method not allowed, not created
    // }    

    
