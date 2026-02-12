import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommunityFeed({ user, go }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [reportPostId, setReportPostId] = useState(null);
  const [reportStep, setReportStep] = useState(1);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const reportReasons = [
    "I just don't like it",
    'Bullying or unwanted contact',
    'Suicide, self-injury or eating disorders',
    'Violence, hate or exploitation',
    'Selling or promoting restricted items',
    'Nudity or sexual activity',
    'Scam, fraud or spam',
    'False information'
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const focusId = localStorage.getItem('communityFocusPostId');
    if (focusId && posts.length) {
      const target = document.getElementById(`post-${focusId}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      localStorage.removeItem('communityFocusPostId');
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/community/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const postsData = Array.isArray(response.data) ? response.data : response.data.posts;
      setPosts(postsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', newPost);
      formData.append('interactionType', 'post');
      formData.append('visibility', 'public');
      
      // Append media files
      selectedMedia.forEach((file, index) => {
        formData.append('media', file);
      });
      
      await axios.post('http://localhost:5000/api/community/posts', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewPost('');
      setSelectedMedia([]);
      setMediaPreview([]);
      setShowNewPostModal(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/community/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedMedia(files);
    
    // Generate previews
    const previews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image') ? 'image' : 'video',
      name: file.name
    }));
    setMediaPreview(previews);
  };

  const removeMedia = (index) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = async (postId) => {
    const content = commentText[postId];
    if (!content?.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/community/posts/${postId}/comments`, 
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const openReportModal = (postId) => {
    setReportPostId(postId);
    setReportStep(1);
    setReportReason('');
    setReportDetails('');
  };

  const closeReportModal = () => {
    setReportPostId(null);
    setReportStep(1);
    setReportReason('');
    setReportDetails('');
  };

  const handleSubmitReport = async () => {
    if (!reportPostId || !reportReason) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/community/posts/${reportPostId}/report`,
        { reason: reportReason, details: reportDetails },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error reporting post:', error);
    } finally {
      setReportStep(3);
    }
  };

  const reportTarget = reportPostId ? posts.find((post) => post._id === reportPostId) : null;

  const handleShare = async (post) => {
    const shareData = {
      title: `Post by ${post.userName}`,
      text: post.content,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/community/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenMenuPostId(null);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleStartEdit = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
    setOpenMenuPostId(null);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditContent('');
  };

  const handleUpdatePost = async (postId) => {
    if (!editContent.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/community/posts/${postId}`, 
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingPostId(null);
      setEditContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const toggleMenu = (postId) => {
    setOpenMenuPostId(openMenuPostId === postId ? null : postId);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f5f7f8] dark:bg-[#101b22]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111a22] md:flex">
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-fit"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="aspect-square size-10 rounded-full bg-[#0d93f2]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0d93f2]">rocket_launch</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-normal text-slate-900 dark:text-white">{user?.name || 'User'}</h1>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{user?.role || 'Member'}</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <button onClick={() => go(user?.role === 'startup' ? 'startup-dashboard' : user?.role === 'admin' ? 'admin-dashboard' : 'investor-dashboard')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-sm font-medium">Dashboard</span>
              </button>
              <button className="flex items-center gap-3 rounded-xl bg-[#0d93f2]/10 px-3 py-3 text-[#0d93f2]">
                <span className="material-symbols-outlined">forum</span>
                <span className="text-sm font-bold">Community Feed</span>
              </button>
              <button onClick={() => go('settings')} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium">Settings</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>
      <main className="flex flex-1 flex-col overflow-y-auto">
        <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-[#111a22]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Community Feed</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Connect with startups and investors</p>
            </div>
            <button onClick={() => setShowNewPostModal(true)} className="flex items-center gap-2 rounded-xl bg-[#0d93f2] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0d93f2]/90">
              <span className="material-symbols-outlined text-xl">add_circle</span>
              New Post
            </button>
          </div>
        </header>
        <div className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-3xl">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-slate-500">Loading posts...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#111a22]">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">forum</span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No posts yet</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Be the first to share something with the community!</p>
                <button onClick={() => setShowNewPostModal(true)} className="mt-4 rounded-xl bg-[#0d93f2] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0d93f2]/90">
                  Create Post
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <div id={`post-${post._id}`} key={post._id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111a22]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d93f2]/20 text-[#0d93f2]">
                        <span className="material-symbols-outlined">person</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">{post.userName || 'Anonymous'}</h3>
                            <span className="text-sm text-slate-500 dark:text-slate-400"></span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{post.userRole || 'Member'}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400"></span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          {post.userId === user?.id && (
                            <div className="relative">
                              <button onClick={() => toggleMenu(post._id)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                                <span className="material-symbols-outlined">more_vert</span>
                              </button>
                              {openMenuPostId === post._id && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 z-10">
                                  <button onClick={() => handleStartEdit(post)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Edit Post
                                  </button>
                                  <button onClick={() => handleDeletePost(post._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                    Delete Post
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {editingPostId === post._id ? (
                          <div className="mt-2">
                            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:border-[#0d93f2] focus:outline-none" rows="3" />
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => handleUpdatePost(post._id)} className="rounded-lg bg-[#0d93f2] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d93f2]/90">
                                Save
                              </button>
                              <button onClick={handleCancelEdit} className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-slate-700 dark:text-slate-300">{post.content}</p>
                        )}
                        {post.media && post.media.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {post.media.map((mediaItem, index) => (
                              <div key={index} className="rounded-lg overflow-hidden">
                                {mediaItem.type === 'image' ? (
                                  <img src={`http://localhost:5000${mediaItem.url}`} alt="Post media" className="w-full h-48 object-cover" />
                                ) : (
                                  <video src={`http://localhost:5000${mediaItem.url}`} controls className="w-full h-48 object-cover" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <span key={index} className="rounded-full bg-[#0d93f2]/10 px-3 py-1 text-xs font-medium text-[#0d93f2]">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex items-center gap-6">
                          <button onClick={() => handleLike(post._id)} className="flex items-center gap-2 text-slate-500 hover:text-[#0d93f2] dark:text-slate-400">
                            <span className="material-symbols-outlined text-xl">favorite</span>
                            <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                          </button>
                          <button onClick={() => toggleComments(post._id)} className="flex items-center gap-2 text-slate-500 hover:text-[#0d93f2] dark:text-slate-400">
                            <span className="material-symbols-outlined text-xl">mode_comment</span>
                            <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                          </button>
                          <button onClick={() => handleShare(post)} className="flex items-center gap-2 text-slate-500 hover:text-[#0d93f2] dark:text-slate-400">
                            <span className="material-symbols-outlined text-xl">share</span>
                            <span className="text-sm font-medium">Share</span>
                          </button>
                          <button onClick={() => openReportModal(post._id)} className="flex items-center gap-2 text-slate-500 hover:text-red-500 dark:text-slate-400">
                            <span className="material-symbols-outlined text-xl">flag</span>
                            <span className="text-sm font-medium">Report</span>
                          </button>
                        </div>
                        {expandedComments[post._id] && (
                          <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <div className="space-y-3 mb-4">
                              {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment, idx) => (
                                  <div key={idx} className="flex gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                                      <span className="material-symbols-outlined text-sm">person</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">{comment.userName}</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                                      </div>
                                      <p className="text-xs text-slate-400 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500 text-center">No comments yet. Be the first to comment!</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={commentText[post._id] || ''}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                                placeholder="Write a comment..."
                                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#0d93f2] focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20"
                              />
                              <button
                                onClick={() => handleAddComment(post._id)}
                                className="rounded-lg bg-[#0d93f2] px-4 py-2 text-sm font-bold text-white hover:bg-[#0d93f2]/90"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-[#111a22]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Post</h3>
              <button onClick={() => setShowNewPostModal(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="What's on your mind?" className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder-slate-400 focus:border-[#0d93f2] focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500" rows="6" />
            
            {mediaPreview.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mediaPreview.map((preview, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    {preview.type === 'image' ? (
                      <img src={preview.url} alt={preview.name} className="w-full h-32 object-cover" />
                    ) : (
                      <video src={preview.url} className="w-full h-32 object-cover" />
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
                {reportPostId && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-white shadow-2xl">
                      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                        <button onClick={closeReportModal} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800">
                          <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3 className="text-sm font-semibold uppercase tracking-wide">Report</h3>
                        <div className="w-10" />
                      </div>

                      {reportStep === 1 && (
                        <div className="px-5 py-4">
                          <p className="text-sm text-slate-300 mb-4">Why are you reporting this post?</p>
                          <div className="divide-y divide-slate-800">
                            {reportReasons.map((reason) => (
                              <button
                                key={reason}
                                onClick={() => { setReportReason(reason); setReportStep(2); }}
                                className="w-full flex items-center justify-between py-4 text-left text-sm text-slate-100 hover:text-white"
                              >
                                <span>{reason}</span>
                                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {reportStep === 2 && (
                        <div className="px-5 py-4">
                          <p className="text-sm text-slate-300 mb-2">Selected reason</p>
                          <div className="mb-4 rounded-xl border border-slate-800 bg-slate-800/40 px-4 py-3 text-sm">
                            {reportReason}
                          </div>
                          <label className="text-xs font-semibold uppercase text-slate-400">Write details (optional)</label>
                          <textarea
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder="Add a detailed explanation"
                            className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-white placeholder-slate-500 focus:border-[#0d93f2] focus:outline-none focus:ring-2 focus:ring-[#0d93f2]/20"
                            rows="4"
                          />
                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => setReportStep(1)}
                              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                            >
                              Back
                            </button>
                            <button
                              onClick={handleSubmitReport}
                              className="ml-auto rounded-lg bg-[#4f5bd5] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
                            >
                              Submit Report
                            </button>
                            <button
                              onClick={handleSubmitReport}
                              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white"
                            >
                              Skip
                            </button>
                          </div>
                        </div>
                      )}

                      {reportStep === 3 && (
                        <div className="px-6 py-8 text-center">
                          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border-4 border-green-500 text-green-500">
                            <span className="material-symbols-outlined">check</span>
                          </div>
                          <h4 className="text-lg font-semibold mb-2">Thanks for your feedback</h4>
                          <p className="text-sm text-slate-300 mb-6">
                            When you see something you don't like, you can report it if it doesn't follow our Community Standards.
                          </p>
                          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-left">
                            <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-red-400 hover:bg-slate-800">
                              <span>Block {reportTarget?.userName || 'user'}</span>
                              <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-slate-800">
                              <span>Learn more about our Community Standards</span>
                              <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                            </button>
                          </div>
                          <button
                            onClick={closeReportModal}
                            className="mt-6 w-full rounded-xl bg-[#4f5bd5] py-3 text-sm font-semibold text-white hover:brightness-110"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <label className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">image</span>
                  <span>Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                </label>
                <label className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">videocam</span>
                  <span>Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowNewPostModal(false); setSelectedMedia([]); setMediaPreview([]); }} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">Cancel</button>
                <button onClick={handleCreatePost} disabled={!newPost.trim()} className="rounded-xl bg-[#0d93f2] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0d93f2]/90 disabled:opacity-50 disabled:cursor-not-allowed">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityFeed;
