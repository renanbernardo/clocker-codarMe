import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { firebaseClient, persistenceMode } from './../../config/firebase/client'

const AuthContext = React.createContext([{}, () => { }])

export const login = async ({ email, password }) => {
    firebaseClient.auth().setPersistence(persistenceMode)

    try {
        firebaseClient.auth().signInWithEmailAndPassword(email, password)

    } catch (error) {
        console.log('Login Error: ', error)
    }
}

export const signup = async ({ email, password, username }) => {
    try {
        await firebaseClient.auth().createUserWithEmailAndPassword(email, password)
        await login({ email, password })
        // setupProfile(token, username)
        // const { data } = await axios({
        //     method: 'post',
        //     url: '/api/profile',
        //     header: {
        //       'Authentication': `Bearer ${user.getToken()}`
        //     },
        //     data: {
        //      username: values.username
        //     }
        //   })
    } catch (error) {
        console.log('Signup Error: ', error)
    }
}

export const logout = () => firebaseClient.auth().signOut()

export const useAuth = () => { 
    const [auth] = useContext(AuthContext)

    return [auth, { login, logout, signup }]
 }

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        loading: true,
        user: false
    })

    useEffect(() => {
        const unsubscribe = firebaseClient.auth().onAuthStateChanged(user => {
            setAuth({
                loading: false,
                user
            })
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}