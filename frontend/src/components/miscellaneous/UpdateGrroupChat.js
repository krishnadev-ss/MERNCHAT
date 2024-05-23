import React,{useState} from 'react'
import {Spinner, Input,Box,Button, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/chatProvider'
import { useToast } from '@chakra-ui/react'
import UserBadgeItem from '../userAvatar/userBadgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGrroupChat = ({fetchAgain,setFetchAgain}) => {

    const {isOpen, onOpen, onClose} = useDisclosure()
    const {selectedChat, setSelectedChat} = ChatState()
    const [groupChatName, setGroupChatName] = useState()
    const {user} = ChatState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast()

    const handleRemove = async (user1) => {
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/chat/groupremove`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          
        })
        setLoading(false);
      }
    }; // <-- Add this closing curly brace
    

    const handleRename = async () => {
      if (!groupChatName) return
    
      try {
        setRenameLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/chat/rename`,
          {
            chatId: selectedChat._id,
            chatName: groupChatName,
          },
          config
        );
    
        console.log("Response data:", data); // Log the response data
        // setSelectedChat("");
        setSelectedChat(data);
        // setFetchAgain(!fetchAgain);
        setRenameLoading(false);
      } catch (error) {
        console.error("Error occurred:", error); // Log the error
        toast({
          title: "Error Occurred!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setRenameLoading(false);
      }
      setGroupChatName("");
    };
    
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
    const handleAddUser = async(user1) => {
      if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      if (selectedChat.groupAdmin._id !== user1._id) {
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/chat/groupadd`,
          {
            chatId: selectedChat._id,
            userId: user1._id,
          },
          config
        );
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);


        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          
          })
          setLoading(false);
         // Log the error
        }
      }
      
    


  return (
    <>
    <IconButton d = {{base:"flex"}} icon = {<ViewIcon/>} onClick={onOpen}></IconButton>
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedChat.chatName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={user._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <FormControl display="flex">
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameLoading}
              onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add User to group"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
          
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
            Leave Group
          </Button>
          
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  )
}

export default UpdateGrroupChat