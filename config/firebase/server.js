
import firebaseServer from 'firebase-admin'

const app = firebase.apps.length 
? firebase.app() 
: firebase.initializeApp({
    credential: admin.credential.cert({
        
    })
})

export { firebaseServer }