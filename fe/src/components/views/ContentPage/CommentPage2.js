import React, { useState, useEffect } from "react";
import { postAction } from "../../App";

function CommentPage2() {
  const [comment, setComment] = useState([]);
  const [logComment1, setLogComment1] = useState([]);
  const [comment1, setComment1] = useState("");

  let url = window.location.search;
  let params = new URLSearchParams(url);
  let id = params.get("id");
  let createAuthor = sessionStorage.getItem("author");

  useEffect(() => {
    postAction("/api/get/allcomment1", {}).then((res) => {
      setLogComment1(res);
      postAction("/api/get/comment", { id: parseInt(id) }).then((res) => {
        setComment(res);
      });
    });
  }, []);
  let A = logComment1.filter((x) => {
    return x.id == 2;
  });
  //console.log("xxxxx", comment);
  return (
    <div>
      대댓글{" "}
      <textarea
        value={comment1}
        onChange={(event) => {
          setComment1(event.target.value);
        }}
      ></textarea>
      &nbsp;
      <button
        onClick={function () {
          console.log("dwqdwqqdw", comment);
          postAction("/api/new/comment1", {
            id: comment.id,
            no: comment.no,
            contents: comment1,
            author: createAuthor,
          }).then((res) => {});
        }}
      >
        등록
      </button>
      {/* {comment.map((x) => {
        console.log("sssssssssss", x);

        return (
          <div>
            <textarea
              className="Content-textarea"
              value={comment1}
              onChange={(event) => {
                setComment1(event.target.value);
              }}
            ></textarea>
            <button
              onClick={function () {
                postAction("/api/new/comment1", {
                  id: x.id,
                  no: x.no,
                  contents: comment1,
                  author: createAuthor,
                }).then((res) => {});
              }}
            >
              달기
            </button>
          </div>
        );
      })} */}
    </div>
  );
}

export default CommentPage2;
