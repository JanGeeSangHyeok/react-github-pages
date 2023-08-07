import React, { useState, useRef } from "react";
import { postAction } from "../../App";
import axios from "axios";
function PersonalPage() {
  const [checkPassword, setCheckPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedApi, setSelectedApi] = useState("t010");
  const [dataPhoneNoFront, setDataPhoneNoFront] = useState("");
  const [dataPhoneNoBack, setDataPhoneNoBack] = useState("");
  const [dataImage, setDataImage] = useState("");
  const [image, setImage] = useState("");
  const [dataId, setDataId] = useState("");

  const imgRef = useRef();
  let passwordPrompt = (e) => {
    let promtValue = prompt("암호를 입력하세요");
    console.log("xxxx", promtValue);
    if (createPassword != promtValue) {
      alert("암호가 맞지 않습니다.");
    } else {
      setIsEditing(true);
    }
  };

  let apiChanges = (e) => {
    setSelectedApi(e.target.selectedOptions[0].value);
  };

  const saveImgFile = (e) => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setDataImage(reader.result);
      console.log(e.target.files);
      setImage(e.target.files[0]);
    };
  };

  let No010 = "";

  switch (selectedApi) {
    case "t010":
      No010 = "010";
      break;
    case "t011":
      No010 = "011";
      break;
    case "t016":
      No010 = "016";
      break;
    case "t017":
      No010 = "017";
      break;
    case "t019":
      No010 = "019";
  } //선택하세요 추가

  function handleApi() {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("loginId", createId);
    axios
      .post("/api/files/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("resres", res.data.msg);
        sessionStorage.setItem("image", res.data.msg);
        window.location.reload();
      });
  }
  let editButton = () => {
    console.log("set", No010);

    if (image == "" || dataPhoneNoBack == "" || dataPhoneNoFront == "") {
      alert("값을 모두 입력하세요");
    } else {
      let phoneNo = No010 + dataPhoneNoFront + dataPhoneNoBack;

      postAction("/api/update/phoneNo", {
        loginId: createId,
        phoneNo: phoneNo,
      }).then((res) => {
        console.log("edit완료1", res);
        alert("수정이 완료되었습니다.");
        window.sessionStorage.setItem("phoneNo", phoneNo);
        handleApi();
      });
    }
  };

  let createAuthor = sessionStorage.getItem("author");
  let createPassword = sessionStorage.getItem("password");
  let createPhoneNo = sessionStorage.getItem("phoneNo");
  let createResNo = sessionStorage.getItem("ResNo");
  let createId = sessionStorage.getItem("loginId");
  let createImage = sessionStorage.getItem("image");

  let phoneFront = createPhoneNo.slice(0, 3);
  let phoneMiddle = createPhoneNo.slice(3, 7);
  let phoneBack = createPhoneNo.slice(7, 11);
  let phone = phoneFront + "-" + phoneMiddle + "-" + phoneBack;

  return (
    <div className="body">
      <h3>개인정보</h3>
      {isEditing ? (
        <div>
          <table border="1" width="400" height="400">
            <tr>
              <td align="center" bgcolor="#FFFFCC">
                이름
              </td>
              <td>{createAuthor}</td>
            </tr>
            <tr>
              <td align="center" bgcolor="#FFFFCC">
                사진
              </td>

              <td>
                <input
                  style={{ display: "none" }}
                  type="file"
                  accept="image/*"
                  id="profileImg"
                  onChange={saveImgFile}
                  ref={imgRef}
                />
                <img
                  style={{ width: "200px", height: "150px" }}
                  src={
                    dataImage
                      ? dataImage
                      : `${process.env.PUBLIC_URL}${createImage}`
                  }
                />
                <label className="signup-profileImg-label" htmlFor="profileImg">
                  프로필 이미지 추가
                </label>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#FFFFCC">
                아이디
              </td>
              <td>{createId}</td>
            </tr>

            <tr>
              <td align="center" bgcolor="#FFFFCC">
                연락처
              </td>

              <td>
                <select onChange={apiChanges}>
                  <option value="t010">010</option>

                  <option value="t011">011</option>

                  <option value="t016">016</option>

                  <option value="t017">017</option>

                  <option value="t019">019</option>
                </select>
                -
                <input
                  value={dataPhoneNoFront}
                  onChange={(event) => {
                    setDataPhoneNoFront(event.target.value);
                  }}
                  type="text"
                  maxLength="4"
                  size="4"
                />
                -
                <input
                  value={dataPhoneNoBack}
                  onChange={(event) => {
                    setDataPhoneNoBack(event.target.value);
                  }}
                  type="text"
                  maxLength="4"
                  size="4"
                />
              </td>
            </tr>
          </table>
          <button onClick={editButton}>수정하기</button>
          <button
            onClick={function () {
              window.location.reload();
            }}
          >
            취소하기
          </button>
        </div>
      ) : (
        <div>
          <table border="1" width="400" height="400">
            <tr>
              <td align="center" bgcolor="#FFFFCC">
                이름
              </td>
              <td>{createAuthor}</td>
            </tr>
            <tr>
              <td align="center" bgcolor="#FFFFCC">
                사진
              </td>

              <td>
                <img
                  style={{ width: "200px", height: "150px" }}
                  src={`${process.env.PUBLIC_URL}${createImage}`}
                ></img>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="#FFFFCC">
                아이디
              </td>
              <td>{createId}</td>
            </tr>

            <tr>
              <td align="center" bgcolor="#FFFFCC">
                연락처
              </td>

              <td>{phone}</td>
            </tr>
          </table>
          <button onClick={passwordPrompt}>개인정보 수정</button>
          <button
            onClick={function () {
              window.location.href = "/PostPage";
            }}
          >
            돌아가기
          </button>
        </div>
      )}
    </div>
  );
}

export default PersonalPage;
