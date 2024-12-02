"use client"
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './redux/store'
import Progressbar from './components/Progressbar'
import { type User } from '@prisma/client'


export default function ReduxUI({children, newNotification, user}: {children: React.ReactNode, newNotification: boolean, user: User | null}){
    return (
        <>
        <Progressbar />
        <Provider store={store}>
          <Toaster />
          <Navbar newNotification={newNotification} user={user} />
          {children}
        </Provider>
        </>
    )
}