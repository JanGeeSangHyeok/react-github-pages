import React, { useEffect, useState } from "react";
import CommentPage2 from "./CommentPage2";
import { postAction } from "../../App";
import ImageTest from "./ImageTest";
function CommentPage(props) {
  const [comment, setComment] = useState([]);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [editedCommentContents, setEditedCommentContents] = useState("");
  const [check, setCheck] = useState("");

  let url = window.location.search;
  let params = new URLSearchParams(url);
  let id = params.get("id");

  let loadComment = () => {
    postAction("/api/get/comment", { id: parseInt(id) }).then((res) => {
      setComment(res);
    });
  };
  console.log("xxxxxxxxx", comment);
  useEffect(() => {
    loadComment();
  }, []);

  return (
    <div>
      {comment.map((x) => {
        return <ImageTest id={x.id} no={x.no}></ImageTest>;
      })}
    </div>
    // <div>
    //   {comment.map((x) => {
    //     if (x.editable == true && isCommentEditing) {
    //       return (
    //         <div className="comment-body-1">
    //           <ul className="comment-list">
    //             <div>
    //               <li className="comment-list-1">{x.author}</li>
    //               <li className="comment-list-2">
    //                 <input
    //                   className="Content-textarea"
    //                   value={editedCommentContents}
    //                   placeholder="텍스트를 입력하세요"
    //                   onChange={(event) => {
    //                     setEditedCommentContents(event.target.value);
    //                   }}
    //                 ></input>
    //               </li>

    //               <button
    //                 onClick={function () {
    //                   postAction("/api/update/editcomment", {
    //                     no: x.no,
    //                     id: x.id,
    //                     contents: editedCommentContents,
    //                   }).then((res) => {
    //                     console.log("성공하였습니다.");
    //                     console.log("resresres", res);
    //                     setIsCommentEditing(false);
    //                   });
    //                 }}
    //                 style={{ float: "right" }}
    //               >
    //                 수정하기
    //               </button>

    //               <button
    //                 style={{ float: "right" }}
    //                 value={check}
    //                 onClick={function () {
    //                   postAction("/api/update/comment", { no: x.no }).then(
    //                     (res) => {
    //                       setCheck(res);
    //                       window.location.reload();
    //                     }
    //                   );
    //                 }}
    //               >
    //                 삭제하기
    //               </button>
    //             </div>
    //           </ul>
    //           <br></br>
    //         </div>
    //       );
    //     } else {
    //       return (
    //         <div className="comment-body-1">
    //           <div>
    //             <ul className="comment-list">
    //               <div className="comment-div">
    //                 <li className="comment-list-1">{x.author}</li>
    //                 <li className="comment-list-2">{x.contents}</li>
    //                 <li>{x.creationDate}</li>
    //               </div>
    //               <br></br>
    //               <button
    //                 onClick={function () {
    //                   postAction("/api/find/comments", {
    //                     no: x.no,
    //                     id: x.id,
    //                   }).then((res) => {
    //                     console.log("성공하였습니다.");
    //                     setIsCommentEditing(true);
    //                     setEditedCommentContents(x.contents);
    //                   });
    //                 }}
    //                 style={{ float: "right" }}
    //               >
    //                 수정하기
    //               </button>

    // <button
    //   style={{ float: "right" }}
    //   value={check}
    //   onClick={function () {
    //     postAction("/api/update/comment", { no: x.no }).then(
    //       (res) => {
    //         setCheck(res);
    //         window.location.reload();
    //       }
    //     );
    //   }}
    // >
    //   삭제하기
    // </button>
    //             </ul>
    //             <br></br>
    //           </div>
    //           <br></br>
    //           <ImageTest no={x.no} />
    //           {/* <CommentPage2 id={x.id} no={x.no} /> */}
    //         </div>
    //       );
    //     }
    //   })}
    // </div>
  );
}

export default CommentPage;
