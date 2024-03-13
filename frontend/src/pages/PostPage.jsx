import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Action from '../components/Action'
import Comment from '../components/Comment'
import useShowToast from '../hooks/useShowToast'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import postsAtom from '../atoms/postsAtom'

function PostPage() {
    const { user, loading } = useGetUserProfile()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const showToast = useShowToast()
    const { pid } = useParams()
    const currentUser = useRecoilValue(userAtom)
    const nav = useNavigate()
    //   const currentPost = posts[0];
    //console.log(pid)
    const currentPost = posts[0]

    useEffect(() => {
        const getPost = async () => {
            setPosts([])
            try {
                const res = await fetch(`/api/posts/${pid}`)
                const data = await res.json()
                if (data.error) {
                    showToast('Error', data.error, 'error')
                    return
                }
                // console.log(data)
                setPosts([data])
            } catch (error) {
                showToast('Error', error.message, 'error')
            }
        }
        getPost()
    }, [showToast, pid, setPosts])

    const handleDeletePost = async () => {
        try {
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/delete/${currentPost?._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post deleted", "success");
            nav(`/${user?.username}`)
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }
    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
            </Flex>
        )
    }

    // useEffect(() => {
    //     const getUser = async () => {
    //         try {
    //             const res = await fetch(`/api/users/profile/${username}`)
    //             const data = await res.json();
    //             //  console.log(data)
    //             if (data.error) {
    //                 showToast("Error ", data.error, "error")
    //                 return
    //             }
    //             // setUser(data);
    //         } catch (error) {
    //             showToast('Error ', error.message, 'error')
    //         } finally {
    //             //  setLoading(false)
    //         }
    //     }
    //     getUser();
    // }, []);
    //console.log(formatDistanceToNow(new Date(post?.createdAt)))
    //console.log(post?.createdAt)
    if (!currentPost) return null;
    console.log("currentPost", currentPost);
    return (
        <>
            <Flex>
                <Flex w={'full'} alignItems={"center"} gap={3}>
                    <Avatar src={user?.profilePic} size={'md'} name='NejmEddine Ammar' />
                    <Flex>
                        <Text fontSize={'sm'} fontWeight={"bold"}>{user?.username}</Text>
                        <Image src='/verified.png' w='4' h={4} ml={4} />
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                        {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
                    </Text>

                    {currentUser?.id === user?._id &&
                        (<DeleteIcon size={20} cursor={'pointer'} onClick={handleDeletePost} />)
                    }
                </Flex>
            </Flex>
            <Text my={3}> {currentPost?.text}</Text>

            {currentPost?.img && (
                <Box borderRadius={6} overflow={'hidden'}
                    border={"1px solid"} borderColor={"gray.light"} >
                    <Image src={currentPost?.img} w={'full'} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Action post={currentPost} />
            </Flex>
            <Divider my={4} />
            {/* <Flex gap={2} alignItems={'center'}>
                <Text color={'gray.light'} fontSize={'sm'}> {post?.replices?.lenght} replices</Text>
                <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
                <Text color={'gray.light'} fontSize={'sm'}> {post?.likes?.lenght}  likes</Text>
            </Flex> */}
            <Flex justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                    <Text fontSize={'2xl'}>👋</Text>
                    <Text color={'gray.light'}>get the app to like ,reply and post.</Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} />
            {currentPost.replies.map(reply => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
                />
            ))}

        </>

    )
}

export default PostPage