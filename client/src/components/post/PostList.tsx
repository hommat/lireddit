import React, { FC } from 'react';
import { Stack } from '@chakra-ui/core';

import PostListItem from './PostListItem';
import { PostSnippetFragment } from '@generated/graphql';

interface PostListProps {
  posts: PostSnippetFragment[];
}

const PostList: FC<PostListProps> = ({ posts }) => {
  return (
    <Stack p={8}>
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default PostList;
