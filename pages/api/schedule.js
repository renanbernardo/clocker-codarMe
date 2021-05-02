import { firebaseServer } from './../../config/firebase/server'
import { differenceInHours, format, addHours } from 'date-fns'

const db = firebaseServer.firestore()
const profile = db.collection('profile')
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

export default async (req, res) => {
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

    res.status(200).json({ name: 'John Doe' })
}