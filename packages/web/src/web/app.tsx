import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/index";
import CandidatePage from "./pages/candidate";
import PartiesPage from "./pages/parties";
import IntegrityPage from "./pages/integrity";
import ComparePage from "./pages/compare";
import MethodologyPage from "./pages/methodology";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/candidate/:id" component={CandidatePage} />
          <Route path="/parties" component={PartiesPage} />
          <Route path="/integrity" component={IntegrityPage} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/methodology" component={MethodologyPage} />
        </Switch>
      </Layout>
    </QueryClientProvider>
  );
}
