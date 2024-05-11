import React from 'react'
import {Box, Container,Text,Tabs,TabList,TabPanels,Tab,TabPanel} from "@chakra-ui/react";
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';
const Homepage = () => {
  return (
    //help to be responsive in all devices
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">


        <Text fontSize="4xl"
        fontFamily="Work sans"
        color="black"
        textAlign={"center"}
        fontWeight={"bold"}>C4CHAT</Text>
        
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px"color={"black"}>
      <Tabs variant='soft-rounded' >
        <TabList mb="1em">
            <Tab width={"50%"}>LOGIN</Tab>
            <Tab width={"50%"}>SIGN UP</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
            <Login/>
            </TabPanel>
            <TabPanel>
            <SignUp/>
            </TabPanel>
        </TabPanels>
        </Tabs>
          

      </Box>

      
    </Container>
  )
}

export default Homepage