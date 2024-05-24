import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/Mychats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/chatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        <Box display={{ base: "none", md: "flex" }} borderRight="1px solid #3d3d3d" w="100%" h="91.5vh" p="5px" flexDirection={"row"}>
        
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}

        </Box>
      </Box>
    </div>
  );
};

export default Chatpage;