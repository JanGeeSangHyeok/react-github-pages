import React, { useEffect, useState } from "react";
import { postAction } from "../../App";

function ImageTest(props) {
  const [comment, setComment] = useState([]);
  const [check, setCheck] = useState("");
  const [reComment, setReComment] = useState("");
  const [editedReComment, setEditedReComment] = useState("");
  let createAuthor = sessionStorage.getItem("author");
  let stair = 1;
  if (props.stair) {
    if (props.stair > -1) {
      stair = props.stair + 1;
    }
  }

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      applyRecomment(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  const applyRecomment = () => {
    postAction("/api/new/comment", {
      id: props.id,
      refId: props.no,
      author: props.author,
      contents: reComment,
    }).then((res) => {
      console.log("res", res);
      setReComment("");
    });
  };

  let thisComment = comment.filter((x) => x.no == props.no)[0];
  let thisReComment = comment.filter((x) => x.refId == props.no);

  let loadComment = () =>
    postAction("/api/get/allComments").then((res) => {
      setComment(res);
    });
  useEffect(() => {
    loadComment();
  }, [comment]);

  return (
    <div>
      <hr></hr>
      {thisComment?.editable ? (
        <div style={{ paddingLeft: stair * 20 + "px" }}>
          <div style={{ float: "left" }}>
            {thisComment?.refId > -1 ? "▶" : null}
          </div>
          <ul className="comment-list">
            <li className="comment-list-1">{thisComment?.author}</li>
            <li className="comment-list-2">
              <textarea
                style={{ width: "300px" }}
                className="Content-textarea"
                placeholder="수정할 내용을 입력하세요"
                value={editedReComment}
                onChange={(event) => {
                  setEditedReComment(event.target.value);
                }}
              ></textarea>
              <button
                onClick={function () {
                  postAction("/api/update/editcomment", {
                    no: props.no,
                    contents: editedReComment,
                  }).then((res) => {
                    console.log("성공하였습니다.");
                  });
                }}
                style={{ float: "right" }}
              >
                수정확인
              </button>
            </li>
            <li>{thisComment?.creationDate}</li>
          </ul>

          <div></div>

          {thisReComment.map((x) => {
            return (
              <div>
                <ImageTest
                  no={x.no}
                  author={props.author}
                  stair={stair}
                  id={x.id}
                ></ImageTest>
              </div>
            );
          })}
          <br />
        </div>
      ) : (
        <div style={{ paddingLeft: stair * 20 + "px" }}>
          <div style={{ float: "left" }}>
            {thisComment?.refId > -1 ? "▶" : null}
          </div>
          <ul className="comment-list">
            <li className="comment-list-1">{thisComment?.author}</li>
            <li className="comment-list-2">{thisComment?.contents}</li>
            <li>{thisComment?.creationDate}</li>
          </ul>
          {thisComment?.author == createAuthor ? (
            <div>
              <button
                onClick={function () {
                  postAction("/api/find/comments", {
                    no: props.no,
                  }).then((res) => {
                    console.log("성공하였습니다.");

                    setEditedReComment(reComment);
                  });
                }}
                style={{ float: "right" }}
              >
                수정하기
              </button>
              <button
                style={{ float: "right" }}
                value={check}
                onClick={function () {
                  postAction("/api/update/comment", { no: props.no }).then(
                    (res) => {
                      console.log("성공");

                      loadComment();
                    }
                  );
                }}
              >
                삭제하기
              </button>
            </div>
          ) : null}

          <div>
            <table>
              <tr>
                <td>댓글</td>
                <td>
                  <textarea
                    style={{ width: "500px" }}
                    className="Content-textarea"
                    placeholder="텍스트를 입력하세요"
                    value={reComment}
                    onKeyPress={handleOnKeyPress}
                    onChange={(event) => {
                      setReComment(event.target.value);
                    }}
                  ></textarea>
                </td>
                <td>
                  <button onClick={applyRecomment}>달기</button>
                </td>
              </tr>
            </table>
          </div>

          {thisReComment.map((x) => {
            return (
              <div>
                <ImageTest
                  no={x.no}
                  author={props.author}
                  stair={stair}
                  id={x.id}
                ></ImageTest>
              </div>
            );
          })}
          <br />
        </div>
      )}
    </div>
  );
}

export default ImageTest;
