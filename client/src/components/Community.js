import React, { useState, useEffect } from 'react';
import { communityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'experience',
  });
  const [commentText, setCommentText] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await communityService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await communityService.createPost(formData);
      setFormData({ title: '', content: '', category: 'experience' });
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await communityService.likePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      await communityService.addComment(postId, { text: commentText[postId] });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="community-container">
      <h2>Community Support</h2>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-primary">Share Your Story</button>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <h3>Create New Post</h3>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select name="category" id="category" value={formData.category} onChange={handleChange}>
              <option value="experience">Experience</option>
              <option value="question">Question</option>
              <option value="advice">Advice</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Post</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to share!</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div>
                  <h4>{post.title}</h4>
                  <span className="author">{post.userId?.firstName} {post.userId?.lastName}</span>
                </div>
                <span className="category">{post.category}</span>
              </div>
              <p className="post-content">{post.content}</p>
              
              <div className="post-actions">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`btn-like ${post.likes?.includes(user?.id) ? 'liked' : ''}`}
                >
                  ❤️ {post.likes?.length || 0}
                </button>
                <span className="comment-count">💬 {post.comments?.length || 0}</span>
              </div>

              <div className="comments-section">
                {post.comments?.map((comment, idx) => (
                  <div key={idx} className="comment">
                    <strong>{comment.userId?.firstName} {comment.userId?.lastName}:</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}
                
                <div className="add-comment">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                  />
                  <button 
                    onClick={() => handleComment(post._id)}
                    className="btn-secondary"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
