import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DraftEditor from "./pages/DraftEditor";
import ClausesLibrary from "./pages/ClausesLibrary";
import NegotiationWorkspace from "./pages/NegotiationWorkspace";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/draft/:id?" element={<DraftEditor />} />
            <Route path="/clauses" element={<ClausesLibrary />} />
            <Route path="/negotiation/:id" element={<NegotiationWorkspace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
