import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { 
    Stack,
    Input,
    Box, 
    Button,
     Flex, 
     Text, 
     Tooltip,
      Menu, 
      MenuButton, 
      MenuList,
       MenuItem,
        Center,
        ButtonGroup, 
        Avatar, 
        MenuDivider,
         Drawer, 
         DrawerBody, 
         DrawerHeader, 
         DrawerOverlay, 
         DrawerContent, 
         DrawerCloseButton,
        useToast 
    } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import ProfileModal from './ProfileModal'
import { useHistory } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/hooks'
import ChatLoading from './chatLoading'
import UserListItem from '../userAvatar/UserListItem'
import {Spinner} from '@chakra-ui/spinner'
import { getSender } from '../../config/getSender'
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";


const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChats, setLoadingChats] = useState()

    const {user, setSelectedChat, chats, setChats , notification, setNotification} = ChatState();
    const history = useHistory();
    const {isOpen, onOpen, onClose} = useDisclosure()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push("/")
    }

    const toast = useToast();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
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
    
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log("Received data:", data); 
            setLoading(false);
            
    // Check if data.users is an array and not empty
        if (Array.isArray(data.users) && data.users.length > 0) {
            setSearchResult(data.users);
        } else {
            // Handle case where data.users is not an array or is empty
            console.log("Error occurred or empty data.users array");
            setSearchResult([]);
        }
        } catch (error) {
            console.error("Error fetching data:", error); // Add this line
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
    

    const accessChat = async(userId) => {
        try {
            setLoadingChats(true)
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChats(false)
            onClose()

        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    return (
        <div> {/* Wrapping JSX in a parent element */}
            <Flex
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen} leftIcon={<i className="fas fa-search"></i>}>
                        <Text d={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Center fontSize="4xl" fontFamily="Work sans" fontWeight={"bold"}>
                    C4CHAT
                </Center>

                <ButtonGroup gap='1'>
                
                    <Menu>
                        <MenuButton p={1}>
                        <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />

                            <BellIcon fontSize="2xl" m={2} alignContent={"center"} p={0.5}/>
                        
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                            
                        </MenuList>
                    </Menu>

                    <div> {/* Wrapping Menu in a div */}
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                                <Avatar size={"sm"} cursor={"pointer"} name={user.name} src = {user.pic}/>
                            </MenuButton>
                        
                            <MenuList>
                                <ProfileModal user={user}>
                                    <MenuItem>My Profile</MenuItem>
                                </ProfileModal>
                                <MenuDivider/>
                                <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                            </MenuList>
                        </Menu>
                    </div>

                   
                </ButtonGroup>
            </Flex>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>

                {/* Content of the Drawer */}

                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
            <Stack spacing={4}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Input
                        placeholder="Search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    /> 
                    <Button onClick={handleSearch}>Go</Button>
                    
                </Stack>
                {loading ? (
            <ChatLoading />
        ) : (
            console.log("Search Result:", searchResult),
            searchResult?.map((user) => (
                <UserListItem
                    key={user._id} // Assuming _id is a unique identifier for each user
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                />
            ))
        )}

        {loadingChats && <Spinner ml="auto" display="flex" />}

                
            </Stack>
            

        </DrawerBody>


                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer
