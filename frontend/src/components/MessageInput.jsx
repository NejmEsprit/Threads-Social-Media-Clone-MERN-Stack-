import React, { useState } from 'react'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { IoSendSharp } from "react-icons/io5";
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messageAtom';

const MessageInput = ({ setMessages }) => {
    const [messageText, setMessageText] = useState("")
    const showToast = useShowToast
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const setConversations = useRecoilState(conversationsAtom);
    // console.log(selectedConversation._id)
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText) return
        try {
            const res = await fetch("/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageText,
                    recipientId: selectedConversation.userId,
                }),
            })
            const data = await res.json()
            if (data.error) {
                showToast('Error', error.message, 'error')
                return;
            }
            setMessageText("")
            setMessages((messages) => [...messages, data]);

            setConversations((prevConvs) => {
                const updatedConversations = prevConvs.map((conversation) => {
                    if (conversation._id === selectedConversation._id) {
                        return {
                            ...conversation,
                            lastMessage: {
                                text: messageText,
                                sender: data.sender,
                            }
                        }
                    }
                   console.log('aaaaaaaaaaaaaaaaaaa',conversation)
                    return conversation;
                })
                return updatedConversations;
            })
            setMessageText("")
        } catch (error) {
            showToast("Error", error.message, "error")

        }
    }
    return (
        <form onSubmit={handleSendMessage} >
            <InputGroup>
                <Input w={'full'}
                    placeholder='Type a message'
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText} />
                <InputRightElement onClick={handleSendMessage} cursor={'pointer'} >
                    <IoSendSharp />
                </InputRightElement>
            </InputGroup>
        </form>
    )
}

export default MessageInput