import React, { useState } from "react";
import { postAction } from "../../App";

function LoginPage() {
  const [dataId, setDataId] = useState("");
  const [dataPassword, setDataPassword] = useState("");

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      loginButton(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  let loginButton = () => {
    postAction("/api/get/loginInfo", {
      //accounts.db에 들어있는 loginId && password를 같이 확인 시켜주는 api를 호출
      loginId: dataId,
      password: dataPassword,
    }).then((res) => {
      if (res.msg == "2") {
        //맞는 loginId와 password가 없다면 res.msg에 2가 들어있도록 함
        alert("아이디나 비번이 맞지 않습니다.");
      } else {
        sessionStorage.setItem("loginId", res[0].loginId);
        sessionStorage.setItem("password", res[0].password);
        sessionStorage.setItem("author", res[0].author);
        sessionStorage.setItem("resNo", res[0].resNo);
        sessionStorage.setItem("phoneNo", res[0].phoneNo);
        sessionStorage.setItem("image", res[0].path); //성공하면 계정이 가지고 있는 값들을 세션에 저장
        alert("로그인에 성공하였습니다.");
        window.location.replace("/PostPage"); //포스트 페이지로 연결
      }
    });
  };

  const navigateAccountPage = () => {
    window.location.replace("/AccountPage");
  };

  return (
    <div className="body">
      <h1>Login</h1>
      <fieldset>
        <legend>Login</legend>
        <input
          value={dataId}
          onChange={(event) => {
            setDataId(event.target.value);
          }}
          type="text"
          placeholder="아이디"
        ></input>
        <br></br>
        <input
          value={dataPassword}
          onKeyPress={handleOnKeyPress}
          onChange={(event) => {
            setDataPassword(event.target.value);
          }}
          type="password"
          placeholder="비밀번호"
        ></input>
        <br></br>
        <br></br>
        <button onClick={loginButton}>로그인</button>&nbsp;
        <button onClick={navigateAccountPage}>회원가입</button>
      </fieldset>
    </div>
  );
}

export default LoginPage;
