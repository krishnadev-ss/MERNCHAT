import React from 'react';
import { useState } from 'react';
import { ChatState } from '../../Context/chatProvider'
import { Box, FormControl, useToast } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,Input } from '@chakra-ui/react'
import axios from 'axios';
import UserBadgeItem from '../userAvatar/userBadgeItem';

import UserListItem from '../userAvatar/UserListItem'
const GroupChatModal = ({children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [groupChatName, setgroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const {user, chats, setChats} = ChatState()

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/api/user?search=${search}`, config);
          console.log(data);
          setLoading(false);
          setSearchResult(data.users || []);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };

    const handleDelete = async(delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))

    }
    

    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config)

            setChats([data, ...chats])
            onClose()
            toast({
                title: "New Group Chat Created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
          toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        setSelectedUsers([...selectedUsers, userToAdd]);
      };

    

  return (
    <>
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader
                fontSize="35px"
                fontFamily="Work sans"
                d="flex"
                justifyContent="center"
            
            >Create Group Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody
                d="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            
            >
                <FormControl>
                    <Input
                        placeholder='Chat Name'
                        mb={3}
                        onChange={(e) => setgroupChatName(e.target.value)}
                    />
                    <Input
                        placeholder='Add Users'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                    <UserBadgeItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleDelete(u)}
                    />
                ))}
                </Box>



                {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
            

                
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                    Create Chat
                </Button>
                <Button onClick={onClose}>Cancel</Button>
                
            </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  )
}

export default GroupChatModal