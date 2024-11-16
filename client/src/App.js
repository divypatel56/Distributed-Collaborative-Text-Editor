import TextEditor from "./TextEditor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect from "/" to a new document with a unique ID */}
        <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} />

        {/* Route to render the TextEditor component */}
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
