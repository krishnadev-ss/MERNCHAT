import React , {useState} from 'react';
import { ChatState } from '../Context/chatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/Mychats';
import ChatBox from '../components/miscellaneous/ChatBox';

const Chatpage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display="flex" flexDirection="row" w="100%" h="91.5vh" p="10px"justifyContent="space-between" >
                
                
                    {/* <Box display="flex" justifyContent="space-between"> */}
                        {user &&(<MyChats fetchAgain={fetchAgain}  />)}
                        {user &&(<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
                    {/* </Box> */}
                
            </Box>
        </div>
    );
}

export default Chatpage;
