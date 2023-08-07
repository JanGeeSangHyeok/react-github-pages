import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PostPage from "./views/PostPage/PostPage";
import CreatePage from "./views/CreatePage/CreatePage";
import ContentPage from "./views/ContentPage/ContentPage";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo.svg";
import "../App.css";
import Debug from "./Debug";
import LoginPage from "./views/LoginPage/LoginPage";
import AccountPage from "./views/AccountPage/AccountPage";
import ImageTest from "./views/ContentPage/ImageTest";
import CommentPage from "./views/ContentPage/CommentPage";
import CommentPage1 from "./views/ContentPage/CommentPage1";
import CommentWrite from "./views/ContentPage/CommentWrite";
import PersonalPage from "./views/PersonalPage/PersonalPage";
import FileUpload from "./views/FileUpload/FileUpload";

export async function postAction(endpoint = "/", request = null) {
  if (request == null) {
    const response = await fetch(endpoint, { method: "POST" });

    return await response.json(); //입력한 값이 없을때
  } else {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return await response.json();
  }
} //입력한 값이 있을때

function App() {
  //const navigate = useNavigate();
  const [data, setData] = useState("");
  const navigateHome = () => {
    window.location.href = "/";
  };
  const navigatePostPage = () => {
    window.location.replace("/PostPage");
  };
  const navigateLoginPage = () => {
    window.location.href = "/LoginPage";
  };

  useEffect(() => {
    async function loadData() {
      let response = await (await fetch("/api/main")).json();

      setData(response.response);
    }

    loadData();
  });
  return (
    <div>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route
            path="/"
            element={
              <header onClick={navigateLoginPage} className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
              </header>
            }
          ></Route>{" "}
          // 3000 기본화면
          <Route path="/debug" element={<Debug />}></Route>
          <Route path="/PostPage" element={<PostPage />}></Route>
          <Route path="/CreatePage" element={<CreatePage />}></Route>
          <Route path="/ContentPage" element={<ContentPage />}></Route>
          <Route path="/LoginPage" element={<LoginPage />}></Route>
          <Route path="/AccountPage" element={<AccountPage />}></Route>
          <Route path="/ImageTest" element={<ImageTest />}></Route>
          <Route path="/CommentPage" element={<CommentPage />}></Route>
          <Route path="/CommentPage1" element={<CommentPage1 />}></Route>
          <Route path="/CommentWrite" element={<CommentWrite />}></Route>
          <Route path="/PersonalPage" element={<PersonalPage />}></Route>
          <Route path="/FileUpload" element={<FileUpload />}></Route>
        </Routes>
      </BrowserRouter>
      <div></div>
    </div>
  );
}

export default App;
