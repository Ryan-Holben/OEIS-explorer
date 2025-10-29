/**
 * Simple hash-based router for GitHub Pages compatibility
 *
 * Routes:
 * - #/ or empty - HomePage
 * - #/sequence/:id - SequenceDetailPage
 * - #/search?q=... - SearchResultsPage
 */

import { useState, useEffect } from 'react';

export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}

export interface Route {
  path: string;
  params: RouteParams;
  query: URLSearchParams;
}

/**
 * Parse the current hash route
 */
function parseRoute(): Route {
  const hash = window.location.hash.slice(1) || '/'; // Remove '#'
  const [pathPart, queryPart] = hash.split('?');
  const query = new URLSearchParams(queryPart || '');

  // Parse path segments
  const segments = pathPart.split('/').filter(Boolean);
  const params: RouteParams = {};

  // Match route patterns
  if (segments.length === 0) {
    return { path: '/', params, query };
  }

  if (segments[0] === 'sequence' && segments[1]) {
    return {
      path: '/sequence/:id',
      params: { id: segments[1] },
      query
    };
  }

  if (segments[0] === 'search') {
    return { path: '/search', params, query };
  }

  // Default to home for unknown routes
  return { path: '/', params, query };
}

/**
 * Hook to get current route and navigation functions
 */
export function useRouter() {
  const [route, setRoute] = useState<Route>(parseRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const goBack = () => {
    window.history.back();
  };

  return {
    route,
    navigate,
    goBack,
  };
}

/**
 * Navigation helper functions
 */
export const router = {
  toHome: () => {
    window.location.hash = '/';
  },

  toSequence: (id: string) => {
    window.location.hash = `/sequence/${id}`;
  },

  toSearch: (query: string) => {
    window.location.hash = `/search?q=${encodeURIComponent(query)}`;
  },
};
