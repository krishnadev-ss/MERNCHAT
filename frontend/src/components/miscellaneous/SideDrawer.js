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


const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChats, setLoadingChats] = useState([])

    const {user} = ChatState();
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
    
            if (Array.isArray(data)) {
                setSearchResult(data);
            } else {
                // Handle case where data is not an array (e.g., set searchResult to an empty array)
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
        // try {
        //     setLoadingChats(true)
        //     const config = {
        //         headers: {
        //             "Content-type": "application/json",
        //             Authorization: `Bearer ${user.token}`,
        //         },
        //     };
        //     const { data } = await axios.post("/api/chat", { userId }, config);
        //     if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        //     setSelectedChat(data);
        //     setLoadingChats(false)
        //     onClose()

        // } catch (error) {
        //     toast({
        //         title: "Error fetching the chat",
        //         description: error.message,
        //         status: "error",
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom-left",
        //     })
        // }
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

                <ButtonGroup gap='2'>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
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
    searchResult?.map((user) => (
        <UserListItem
            key={user._id} // Assuming _id is a unique identifier for each user
            user={user}
            handleFunction={() => accessChat(user._id)}
        />
    ))
)}

        
    </Stack>
    

</DrawerBody>


                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default SideDrawer
