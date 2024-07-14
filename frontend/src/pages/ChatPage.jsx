import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import { SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from 'react'
import Conversations from '../components/Conversations';
import { GiConversation } from "react-icons/gi";
import MessageContainer from '../components/MessageContainer.jsx';
import useShowToast from '../hooks/useShowToast.js'
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messageAtom.js';
import userAtom from '../atoms/userAtom.js';
import { useSocket } from '../context/SocketContext.jsx';


const ChatPage = () => {
    const [loadingConversaitons, setLoadingConversaitons] = useState(true)
    const [conversations, setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [searchText, setSearchText] = useState("")
    const [searchUser, setSearchUser] = useState(false)
    const currentUser = useRecoilValue(userAtom)
    const showToast = useShowToast()
    const { socket, onlineUsers } = useSocket()

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch('/api/message/conversations')
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return
                }
                //  console.log(data)
                setConversations(data)
            } catch (error) {
                showToast('Error', error.message, 'error')
            } finally {
                setLoadingConversaitons(false)
            }

        }
        getConversations()
    }, [showToast, setConversations])

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchUser(true)
        try {
            const res = await fetch(`/api/users/profile/${searchText}`)
            const searchedUser = await res.json()
            console.log('user found',
                searchedUser._id)
            if (searchUser.error) {
                showToast("Error", searchUser.error, 'error')
            }
            //is user is trying to message themselver
            if (searchedUser?._id === currentUser?.id) {
                showToast("Error", "you cannot message yourself", 'error')
                return;
            }
            //if user is already in a conversation with searched user
            console.log(conversations.find((conversation) => conversation?.participants[0]?._id))

            if (conversations.find((conversation) => conversation?.participants[0]?._id === searchedUser?._id)) {

                setSelectedConversation({
                    _id: conversations.find(conversation => conversation?.participants[0]?.id === searchUser?._id)?._id,
                    userId: searchedUser?._id,
                    username: searchedUser?.username,
                    // userProfilePic :searchedUser.userProfilePic,
                })
                return;
            }
            const mockConversation = {
                mock: true,
                lastMessge: {
                    text: "",
                    sender: ""
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser?._id,
                        username: searchedUser?.username,
                        profilePic: searchUser?.profilePic,
                    }
                ]
            }
            setConversations((prevConvs) => [...prevConvs, mockConversation])
        } catch (error) {
            showToast('Error', error.message, "error")
        }
        finally {
            setSearchUser(false)
        }
    }


    return (
        <Box position={'absolute'} left={'50%'} w={{
            base: '100%',
            md: '80%',
            lg: '750px'
        }} p={4} transform={'translateX(-50%)'}  >
            <Flex
                gap={4}
                flexDirection={{
                    base: 'column',
                    md: 'row'
                }}
                maxW={{
                    sm: "400px",
                    md: 'full'
                }}
                mx={'auto'}
            >
                <Flex flex={30}
                    gap={2}
                    flexDirection={'column'}
                    maxW={{
                        sm: "250px",
                        md: 'full',
                    }}
                    mx={"auto"}>

                    <Text fontWeight={700} color={useColorModeValue('gray.600', 'gary.400')}>
                        Your Conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems={'center'} gap={2}>
                            <Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
                            <Button size={'sm'} onClick={handleConversationSearch} isLoading={searchUser}>
                                <SearchIcon />
                            </Button>
                        </Flex>
                    </form>
                    {
                        loadingConversaitons && (
                            [0, 1, 2, 3, 4].map((_, i) => (
                                <Flex key={i} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                                    <Box>
                                        <SkeletonCircle size={'10'} />
                                    </Box>
                                    <Flex w={'full'} flexDirection={'column'} gap={3}>
                                        <Skeleton h={"10px"} w={'80px'} />
                                        <Skeleton h={'8px'} w={'90%'} />
                                    </Flex>
                                </Flex>
                            ))
                        )
                    }
                    {!loadingConversaitons && (
                        conversations.map(conversation => (
                            <Conversations key={conversation?._id}
                                isOnLine={onlineUsers.includes(conversation.participants[0]?._id)}
                                conversation={conversation} />
                        ))
                    )}
                    {/* {!loadingConversaitons && } */}
                </Flex>
                {!selectedConversation._id && (
                    <Flex flex={70} borderRadius={'md'} p={2} flexDir={'column'} alignItems={'center'}
                        justifyContent={'center'} height={'400px'}>
                        <GiConversation size={100} />
                        <Text> Select a conversation to start messaging </Text>
                    </Flex>
                )}

                {selectedConversation._id && <MessageContainer />}
            </Flex>
        </Box>
    )
}

export default ChatPage