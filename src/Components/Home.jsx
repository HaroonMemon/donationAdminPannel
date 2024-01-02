import React, { useEffect, useState } from "react";
import {
    addDoc,
    collection,
    Timestamp,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
} from 'firebase/firestore';
import { db } from './FirebaseConfig';
import { getDownloadURL, ref as sRef, uploadBytes } from 'firebase/storage';
import { storage } from './FirebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "./SideBar";
import "./style.css"
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingPost, setIsAddingPost] = useState(false);

    const fetchPosts = async () => {
        try {
            const postsCollection = collection(db, 'posts');
            const snapshot = await getDocs(postsCollection);
            const postList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postList);
        } catch (error) {
            console.error('Error fetching posts: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAddingPost(true);

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const title = formData.get('title');
        const description = formData.get('description');
        const imageFile = e.target.image.files[0];

        try {
            const storageRef = sRef(storage, `post_images/${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            const imageUrl = await getDownloadURL(snapshot.ref);

            const postRef = collection(db, 'posts');
            // Retrieve the newly added document by its reference
            const newDocRef = await addDoc(postRef, {
                name: name,
                title: title,
                description: description,
                imageUrl: imageUrl,
            });

            onSnapshot(newDocRef, (doc) => {
                if (doc.exists()) {
                    const newPostData = {
                        id: doc.id,
                        ...doc.data(),
                    };
                    setPosts([...posts, newPostData]);

                    toast.success('Post added successfully', {
                        theme: 'dark',
                        position: 'top-right',
                        autoClose: 1000,
                      });
                    e.target.reset();
                }
            });
            window.location.reload();

            toast.success('Post added successfully', {
                theme: 'dark',
                position: 'top-right',
                autoClose: 1000,
              });
            e.target.reset();
        } catch (error) {
            console.error('Error adding document: ', error);
            toast.error('Error adding post', {
                theme: 'dark',
                position: 'top-right',
                autoClose: 1000,
              });
        } finally {
            setIsAddingPost(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    const handleEdit = async (postId, newData) => {
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, newData); // Update the document with new data
            toast.success('Post updated successfully', {
                theme: 'dark',
                position: 'top-right',
                autoClose: 1000,
              });
        } catch (error) {
            console.error('Error updating document: ', error);
            toast.error('Error updating post', {
                theme: 'dark',
                position: 'top-right',
                autoClose: 1000,
              });
        }
    };

    const handleDelete = async (postId) => {
        try {
            const postRef = doc(db, 'posts', postId);
            await deleteDoc(postRef);
            // Filter out the deleted post from the current state
            const updatedPosts = posts.filter((post) => post.id !== postId);
            setPosts(updatedPosts);
            toast.success('Post deleted successfully', {
                theme: 'dark',
                position: 'top-right',
                autoClose: 1000,
              });
        } catch (error) {
            console.error('Error deleting document: ', error);
            toast.error('Error deleting post', {
                theme: 'dark',
                position: 'top-right',
                autoClose: 1000,
              });
        }
    };



    return (

        <div
            className="home"
        >
            <SideBar className="side_bar" />
            <div className="homeInner">
                <div className="post">
                    <h1>Posts</h1>
                    <div className="addPost" style={{ opacity: isAddingPost ? '0.5' : '1' }}>
                        <h2>Add Post</h2>
                        <form onSubmit={handleSubmit} className="form">
                            <label htmlFor="name">Name:</label>
                            <input type="text" placeholder="Your Name" name="name" className="text" id="name" />
                            <label htmlFor="title">Title:</label>
                            <input type="text" placeholder="Post Title" name="title" className="text" id="title" />
                            <label htmlFor="description">Description:</label>
                            <textarea name="description" placeholder="Post Description" id="description" cols="50" rows="5"></textarea>
                            <label htmlFor="image">Upload Image:</label>
                            <input type="file" placeholder="Post Img" accept="image/*" name="image" id="image" />

                            <button type="submit" disabled={isAddingPost}>
                                {isAddingPost ? 'Adding Post...' : 'Add Post'}
                            </button>
                        </form>
                    </div>


                    <div className="postInner">
                        {loading ? (
                            <div className="loader"></div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="post">
                                    <h2>{post.title}</h2>
                                    {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
                                    <p>Posted by: {post.name}</p>
                                    <p>{post.description}</p>
                                    {/* Render other post details */}
                                    <button onClick={() => handleEdit(post.id, /* new data */)}>
                                        <MdEdit />
                                    </button>
                                    <button onClick={() => handleDelete(post.id)}>
                                        <MdDelete />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Home;