import { useEffect } from 'react';
import { useCurrentUserQuery } from '../generated/graphql';
import { useRouter } from 'next/router';

export const useIsAuth = () => {
  const { loading, data } = useCurrentUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.currentUser) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [loading, data, router]);
};
