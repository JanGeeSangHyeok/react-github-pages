import React, { useState, useEffect } from "react";
import { postAction } from "../../App";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function CommentPage1(props1) {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContents, setEditedContents] = useState("");

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

  let sendRealValue = () => {
    props1.getRealValue("성공했을ㄲ깡?");
  };

  let sendFalseValue = () => {
    props1.getFalseValue("성공");
  };

  let url = window.location.search;
  let params = new URLSearchParams(url);
  let id = params.get("id");

  let loginId = sessionStorage.getItem("loginId");

  let upDatePost = (e) => {
    postAction("/api/update/post", { id: parseInt(id) }).then((res) => {
      alert("삭제되었습니다.");
      window.location.href = "/Postpage";
    });
  };

  let editingButton = () => {
    setIsEditing(true);
    sendRealValue();
  };
  let editedButton = () => {
    postAction("/api/update/editpost", {
      id: Number(id),
      title: editedTitle,
      contents: editedContents,
    }).then((res) => {
      console.log("성공하였습니다.");
      setIsEditing(false);
      loadContent();
      sendFalseValue();
    });
  };

  const loadContent = () => {
    postAction("/api/get/post", { id: parseInt(id) }).then((res) => {
      setData(res);
    });
  };

  useEffect(() => {
    loadContent();
  }, []);
  return (
    <div>
      {data.map((x, i) => {
        let contents = x.contents;
        if (isEditing) {
          return (
            <div key={i}>
              <br></br>
              <br></br>
              <textarea
                className="write-1"
                onChange={(event) => {
                  setEditedTitle(event.target.value);
                }}
                value={editedTitle}
                placeholder="제목을 쓰십시오"
              ></textarea>
              <br></br>
              &nbsp;
              <img
                style={{ width: "50px", height: "60px" }}
                src={`${process.env.PUBLIC_URL}${x.path}`}
              ></img>
              <label style={{ float: "left", paddingleft: 20 }}>
                {x.author}
              </label>
              &nbsp;
              <label style={{ float: "right" }}>{x.creationDate} </label>
              <hr></hr>
              <div style={{ float: "right" }}>
                <button onClick={editedButton}>수정하기</button>
                <button
                  onClick={(event) => {
                    window.location.reload();
                  }}
                >
                  취소하기
                </button>
              </div>
              <br></br>
              <br></br>
              {/* <textarea
                cols="20"
                rows="20"
                className="write-2"
                value={editedContents}
                onChange={(event) => {
                  setEditedContents(event.target.value);
                }}
                placeholder="내용을 쓰십시오"
              ></textarea> */}
              <ReactQuill
                modules={modules}
                value={editedContents}
                onChange={(event) => {
                  console.log(editedContents);
                  setEditedContents(event);
                }}
              ></ReactQuill>
              <br></br>
            </div>
          );
        } else {
          return (
            <div key={i}>
              <h1>{x.title} </h1>
              &nbsp;
              <table>
                <tr>
                  <td>
                    <img
                      style={{ width: "50px", height: "60px" }}
                      src={`${process.env.PUBLIC_URL}${x.path}`}
                    ></img>
                  </td>
                  <td>
                    <label style={{ float: "left", paddingleft: 20 }}>
                      {x.author}{" "}
                    </label>
                  </td>
                </tr>
              </table>
              &nbsp;
              <label style={{ float: "right", paddingRight: 20 }}>
                {x.creationDate}{" "}
              </label>
              <hr></hr>
              {loginId == x.loginId ? (
                <div style={{ float: "right" }}>
                  <button onClick={upDatePost}>게시물 삭제</button>&nbsp;
                  <button
                    onClick={function () {
                      setIsEditing(true);
                      sendRealValue();
                      setEditedContents(x.contents);
                      setEditedTitle(x.title);
                    }}
                  >
                    게시물 수정
                  </button>
                </div>
              ) : null}
              <br></br>
              <br></br>
              <div dangerouslySetInnerHTML={{ __html: contents }}></div>
              <br></br>
            </div>
          );
        }
      })}
    </div>
  );
}

export default CommentPage1;
