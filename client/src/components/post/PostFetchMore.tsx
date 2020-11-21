import React, { FC } from 'react';
import { Flex, Button } from '@chakra-ui/core';

interface PostFetchMoreProps {
  onFetchMore: VoidFunction;
  loading: boolean;
}

const PostFetchMore: FC<PostFetchMoreProps> = ({ onFetchMore, loading }) => {
  return (
    <Flex justify="center">
      <Button onClick={onFetchMore} isLoading={loading}>
        Load more
      </Button>
    </Flex>
  );
};

export default PostFetchMore;
