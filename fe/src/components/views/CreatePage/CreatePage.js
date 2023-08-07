import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { postAction } from "../../App";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function CreatePage() {
  let createAuthor = sessionStorage.getItem("author");
  let createPassword = sessionStorage.getItem("password");

  const [log, setLog] = useState("");
  const [dataAuthor, setDataAuthor] = useState(createAuthor);
  const [dataPassword, setDataPassword] = useState(createPassword);
  const [dataTitle, setDataTitle] = useState("");
  const [dataContents, setDataContents] = useState("");
  const navigate = useNavigate();
  let loginId = sessionStorage.getItem("loginId");
  let createImage = sessionStorage.getItem("image");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  let execution = (e) => {
    if (
      dataAuthor == "" ||
      dataPassword == "" ||
      dataTitle == "" ||
      dataContents == ""
    ) {
      alert("값을 전부 입력해 주세요");
    } else {
      postAction("/api/new/post", {
        check: true,
        view: 0,
        title: dataTitle,
        contents: dataContents,
        author: dataAuthor,
        password: dataPassword,
        loginId: loginId,
        path: createImage,
      }).then((res) => {
        setLog(JSON.stringify(res));
      });
      window.location.href = "/PostPage";
    }
  };
  useEffect(() => {});
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
              <button
                onClick={() => {
                  window.location.herf = "/LoginPage";
                }}
              >
                로그아웃
              </button>
              &nbsp;
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
      <h1>게시판 생성</h1>
      <div>
        <div className="span-holder">
          <span className="span-contents">
            <input
              value={dataAuthor}
              style={{ display: "none" }}
              onChange={(event) => {
                setDataAuthor(event.target.value);
              }}
            ></input>
          </span>
        </div>
        <div className="span-holder">
          <span className="span-contents">
            <input
              value={dataPassword}
              style={{ display: "none" }}
              onChange={(event) => {
                setDataPassword(event.target.value);
              }}
            ></input>
          </span>
        </div>
        <div className="span-holder">
          <span className="span-contents">
            <input
              className="write-1"
              placeholder="제목을 입력하세요"
              value={dataTitle}
              onChange={(event) => {
                setDataTitle(event.target.value);
              }}
            ></input>
          </span>
        </div>
        <hr></hr>
        <div className="span-holder">
          <span className="span-contents">
            {/* <textarea
              className="write-2"
              placeholder="내용을 입력하세요"
              value={dataContents}
              name="Text1"
              cols="30"
              rows="5"
              onChange={(event) => {
                setDataContents(event.target.value);
              }}
            ></textarea> */}
            <ReactQuill
              modules={modules}
              value={dataContents}
              placeholder="내용을 입력하세요"
              onChange={(event) => {
                setDataContents(event);
              }}
            ></ReactQuill>
          </span>
        </div>
      </div>
      <br></br>
      <button onClick={execution}>게시물 생성</button>
    </div>
  );
}

export default CreatePage;
