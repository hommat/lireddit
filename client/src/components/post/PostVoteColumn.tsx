import React, { FC } from 'react';
import { Flex, Box, Button } from '@chakra-ui/core';
import { gql } from '@apollo/client';

import { PostSnippetFragment, useVoteMutation } from '@generated/graphql';
import { PostVoteFragment } from '@graphql/types';

interface PostVoteColumnProps {
  post: PostSnippetFragment;
}

const postVoteFragment = gql`
  fragment PostVoteFragment on Post {
    points
    voteStatus
  }
`;

const PostVoteColumn: FC<PostVoteColumnProps> = ({ post }) => {
  const [vote, { loading }] = useVoteMutation();

  const handleVote = (value: number) => {
    if (post.voteStatus === value) return;

    vote({
      variables: { voteInput: { postId: post.id, value: value } },
      update: (cache, { data }) => {
        const wasVoteRejected = !data?.vote;
        if (wasVoteRejected) return;

        const cachePostId = `Post:${post.id}`;
        const cachePostVoteFragmentData = cache.readFragment<PostVoteFragment>({
          id: cachePostId,
          fragment: postVoteFragment,
        });

        if (!cachePostVoteFragmentData) return;

        const pointsMultiplier = cachePostVoteFragmentData.voteStatus ? 2 : 1;
        const pointsToAdd = pointsMultiplier * value;
        const newPoints = cachePostVoteFragmentData.points + pointsToAdd;
        const newPostVoteFragmentData: PostVoteFragment = {
          voteStatus: value,
          points: newPoints,
        };

        cache.writeFragment<PostVoteFragment>({
          id: cachePostId,
          fragment: postVoteFragment,
          data: newPostVoteFragmentData,
        });
      },
    });
  };

  return (
    <Flex direction="column" align="center" mr={8}>
      <Button
        disabled={loading}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        onClick={() => handleVote(1)}
      >
        +
      </Button>
      <Box my={2}>{post.points}</Box>
      <Button
        disabled={loading}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        onClick={() => handleVote(-1)}
      >
        -
      </Button>
    </Flex>
  );
};

export default PostVoteColumn;
