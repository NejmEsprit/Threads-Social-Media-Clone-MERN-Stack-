import { Avatar, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/messageAtom'
import userAtom from '../atoms/userAtom'

const Message = ({ ownMassege, message }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const user = useRecoilValue(userAtom)
    return (
        <>
            {ownMassege ? (
                <Flex gap={2} alignSelf={'flex-end'}>
                    <Text maxW={"350px"} bg={'blue.500'} p={1} borderRadius={'md'}>
                         {message.text}
                    </Text>
                    <Avatar src={user.profilePic} w="7" h={7} />
                </Flex >
            ) : (<Flex gap={2} >
                <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
                <Text maxW={"350px"} bg={'gray.500'} p={1} borderRadius={'md'} color={'black'}>
                    {message.text}
                </Text>

            </Flex >)}
        </>
    )
}

export default Message