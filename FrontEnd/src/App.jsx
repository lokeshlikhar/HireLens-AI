import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes.jsx";
import "./style.css";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";
function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}></RouterProvider>
      </InterviewProvider>
    </AuthProvider>
  );
}

export default App;
