import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

function UserPage() {
    const { user, loading } = useGetUserProfile()
    const { username } = useParams()
    const showToast = useShowToast()
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [fetchingPost, setFetchingPost] = useState(false)
    useEffect(() => {

        const getPosts = async () => {
            setFetchingPost(true)
            try {
                const res = await fetch(`/api/posts/user/${username}`)
                const data = await res.json()
                // console.log(data)
                setPosts(data)
            } catch (error) {
                showToast('Eroor', error.message, 'error')
                setPosts([])
            } finally {
                setFetchingPost(false)
            }
        }
        getPosts()
    }, [username, showToast, setPosts])
    console.log('posts is here and it is recoil state', posts)

    if (!user && loading) {
        return (
            <Flex justifyContent={'center'}>
                <Spinner size={'xl'} />
            </Flex>
        )
    }
    if (!user && !loading) return <h1> User not found</h1>;
    return (
        <>
            <UserHeader user={user} />
            {!fetchingPost && posts.length === 0 && <h1>User Has not post(s)</h1>}
            {
                fetchingPost && (
                    <Flex justifyContent={'center'} my={12}>
                        <Spinner size={'xl'}></Spinner>
                    </Flex>
                )
            }
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    )
}

export default UserPage