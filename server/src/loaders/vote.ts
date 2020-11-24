import DataLoader from 'dataloader';
import { Vote } from '@entities/Vote';

export type VoteDataLoaderInput = Pick<Vote, 'postId' | 'userId'>;
type VoteRecord = Record<string, Vote>;

const createVoteLoaderId = ({ postId, userId }: VoteDataLoaderInput): string =>
  `${userId}|${postId}`;

export const createVoteLoader = () =>
  new DataLoader<VoteDataLoaderInput, Vote>(async (voteDataLoaderInputs) => {
    const votes = await Vote.findByIds(
      voteDataLoaderInputs as VoteDataLoaderInput[]
    );

    const votesRecord: VoteRecord = votes.reduce(
      (acc: VoteRecord, vote: Vote) => {
        acc[createVoteLoaderId(vote)] = vote;
        return acc;
      },
      {}
    );

    return voteDataLoaderInputs.map(
      (input) => votesRecord[createVoteLoaderId(input)]
    );
  });
