import { Button, Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from '../components/Post'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

const HomePage = () => {
    const [posts, setPosts] = useRecoilState(postsAtom)
    const [loading, setLoading] = useState(true)
    const showTosat = useShowToast()
    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true)
            setPosts([])
            try {
                const res = await fetch('/api/posts/feed')
                const data = await res.json()
                if (data.error) {
                    showTosat('Error', data.error, 'error')
                    return;
                }
                console.log(data)
                setPosts(data)

            } catch (error) {
                showTosat('Error', error.message, 'error')
            } finally {
                setLoading(false)
            }
        }
        getFeedPosts()
    }, [showTosat, setPosts])
    return (
        <>
            {!loading && posts.length === 0 && (
                <h1>Follow some users to see the feed </h1>
            )}
            {loading && (
                <Flex justify='center'>
                    <Spinner size='xl' />
                </Flex>
            )}
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    )
}

export default HomePage