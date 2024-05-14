import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyChats from '../components/miscellaneous/Mychats'
import ChatBox from '../components/miscellaneous/ChatBox'

const Chatpage = () => {
    const {user} = ChatState()
    
  return (
      <div style={{width:"100%"}}>
        {user && <SideDrawer/>}
        <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
            {user && <MyChats/>}
            {user && <ChatBox/>}
        </Box>

      </div>
  )
}

export default Chatpage