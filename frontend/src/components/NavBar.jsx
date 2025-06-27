import React from 'react'
import { Button } from './ui/button'
import { useAuth0 } from '@auth0/auth0-react'

const NavBar = () => {

  const { loginWithRedirect } = useAuth0();
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h1 className='text-3xl tracking-tighter font-bold font-dm italic'>5<span className='text-black font-playfair font-light italic ml-1'>questions</span></h1>
      </div>
      <div>
        <ul className='flex gap-5 items-center'>
          <li>
            <a target='_blank' href='https://x.com/adies_s?t=XwpeoqhkB-oQPaOCCzEnSQ&s=08' className='text-zinc hover:text-zinc-800 hover:underline duration-300 font-inter text-lg tracking-tighter font-medium hover:text-black transition-colors'>About Dev</a>
          </li>
          <li>
            <Button className={'bg-gray hover:bg-zinc-700 duration-300 text-white font-inter tracking-tight text-md'} onClick={() => loginWithRedirect()}>
              Login / Signup
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar