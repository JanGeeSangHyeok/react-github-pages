import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CommentPage1 from "./CommentPage1";
import CommentWrite from "./CommentWrite";
import CommentPage from "./CommentPage";
import { postAction } from "../../App";
import ImageTest from "./ImageTest";
function ContentPage() {
  const [testValue, setTestValue] = useState("테스트입니다.");
  const [realValue, setRealValue] = useState(false);
  const [comment, setComment] = useState([]);

  let url = window.location.search;
  let params = new URLSearchParams(url);
  let id = params.get("id");

  console.log(url);
  console.log(params);
  console.log(id);
  const getTextValue = (text) => {
    setTestValue(text);
  };
  const getRealValue = () => {
    setRealValue(true);
  };

  const getFalseValue = () => {
    console.log("rea");
    setRealValue(false);
  };

  let createAuthor = sessionStorage.getItem("author");

  let createImage = sessionStorage.getItem("image");
  let createLoginId = sessionStorage.getItem("loginId");
  console.log("props", createAuthor);
  let loadComment = () => {
    postAction("/api/get/comment", { id: parseInt(id) }).then((res) => {
      res.sort((a, b) => {
        if (a.creationDate > b.creationDate) return 1;
        if (a.creationDate < b.creationDate) return -1;
      });
      setComment(res);
    });
  };
  const navigateLoginPage = () => {
    window.location.href = "/LoginPage";
  };

  const navigatePostPage = () => {
    window.location.href = "/PostPage";
  };

  useEffect(() => {
    loadComment();
  }, []);

  return (
    <div className="body">
      <div style={{ float: "right" }}>
        <table>
          <tr>
            <td>
              <button
                onClick={() => {
                  window.location.href = "/Postpage";
                }}
              >
                게시판 가기
              </button>
              &nbsp;
            </td>
            <td>
              <button onClick={navigateLoginPage}>로그아웃</button>&nbsp;
            </td>
            <td>
              <img
                style={{ width: "50px", height: "60px" }}
                src={`${process.env.PUBLIC_URL}${createImage}`}
              ></img>
            </td>
            <td>
              <label>
                <a href={"/PersonalPage"}>{createAuthor}</a>님 반갑습니다.
              </label>
            </td>
          </tr>
        </table>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <CommentPage1
        value={realValue}
        getRealValue={getRealValue}
        getFalseValue={getFalseValue}
      />
      <br></br>
      <hr></hr>
      {realValue ? null : (
        <div className="comment-body">
          <CommentWrite value={testValue} getTextValue={getTextValue} />
          <br></br>
          {comment
            .filter((x) => x.refId == -1)
            .map((x, i) => {
              return (
                <div key={i}>
                  <ImageTest
                    id={x.id}
                    no={x.no}
                    author={x.author}
                    editable={x.editable}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default ContentPage;
