import React from 'react'
import Header from './Header/Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen max-h-screen overflow-y-hidden">
        <div className="sticky">
            <Header />
        </div>
        <div className="">
        <main>
            {children}
        </main>
        </div>

        </div>
        
    )
}

export default Layout