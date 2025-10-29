import { useRouter } from './hooks/useRouter';
import { HomePage } from './pages/HomePage';
import { SequenceDetailPage } from './pages/SequenceDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import './App.css';

function App() {
  const { route } = useRouter();

  // Route to appropriate page
  if (route.path === '/sequence/:id' && route.params.id) {
    return <SequenceDetailPage sequenceId={route.params.id} />;
  }

  if (route.path === '/search') {
    const query = route.query.get('q') || '';
    return <SearchResultsPage initialQuery={query} />;
  }

  // Default to HomePage
  return <HomePage />;
}

export default App;
