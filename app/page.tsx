import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Home = () => {
  return (
    <div  className='p-4'>
   <DropdownMenu>
  <DropdownMenuTrigger>Teachers</DropdownMenuTrigger>
  <DropdownMenuContent >
    <DropdownMenuItem>Teacher 1</DropdownMenuItem>
    <DropdownMenuItem>Teacher 2</DropdownMenuItem>
    <DropdownMenuItem>Teacher 3</DropdownMenuItem>
    <DropdownMenuItem>Teacher 4</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

    </div>
  )
}

export default Home