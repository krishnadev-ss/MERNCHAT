import { Box, CloseButton } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
    
      px="8px" // Adjusted padding for better spacing
      py="4px"
      m="2px"
      bg="purple.500"
      color="white"
      fontSize="12px" // Adjusted font size for readability
      cursor="pointer"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      onClick={handleFunction}
    >
      {user.name}
      <CloseButton ml="4px" size="sm" /> {/* Added margin for spacing */}
    </Box>
  );
};

export default UserBadgeItem;
