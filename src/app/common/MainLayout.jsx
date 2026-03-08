'use client'
import React from 'react'
import Header from './Header'
import { usePathname } from 'next/navigation'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

export default function MainLayout({ children }) {
    const path = usePathname()
    console.log(path)
    const hideHeader = path === '/'
    return (
        <>
            <Provider store={store}>
                {!hideHeader && <Header />}
                {children}
            </Provider>
        </>
    )
}
