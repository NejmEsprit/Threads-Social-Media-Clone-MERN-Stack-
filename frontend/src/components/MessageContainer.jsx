import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messageAtom'
import { useEffect, useRef, useState } from 'react'
import userAtom from '../atoms/userAtom'
import MessageInput from './MessageInput'
import { useSocket } from '../context/SocketContext'

const MessageContainer = () => {
    const showToast = useShowToast()
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [loadingMessage, setLoadingMessage] = useState(true)
    const [messages, setMessages] = useState([])
    const currentUser = useRecoilValue(userAtom)
    const { socket } = useSocket()
    const setConversations = useSetRecoilState(conversationsAtom)
    const messageEndRef = useRef(null)

    useEffect(() => {
        socket.on("newMessge", (message) => {
            if (selectedConversation._id === message.conversationId) {
                setMessages((prevMessages) => [...prevMessages, message])
            }
            // setConversations((prev) => {
            //     const updatedConversation = prev.map(conversation => {
            //         if (conversation._id === message.conversationId) {
            //             return {
            //                 ...conversation,
            //                 lastMessage: {
            //                     text: message.text,
            //                     sender: message.sender,
            //                 }
            //             }
            //         }
            //         return conversation
            //     })
            //     return updatedConversation
            // })
        })
        return () => socket.off("newMessage")
    }, [socket])
    // console.log("first",currentUser.id)

    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessage(true)
            setMessages([])
            try {
                if (selectedConversation.mock) return;
                const res = await fetch(`/api/message/${selectedConversation.userId}`)
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return;
                }
                setMessages(data)
            } catch (error) {
                showToast('Error', error.messsage, 'error')
            } finally {
                setLoadingMessage(false)
            }
        }
        getMessages()
    }, [showToast, selectedConversation.userId])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <Flex flex='70' bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={'md'} p={2}
            flexDirection={'column'}>
            <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
                <Text display={'flex'} alignItems={'center'}>
                    {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                </Text>
            </Flex>
            <Divider />
            <Flex flexDir={'column'} gap={4} my={4} p={2} maxH={'400px'} overflowY={"auto"}>
                {loadingMessage && (
                    [...Array(5)].map((_, i) => (
                        <Flex key={i} gap={2} alignItems={'center'} p={1} borderRadius={'md'}
                            alignSelf={i % 2 === 0 ? 'flex-start' : "flex-end"}>
                            {i % 0 === 0 && <SkeletonCircle size={7} />}
                            <Flex flexDir={'column'} gap={2}>
                                <Skeleton h='8px' w='250px' />
                                <Skeleton h='8px' w='250px' />
                                <Skeleton h='8px' w='250px' />
                            </Flex>
                            {i % 2 !== 0 && <SkeletonCircle size={7} />}
                        </Flex>
                    ))
                )}
                {!loadingMessage && (
                    messages.map((message) => (
                        <Flex key={message._id} direction={'column'}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
                        >
                            <Message message={message} ownMassege={currentUser.id === message.sender} />
                        </Flex>
                    ))
                )}

            </Flex>
            <MessageInput setMessages={setMessages} />
        </Flex>
    )
}

export default MessageContainer