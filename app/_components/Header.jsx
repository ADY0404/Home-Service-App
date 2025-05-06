"use client"
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

function Header() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const {data}=useSession();

  useEffect(() => {
    // Check if the admin authentication cookie exists
    const authCookie = Cookies.get("isAuthenticated");
    setIsAdminAuthenticated(!!authCookie);
    
    // Add event listener to detect cookie changes
    const checkCookie = () => {
      const adminCookie = Cookies.get("isAuthenticated");
      setIsAdminAuthenticated(!!adminCookie);
    };
    
    // Check for cookie changes every 1 second
    const interval = setInterval(checkCookie, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    console.log(data);
  },[data])

  return (
    <div className='p-5 shadow-sm flex  justify-between
    '>
        <div className='flex items-center gap-8 '>
            <Image src='/logo.svg' alt='logo'
            width={180} height={100} />
            <div className='md:flex items-center
            gap-6 hidden
            '>
                <Link href={'/'} className='hover:scale-105 hover:text-primary
                cursor-pointer'>Home</Link>
                <h2 className='hover:scale-105 hover:text-primary
                cursor-pointer'>Services</h2>
                <h2 className='hover:scale-105 hover:text-primary
                cursor-pointer'>About Us</h2>
                <Link href={'/providers/register'} className='hover:scale-105 hover:text-primary
                cursor-pointer'>Become a Provider </Link>
                {/* Only show Admin link to authenticated admin users */}
                {isAdminAuthenticated && (
                  <Link 
                    href='/dashboard'
                    className='hover:scale-105 hover:text-primary cursor-pointer'
                  >
                    Admin
                  </Link>
                )}
            </div>
           
        </div>
        <div>
          {data?.user?
          
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
  <Image src={data?.user?.image}
          alt='user'
          width={40}
          height={40}
          className='rounded-full'
          />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
     <Link href={'/mybooking'}>My Booking</Link> 
      </DropdownMenuItem>
    <DropdownMenuItem onClick={()=>signOut()}>Logout</DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>

          :  

          <Button onClick={()=>signIn('descope')}>Login / Sign Up</Button>

        }
            </div>
    </div>
  )
}

export default Header