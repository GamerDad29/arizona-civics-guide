import { Router, Route, Switch } from 'wouter';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { RepresentativesPage } from './pages/RepresentativesPage';
import { RepDetailPage } from './pages/RepDetailPage';
import { ElectionsPage } from './pages/ElectionsPage';
import { DistrictsPage } from './pages/DistrictsPage';
import { AboutPage } from './pages/AboutPage';
import { BillsPage } from './pages/BillsPage';
import { BudgetPage } from './pages/BudgetPage';
import { IssuesPage } from './pages/IssuesPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/representatives" component={RepresentativesPage} />
          <Route path="/representatives/:id" component={RepDetailPage} />
          <Route path="/elections" component={ElectionsPage} />
          <Route path="/districts" component={DistrictsPage} />
          <Route path="/bills" component={BillsPage} />
          <Route path="/budget" component={BudgetPage} />
          <Route path="/issues" component={IssuesPage} />
          <Route path="/about" component={AboutPage} />
          <Route>
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
              <h1 className="font-display font-bold text-4xl text-ink mb-4">Page Not Found</h1>
              <p className="text-ink/60">The page you are looking for does not exist.</p>
            </div>
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}
