import { ViewIcon  } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    IconButton, 
    useDisclosure,
    Image,
  } from '@chakra-ui/react'
  import { Center } from '@chakra-ui/react'

import React from 'react'

const ProfileModal = ({user,children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    
  return (
    <>
    {
        children?(<span onClick={onOpen}>{children}</span>):(
            <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen} />

        )
    }

    <Modal size ="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
            <ModalHeader 
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center">
            {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody 
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between">
                <Center>
                <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
                />
                </Center>

                <Center padding={"20px"}>
                <Text
                // fontSize={{base:"17px", md:"30px"}}
                fontFamily="Work sans" fontSize="17px">
                    Email: {user.email}
                </Text>
                </Center>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose} bg="black"      // Set background color to black
    color="white">
                    Close
                </Button>
                
            </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  )
}

export default ProfileModal