import { useState } from 'react'


import StudentList from "./pages/login/StudentList.jsx";
import TeacherLogin from "./pages/login/TeacherLogin.jsx";
import TeacherRegister from "./pages/login/TeacherRegister.jsx";
import ImportAI from "./pages/login/ImportAI.jsx";
import CreatePage from "./pages/login/CreatePage.jsx";
import TeacherHome from './pages/home/TeacherHome.jsx';
import AdminPage from './pages/home/AdminPage.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ExamPage from './pages/exam/ExamPage.jsx';
import ExamEditor from './pages/exam/ExamEditor';

// This is the first page, aka the login page
// to run app do npm run dev

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    {
      path: "/",
      element:(
    
      <TeacherLogin />
      )
      
    },
    {
      path: "/teacher",
      element:(
      <StudentList />


      )
    },

    {
      path: "/a-register",
      element:(
      <TeacherRegister />


      )
    },
    {
      path: "/importai",
      element:(
      <ImportAI />


      )
    },
    {
      path: "/create-exam",
      element:(
      <CreatePage />


      )
    },
    {
      path: "/dashboard",
      element:(
      <TeacherHome />


      )
    },
    {
      path: "/admin",
      element:(
        <AdminPage />
      )
    },
    {
      path: "/preview-exam/:examId",
      element: <ExamPage />
    },
    {
      path: "/edit-exam/:examId",
      element: <ExamEditor />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );


}

export default App
