import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Trash2, Send, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, DEFAULT_AVATAR_URL } from '../lib/supabase';

/* ─── Types ─── */
interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  membership_status: string | null;
  role: string | null;
}

interface Post {
  id: number;
  author_id: string;
  content: string;
  parent_id: number | null;
  created_at: string;
}

/* ─── Utils ─── */
const timeAgo = (dateStr: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getProfileDisplay = (profiles: Map<string, Profile>, userId: string) => {
  const p = profiles.get(userId);
  const name = p?.full_name || 'Anonymous';
  const avatar = p?.avatar_url || `${DEFAULT_AVATAR_URL}${encodeURIComponent(name)}`;
  return { name, avatar, bio: p?.bio || '' };
};

/* ─── Reply Compose ─── */
const ReplyCompose: React.FC<{
  postId: number;
  onSubmit: (postId: number, content: string) => Promise<void>;
}> = ({ postId, onSubmit }) => {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(postId, value.trim());
    setValue('');
    setSubmitting(false);
  };

  return (
    <div className="ml-[52px] mt-2 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Write a reply..."
        className="flex-1 py-2 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#5c8ab9]"
      />
      <button
        onClick={handleSubmit}
        disabled={submitting || !value.trim()}
        className="py-2 px-3.5 bg-[#5c8ab9] text-white border-none rounded-lg font-semibold text-sm cursor-pointer disabled:opacity-50"
      >
        <Send size={14} />
      </button>
    </div>
  );
};

