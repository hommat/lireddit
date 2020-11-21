import React, { FC } from 'react';
import { useVoteMutation, PostSnippetFragment } from '../generated/graphql';
import { Button, ButtonProps } from '@chakra-ui/core';
import { gql } from '@apollo/client';
import { PostVoteFragment } from '../graphql/types';

interface VoteButtonProps extends ButtonProps {
  value: number;
  post: PostSnippetFragment;
}

const VoteButton: FC<VoteButtonProps> = ({
  post,
  value,
  children,
  colorScheme,
  ...buttonProps
}) => {
  const [vote] = useVoteMutation();

  const handleVote = () => {
    if (post.voteStatus === value) return;

    vote({
      variables: { voteInput: { postId: post.id, value: value } },
      update: (cache, { data }) => {
        const wasVoteRejected = !data?.vote;
        if (wasVoteRejected) return;

        const postVoteFragment = gql`
          fragment PostVoteFragment on Post {
            points
            voteStatus
          }
        `;

        const cachePostId = `Post:${post.id}`;
        const cachePostVoteFragmentData = cache.readFragment<PostVoteFragment>({
          id: cachePostId,
          fragment: postVoteFragment,
        });

        if (!cachePostVoteFragmentData) return;

        const pointsToAdd =
          (cachePostVoteFragmentData?.voteStatus ? 2 : 1) * value;
        const newPoints = cachePostVoteFragmentData?.points + pointsToAdd;
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
    <Button
      {...buttonProps}
      colorScheme={post.voteStatus === value ? colorScheme : undefined}
      onClick={handleVote}
    >
      {children}
    </Button>
  );
};

export default VoteButton;
