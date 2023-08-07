import React, { useEffect, useState } from "react";
import { postAction } from "../../App";

function CommentWrite(props) {
  let url = window.location.search;
  let params = new URLSearchParams(url);
  let id = params.get("id");
  // console.log("dqqqqqq", props);
  function sendTextValue() {
    props.getTextValue("자식에서 부모로 값 보내기!");
  }

  const [dataContents, setDataContents] = useState("");
  const [idValue, setIdValue] = useState(Number(id));
  const [log, setLog] = useState([]);
  const [comment, setComment] = useState([]);

  let createAuthor = sessionStorage.getItem("author");
  let createPassword = sessionStorage.getItem("password");

  let handleOnKeyPress = (e) => {
    if (e.key == "Enter") {
      execution();
    }
  };
  let execution = (e) => {
    if (dataContents === "") {
      alert("값을 전부 입력해 주세요");
    } else {
      postAction("/api/new/comment", {
        id: idValue,
        contents: dataContents,
        author: createAuthor,
        password: createPassword,
      }).then((res) => {
        setDataContents("");
        loadComment();
        window.location.reload();
      });
      //navigate("/ContentPage?id=" + id);
      // window.location.replace("/ContentPage?id=" + id);
    }
  };

  let loadComment = () => {
    postAction("/api/get/comment", { id: parseInt(id) }).then((res) => {
      setComment(res);
    });
  };

  useEffect(() => {
    sendTextValue();
    loadComment();
  }, []);
  return (
    <div>
      <div style={{ float: "bottom" }}>
        <br></br>
        <br></br>

        <span>댓글</span>

        <br></br>

        <br></br>
        <span>
          <textarea
            className="Content-textarea"
            value={dataContents}
            placeholder="텍스트를 입력하세요"
            onKeyPress={handleOnKeyPress}
            onChange={(event) => {
              setDataContents(event.target.value);
            }}
          ></textarea>
          <br></br>
          <button
            style={{ paddingTop: 0, paddingBottom: 0 }}
            onClick={execution}
          >
            새글쓰기
          </button>
          <input
            style={{ display: "none" }}
            value={idValue}
            onChange={(event) => {
              setIdValue(event.target.value);
            }}
          ></input>
        </span>
      </div>
    </div>
  );
}

export default CommentWrite;