/* ─── Post Card ─── */
const PostCard: React.FC<{
  post: Post;
  replies: Post[];
  profiles: Map<string, Profile>;
  currentUserId: string;
  onDelete: (id: number) => void;
  onReply: (postId: number, content: string) => Promise<void>;
}> = ({ post, replies, profiles, currentUserId, onDelete, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const author = getProfileDisplay(profiles, post.author_id);
  const isOwn = post.author_id === currentUserId;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img src={author.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-slate-200" />
        <div>
          <div className="font-semibold text-sm">{author.name}</div>
          <div className="text-xs text-slate-500">{timeAgo(post.created_at)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="text-[0.95rem] text-slate-900 leading-relaxed whitespace-pre-wrap break-words">
        {post.content}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => setShowReply(!showReply)}
          className="bg-none border-none text-slate-500 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors hover:text-[#5c8ab9]"
        >
          <MessageCircle size={14} /> Reply
        </button>
        {isOwn && (
          <button
            onClick={() => onDelete(post.id)}
            className="bg-none border-none text-red-500 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors hover:text-red-700"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-[52px] mt-3">
          {replies.map((r) => {
            const rAuthor = getProfileDisplay(profiles, r.author_id);
            return (
              <div key={r.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <img src={rAuthor.avatar} alt="" className="w-[30px] h-[30px] rounded-full object-cover bg-gray-200 border border-slate-200" />
                  <div>
                    <span className="font-semibold text-sm">{rAuthor.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{timeAgo(r.created_at)}</span>
                  </div>
                </div>
                <div className="text-sm text-slate-900 whitespace-pre-wrap break-words">{r.content}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply input */}
      {showReply && <ReplyCompose postId={post.id} onSubmit={onReply} />}
    </div>
  );
};

/* ─── Member Card ─── */
const MemberCard: React.FC<{ member: Profile }> = ({ member }) => {
  const name = member.full_name || 'Anonymous';
  const avatar = member.avatar_url || `${DEFAULT_AVATAR_URL}${encodeURIComponent(name)}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4 transition-shadow hover:shadow-md">
      <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover bg-gray-200 border-2 border-slate-200 flex-shrink-0" />
      <div>
        <h4 className="m-0 mb-1 text-base font-semibold">{name}</h4>
        <p className="m-0 text-sm text-slate-500 leading-snug">{member.bio || 'Community member'}</p>
        {member.role === 'admin' && (
          <span className="inline-block mt-1.5 px-2 py-0.5 bg-sky-100 text-[#5c8ab9] rounded-full text-[0.7rem] font-bold">
            Admin
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'feed' | 'directory'>('feed');
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [posts, setPosts] = useState<Post[]>([]);
  const [repliesByParent, setRepliesByParent] = useState<Map<number, Post[]>>(new Map());
  const [members, setMembers] = useState<Profile[]>([]);
  const [composeText, setComposeText] = useState('');
  const [posting, setPosting] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Load profiles cache
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, bio, membership_status, role');
      if (data) {
        const map = new Map<string, Profile>();
        data.forEach((p) => map.set(p.id, p));
        setProfiles(map);
      }
    };
    load();
  }, []);

  // Load posts
  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    const { data: parentPosts } = await supabase
      .from('posts')
      .select('*')
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!parentPosts || parentPosts.length === 0) {
      setPosts([]);
      setRepliesByParent(new Map());
      setLoadingPosts(false);
      return;
    }

    const postIds = parentPosts.map((p) => p.id);
    const { data: replies } = await supabase
      .from('posts')
      .select('*')
      .in('parent_id', postIds)
      .order('created_at', { ascending: true });

    const grouped = new Map<number, Post[]>();
    (replies ?? []).forEach((r) => {
      const existing = grouped.get(r.parent_id!) ?? [];
      existing.push(r);
      grouped.set(r.parent_id!, existing);
    });

    setPosts(parentPosts);
    setRepliesByParent(grouped);
    setLoadingPosts(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Load members (on tab switch)
  const loadMembers = useCallback(async () => {
    setLoadingMembers(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, membership_status, role')
      .or('membership_status.eq.active,role.eq.admin')
      .order('full_name');
    setMembers(data ?? []);
    setLoadingMembers(false);
  }, []);

  useEffect(() => {
    if (tab === 'directory') loadMembers();
  }, [tab, loadMembers]);

  // Submit post
  const submitPost = async () => {
    if (!composeText.trim() || !user) return;
    setPosting(true);
    await supabase.from('posts').insert({ author_id: user.id, content: composeText.trim() });
    setComposeText('');
    setPosting(false);
    loadPosts();
  };

  // Submit reply
  const submitReply = async (parentId: number, content: string) => {
    if (!user) return;
    await supabase.from('posts').insert({ author_id: user.id, content, parent_id: parentId });
    loadPosts();
  };

  // Delete post
  const deletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1200px] mx-auto py-8 px-5">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-8">
          <button
            onClick={() => setTab('feed')}
            className={`py-2.5 px-5 text-sm font-semibold cursor-pointer border-none bg-transparent border-b-2 transition-all ${
              tab === 'feed'
                ? 'text-[#5c8ab9] border-b-[#5c8ab9]'
                : 'text-slate-500 border-b-transparent hover:text-slate-900'
            }`}
          >
            Discussions
          </button>
          <button
            onClick={() => setTab('directory')}
            className={`py-2.5 px-5 text-sm font-semibold cursor-pointer border-none bg-transparent border-b-2 transition-all ${
              tab === 'directory'
                ? 'text-[#5c8ab9] border-b-[#5c8ab9]'
                : 'text-slate-500 border-b-transparent hover:text-slate-900'
            }`}
          >
            Member Directory
          </button>
        </div>

        {/* Discussions */}
        {tab === 'feed' && (
          <div className="max-w-[700px]">
            {/* Compose */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
              <textarea
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="Share something with the community..."
                className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-y min-h-[80px] box-border focus:outline-none focus:border-[#5c8ab9] focus:shadow-[0_0_0_3px_rgba(92,138,185,0.15)]"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={submitPost}
                  disabled={posting || !composeText.trim()}
                  className="py-2 px-5 bg-[#9cbce2] text-white border-none rounded-lg font-semibold text-sm cursor-pointer transition-colors hover:bg-[#8baad1] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts */}
            {loadingPosts ? (
              <div className="text-center py-16 text-slate-500">Loading discussions...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <h3 className="m-0 mb-2 text-slate-900">No discussions yet</h3>
                <p>Be the first to start a conversation!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  replies={repliesByParent.get(post.id) ?? []}
                  profiles={profiles}
                  currentUserId={user?.id ?? ''}
                  onDelete={deletePost}
                  onReply={submitReply}
                />
              ))
            )}
          </div>
        )}

        {/* Member Directory */}
        {tab === 'directory' && (
          <div>
            {loadingMembers ? (
              <div className="text-center py-16 text-slate-500">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <h3 className="m-0 mb-2 text-slate-900">No members yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
                {members.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { CommunityPage };
