import React from "react";
import { useState, useRef } from "react";
import { postAction } from "../../App";
import axios from "axios";

function AccountPage() {
  const [selectedApi, setSelectedApi] = useState("t010");
  const [dataAuthor, setDataAuthor] = useState("");
  const [dataId, setDataId] = useState("");
  const [dataPassword, setDataPassword] = useState("");
  const [dataResNoFront, setDataResNoFront] = useState("");
  const [dataResNoBack, setDataResNoBack] = useState("");
  const [dataPhoneNoFront, setDataPhoneNoFront] = useState("");
  const [dataPhoneNoBack, setDataPhoneNoBack] = useState("");
  const [dataImage, setDataImage] = useState("");
  const [dataPasswordCheck, setDataPasswordCheck] = useState("");
  const [image, setImage] = useState("");
  const imgRef = useRef();

  function handleApi() {
    const formData = new FormData(); //image file을 서버로 보내기 위한 Form을 만들어 준다.
    formData.append("image", image); // formData안에 image와 dataId를 blob형태로 만들어 줘 request를 보낼 수 있도록 해준다.
    formData.append("loginId", dataId);
    axios
      .post("/api/files/images", formData, {
        headers: { "Content-Type": "multipart/form-data" }, //form data를서버로 호출할 때의 양식이라고 생각됨
      }) //formData를 axios로 api 호출을 함으로써 서버로 post 해준다.
      .then((res) => {
        console.log("resres", res.data.msg);
        sessionStorage.setItem("image", res.data.msg); //formData를 서버에 저장시키고 그 경로를 가져와 세션에 저장시켜준다.
        window.location.href = "/PostPage";
      });
  }

  const saveImgFile = (e) => {
    const file = imgRef.current.files[0]; //imgRef.current.files[0] 에 접근을 하면 필요한 데이터가 있다.

    const reader = new FileReader(); //FileReader() 의 객체 const reader를 생성한다.
    //-> FileReader : 웹이 비동기적으로 데이터를 읽기 위하여 파일을 가리키는 File객체를 이용해 파일 내용을 읽거나 저장시키는 함수.
    reader.readAsDataURL(file); //FileReader()의 메서드 중 readAsDataURL()로 파일을 읽는다
    reader.onloadend = () => {
      setDataImage(reader.result); //FileReader() 이벤트핸들러 중 onloadend를 활용해 동작이 성공적으로 완료됐을 때 useState 실행 함수에 reader.result를 넣어 imgFile의 상태를 변환시켜준다.
      console.log(e.target.files); // imgFile이 변경되면 useState에 의해 재랜더링이 이루어지고 Img태그의 src에서 result 값을 처리해준다.
      setImage(e.target.files[0]); //결과 : result 값이 안 들어온 상태면 이미지를 기본 이미지로 올리고, result 값이 truthy하게 변하면 result 값을 src에 넣어주면 이미지가 로딩된다.
    };
  };

  let No010 = "";

  let loginIdCheck = () => {
    console.log("loginId", dataId);
    postAction("/api/find/accounts", {
      loginId: dataId,
    }).then((res) => {
      console.log("reseres", res);
      if (res.msg == "아이디가 있다") {
        alert("중복된 아이디가 있습니다.");
      } else {
        alert("중복된 아이디가 없습니다.");
      }
    });
  };

  let apiChanges = (e) => {
    setSelectedApi(e.target.selectedOptions[0].value);
  }; //selectedApi(optionvalue)가 바뀔때마다 값을 변화시켜준다.

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
  } //휴대폰 제일 앞자리를 나타내주는 switch

  let loginButton = () => {
    let dataResNo = dataResNoFront + dataResNoBack;

    let dataPhoneNo = No010 + dataPhoneNoFront + dataPhoneNoBack;

    if (
      dataAuthor == "" ||
      dataId == "" ||
      dataPassword == "" ||
      dataPasswordCheck == "" ||
      dataResNoFront == "" ||
      dataResNoBack == "" ||
      dataPhoneNoFront == "" ||
      dataPhoneNoBack == "" ||
      image == ""
    ) {
      alert("값을 모두 입력 해 주세요");
    } else if (dataPassword != dataPasswordCheck) {
      //암호체크
      alert("암호가 맞지 않습니다.");
    } else {
      console.log("통과합니다");
      postAction("/api/find/accountId", {
        //이 request(loginId)를 보내면 accounts.db에 값이 있는지 확인
        author: dataAuthor,
        loginId: dataId,
        password: dataPassword,
        resNo: dataResNo,
        phoneNo: dataPhoneNo,
      }).then(function (res) {
        //서버에서는 loginId가 없으면 새로운 계정을 만들고 있으면 계정이 안만들어 지도록 함
        if (res.length == 0) {
          console.log("ㄱㄷㄴㄱㄷㅂㅂㅇㅈ", res);
          alert("회원가입에 성공하셨습니다.");
          sessionStorage.setItem("loginId", dataId);
          sessionStorage.setItem("password", dataPassword);
          sessionStorage.setItem("author", dataAuthor);
          sessionStorage.setItem("resNo", dataResNo);
          sessionStorage.setItem("phoneNo", dataPhoneNo); //db에 저장된 계정의 값들을 세션에 저장시켜 로그인 중이라는 것을 확인
          handleApi(); //계정만들때 사진까지 첨부 하도록 했음
        } else {
          alert("같은아이디가 있습니다."); //accounts.db에 계정이 있으면 알람이 뜨도록 하였음
        }
      });
    }
  };

  return (
    <div className="body">
      <h3>회원가입</h3>
      <table border="1" width="400" height="400">
        <tr>
          <td align="center" bgcolor="#FFFFCC">
            이름
          </td>
          <td>
            <input
              value={dataAuthor}
              onChange={(event) => {
                setDataAuthor(event.target.value);
              }}
            />
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#FFFFCC">
            사진
          </td>
          <td>
            {" "}
            <img
              style={{ width: "80px", height: "60px" }}
              src={
                dataImage
                  ? dataImage
                  : `${process.env.PUBLIC_URL}/images/noimg.jpg`
              }
            />
            <label className="signup-profileImg-label" htmlFor="profileImg">
              {/* label과 input을 연결시켜야 할때 html에서는 for를 썻지만 react에서는 htmlFor를 쓴다. */}
              프로필 이미지 추가
            </label>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#FFFFCC">
            아이디
          </td>
          <td>
            <input
              value={dataId}
              onChange={(event) => {
                setDataId(event.target.value);
              }}
            />
            &nbsp;
            <button onClick={loginIdCheck}>중복검사</button>
          </td>
        </tr>

        <tr>
          <td align="center" bgcolor="#FFFFCC">
            암호
          </td>

          <td>
            <input
              type="password"
              value={dataPasswordCheck}
              onChange={(event) => {
                setDataPasswordCheck(event.target.value);
              }}
            />
          </td>
        </tr>

        <tr>
          <td align="center" bgcolor="#FFFFCC">
            암호확인
          </td>

          <td>
            <input
              type="password"
              value={dataPassword}
              onChange={(event) => {
                setDataPassword(event.target.value);
              }}
            />
          </td>
        </tr>

        <tr>
          <td align="center" bgcolor="#FFFFCC">
            주민번호
          </td>

          <td>
            <input
              maxLength="6"
              size="6"
              value={dataResNoFront}
              onChange={(event) => {
                setDataResNoFront(event.target.value);
              }}
            />
            -
            <input
              type="password"
              maxLength="7"
              size="7"
              value={dataResNoBack}
              onChange={(event) => {
                setDataResNoBack(event.target.value);
              }}
            />
          </td>
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

      <input
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        id="profileImg" //<label>과 연결시키는 아이디
        onChange={saveImgFile} // saveImgFile 함수 호출
        ref={imgRef} //ref prop으로 imgRef를 전달 -> img current 속성을 통해 <input> 엘레먼트에 접근
      />
      <br></br>

      <br></br>
      <br />
      <button onClick={loginButton}>가입하기</button>
      <button
        onClick={function () {
          window.location.href = "/LoginPage";
        }}
      >
        돌아가기
      </button>
      <br></br>
    </div>
  );
}

export default AccountPage;
