import React, { useState, useEffect, useMemo } from "react";

import "../../../App.css";

import { postAction } from "../../App";

function PostPage() {
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedApi, setSelectedApi] = useState("번호");

  const getValue = (e) => {
    setUserInput(e.target.value.toLowerCase());
  };

  const searched = data.filter((item) => {
    if (selectedApi == "번호") {
      return item.id.toString().toLowerCase().includes(userInput);
    } else if (selectedApi == "제목") {
      return item.title.toLowerCase().includes(userInput);
    } else if (selectedApi == "작성자") {
      return item.author.toLowerCase().includes(userInput);
    }
  });

  let apiChanges = (e) => {
    setSelectedApi(e.target.selectedOptions[0].value);
  };

  console.log("serldencq", selectedApi);
  let createAuthor = sessionStorage.getItem("author");
  let createImage = sessionStorage.getItem("image");

  const navigateCreatePost = () => {
    window.location.href = "/CreatePage";
  };

  const navigateLoginPage = () => {
    window.location.href = "/LoginPage";
  };

  useEffect(() => {
    postAction("/api/get/allPosts").then((res) => {
      if (res.msg == "게시물이 없습니다.") {
        setNoData(true);
      } else {
        res.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return;
        });
        setData(res);
      }
    });
  }, []);

  return (
    <div className="body">
      <div style={{ float: "right" }}>
        <table>
          <tr>
            <td>
              <button>게시판 가기</button>&nbsp;
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
      <div></div>

      <h1>게시판</h1>
      <br></br>
      <select onChange={apiChanges}>
        <option value="번호">번호</option>
        <option value="제목">제목</option>
        <option value="작성자">작성자</option>
      </select>
      <input onChange={getValue} placeholder="검색하세요"></input>

      <button
        size="large"
        style={{ float: "right" }}
        onClick={navigateCreatePost}
      >
        게시판쓰기
      </button>
      <br></br>
      <br></br>

      <table className="post-board">
        <tr className="head-title">
          <td>번호</td>
          <td>제목</td>
          <td>작성자</td>
          <td>생성날짜</td>
          <td>조회수</td>
        </tr>

        {noData ? (
          <p>게시물이 없습니다.</p>
        ) : (
          searched.map((x, i) => {
            return (
              <tr key={i} className="post-body">
                <td>{x.id}</td>
                <td>
                  <a
                    onClick={function () {
                      postAction("/api/update/count", {
                        id: x.id,
                        view: x.view,
                      }).then((res) => {
                        console.log({ res });
                      });
                    }}
                    href={"/ContentPage?id=" + x.id}
                  >
                    {x.title}
                  </a>
                </td>
                <td>{x.author}</td>
                <td>{x.creationDate.slice(0, 11)}</td>
                <td>{x.view}</td>
              </tr>
            );
          })
        )}
      </table>
    </div>
  );
}

export default PostPage;
