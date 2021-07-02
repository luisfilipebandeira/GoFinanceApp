import React, { createContext, ReactNode, useContext, useState } from 'react'

import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

interface AuthProviderProps{
    children: ReactNode
}

interface User{
    id: string
    name: string
    email: string
    photo?: string
}

interface IAuthContextData {
    user: User
    signInWithGoogle(): Promise<void>
    signInWithApple(): Promise<void>
    signOut(): Promise<void>
    isLoadingUserStoraged: boolean
}

const AuthContext = createContext({} as IAuthContextData)

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User)
    const [isLoadingUserStoraged, setIsLoadingUserStoraged] = useState(true)

    const useStorageKey = '@gofinances:user'

    async function signInWithGoogle(){
        try{
            const result = await Google.logInAsync({
                iosClientId: '222993123852-pftnv8di1hkio2r57419ktiq53aolbm4.apps.googleusercontent.com',
                androidClientId: '222993123852-4j4h03m5e33uuto61ct5d4suf3ts0drr.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            })

            if(result.type === 'success'){
                const userLogged = {
                    id: String(result.user.id),
                    email: result.user.email!,
                    name: result.user.name!,
                    photo: result.user.photoUrl!
                }

                setUser(userLogged)
                await AsyncStorage.setItem(useStorageKey, JSON.stringify(userLogged))
            }

        }catch(error){
            throw new Error(error)
        }
    }

    async function signInWithApple(){
        try{
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            })

            if(credential){
                const name = credential.fullName?.givenName!
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo, 
                }

                setUser(userLogged)
                await AsyncStorage.setItem(useStorageKey, JSON.stringify(userLogged))
            }
        }catch(error){
            throw new Error(error)
        }
    }

    async function signOut(){
        await AsyncStorage.removeItem(useStorageKey)
        setUser({} as User)
    }

    useEffect(() => {
        async function loadUserStorageData(){
            const userStoraged = await AsyncStorage.getItem(useStorageKey)

            if(userStoraged){
                const userLogged = JSON.parse(userStoraged) as User
                setUser(userLogged)
            }

            setIsLoadingUserStoraged(false)
        }

        loadUserStorageData()
    }, [])

    return(
        <AuthContext.Provider value={{ user, signInWithGoogle, signInWithApple, signOut, isLoadingUserStoraged }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)

    return context
}

export {AuthProvider, useAuth} 