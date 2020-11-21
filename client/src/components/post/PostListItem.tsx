import React, { FC } from 'react';
import { Flex, Box, Heading, Text } from '@chakra-ui/core';

import PostVoteColumn from '../post/PostVoteColumn';
import { PostSnippetFragment } from '../../generated/graphql';

interface PostListItemProps {
  post: PostSnippetFragment;
}

const PostListItem: FC<PostListItemProps> = ({ post }) => {
  return (
    <Flex p={5} shadow="md" borderWidth="1px">
      <PostVoteColumn post={post} />

      <Box>
        <Heading fontSize="xl">{post.title}</Heading>
        <Text mt={2}>By {post.creator.username}</Text>
        <Text mt={4}>{post.textSnippet}</Text>
      </Box>
    </Flex>
  );
};

export default PostListItem;
