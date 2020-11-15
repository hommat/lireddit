import { useEffect } from 'react';
import { useCurrentUserQuery } from '../generated/graphql';
import { useRouter } from 'next/router';

export const useIsAuth = () => {
  const [{ fetching, data }] = useCurrentUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.currentUser) {
      router.replace(`/login?next=${router.pathname}`);
    }
  }, [fetching, data, router]);
};
