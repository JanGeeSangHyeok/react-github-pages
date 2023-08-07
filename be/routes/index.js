var express = require("express");

var router = express.Router();

const upload = require("../fileupload");
// const upload = multer({ dest: "./uploads/" });
var Datastore = require("nedb"), //nedb Class 로드
  db = new Datastore(); //db 변수에 Datasotre 클래스 생성

db.posts = new Datastore("posts.db"); //posts.db에 db.posts 테이블 데이터 링크
db.comments = new Datastore("comments.db"); //comments.db에 comments.posts 테이블 데이터 링크
db.accounts = new Datastore("accounts.db");
db.images = new Datastore("images.db");
//데이터 베이스 로드
db.posts.loadDatabase();
db.comments.loadDatabase();
db.accounts.loadDatabase();
db.images.loadDatabase();

router.get("/api/main", function (req, res, next) {
  res.send({ msg: "안녕하십니까" });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/api/get/allPosts", (req, res) => {
  db.posts.find(
    {
      check: true,
    },
    function (err, docs) {
      if (docs.length > 0) {
        res.send(docs);
      } else {
        res.send({ msg: "게시물이 없습니다." });
      }
    }
  );
});

router.post("/api/get/allComments", (req, res) => {
  db.comments.find(
    {
      check: true,
    },
    function (err, docs) {
      res.send(docs);
    }
  );
});

router.post("/api/new/comment", (req, res) => {
  console.log("rqwewewqwe", req.body);
  let date = new Date();

  let shortDate = date.toLocaleString();
  db.comments.count({}, (err, count) => {
    if (req.body.refId > -1) {
      db.comments.insert(
        {
          no: count,
          refId: req.body.refId,
          author: req.body.author,
          contents: req.body.contents,
          creationDate: shortDate,
          editable: false,
          check: true,
        },
        (err, docs) => {
          res.send(docs);
        }
      );
    } else {
      db.comments.insert(
        {
          no: count,
          refId: -1,
          open: false,
          editable: false,
          check: true,
          id: req.body.id,
          contents: req.body.contents,
          author: req.body.author,
          password: req.body.password,
          creationDate: shortDate,
        },
        (err2, newComment) => {
          res.send(newComment);
        }
      );
    }
  });
});

/* posts Clear */
router.post("/api/reset/posts", (req, res) => {
  db.posts.remove({}, { multi: true }, function (err, numRemoved) {
    res.send({ msg: numRemoved + " Items Removed" });
  });
});

/* comments Clear */
router.post("/api/reset/comments", (req, res) => {
  db.comments.remove({}, { multi: true }, function (err, numRemoved) {
    res.send({ msg: numRemoved + " Items Removed" });
  });
});

router.post("/api/reset/accounts", (req, res) => {
  db.accounts.remove({}, { multi: true }, function (err, numRemoved) {
    res.send({ msg: numRemoved + " Items Removed" });
  });
});

router.post("/api/new/post", (req, res) => {
  let date = new Date();

  let shortDate = date.toLocaleString();
  console.log("xxxxxxxxxxxxxx", req.body);

  db.posts.count({}, (err, count) => {
    db.posts.insert(
      {
        id: count + 1,
        view: req.body.view,
        check: true,
        title: req.body.title,
        contents: req.body.contents,
        author: req.body.author,
        password: req.body.password,
        creationDate: shortDate,
        loginId: req.body.loginId,
        path: req.body.path,
      },
      (err2, newPost) => {
        res.send(newPost);
      }
    );
  });
});

/* create Comments */

router.post("/api/get/post", (req, res) => {
  //console.log("req",req.body)
  db.posts.find({ id: req.body.id }, function (err, docs) {
    res.send(docs);
    console.log("res", res.body);
    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });
});

router.post("/api/get/comment", (req, res) => {
  console.log("req", req.body.id);
  db.comments.find(
    {
      id: req.body.id,
      check: true,
    },
    function (err, docs) {
      res.send(docs);
      // console.log("res", res);
    }
  );
});

router.post("/api/remove/post", (req, res) => {
  db.posts.remove(
    {
      id: req.body.id,
    },
    {},
    (err, Removed) => {
      res.send({ msg: "제거되었습니다." });
    }
  );
});

router.post("/api/update/comment", (req, res) => {
  db.comments.update(
    { no: req.body.no },
    { $set: { check: false } },

    function (err, updated) {
      res.send({ msg: "업데이트 되었습니다." });

      console.log("업데이트되었습니다.");
    }
  );
});

router.post("/api/update/post", (req, res) => {
  console.log("reqreqreq", req.body);
  db.posts.update(
    { id: req.body.id },
    { $set: { check: false } },

    function (err, updated) {
      res.send({ msg: "업데이트 되었습니다." });

      console.log("업데이트되었습니다.");
    }
  );
});

router.post("/api/new/accounts", (req, res) => {
  console.log("reqreq", req.body);
  db.accounts.insert(
    {
      author: req.body.author,
      loginId: req.body.loginId,
      password: req.body.password,

      resNo: req.body.resNo,
      phoneNo: req.body.phoneNo,
      image: req.body.image,
    },
    (err2, newComment) => {
      res.send(newComment);
    }
  );
});

router.post("/api/find/accounts", (req, res) => {
  console.log("reqreqreq", req.body.loginId);
  db.accounts.find({ loginId: req.body.loginId }, function (err, docs) {
    console.log("resresres", docs);

    if (docs.length > 0) {
      res.send({ msg: "아이디가 있다" });
    } else {
      res.send({ msg: "없다" });
    }

    // docs is an array containing documents Mars, Earth, Jupiter
    // If no document is found, docs is equal to []
  });
});

router.post("/api/get/loginInfo", (req, res) => {
  db.accounts.find(
    { $and: [{ loginId: req.body.loginId }, { password: req.body.password }] },
    function (err, docs) {
      // docs contains Earth and Mars
      if (docs.length > 0) {
        console.log("docdoc", docs);
        res.send(docs);
      } else {
        res.send({ msg: "2" });
      }
    }
  );
});

router.post("/api/update/editpost", (req, res) => {
  let date = new Date();

  let shortDate = date.toLocaleString();
  db.posts.update(
    { id: req.body.id },
    {
      $set: {
        title: req.body.title,
        contents: req.body.contents,
        creationDate: shortDate,
      },
    },

    function (err, updated) {
      res.send({ msg: "업데이트 되었습니다." });

      console.log("업데이트되었습니다.");
    }
  );
});

router.post("/api/find/comments", (req, res) => {
  db.comments.update(
    {
      no: req.body.no,
    },
    {
      $set: { editable: true },
    },
    function (err, docs) {
      res.send({ msg: "성공" });
    }
  );
});

router.post("/api/update/editcomment", (req, res) => {
  db.comments.update(
    {
      no: req.body.no,
    },
    {
      $set: { contents: req.body.contents, editable: false },
    },

    function (err, docs) {
      res.send({ msg: "성공" });
    }
  );
});

router.post("/api/update/count", (req, res) => {
  console.log("reqrqe", req.body);
  db.posts.update(
    {
      id: req.body.id,
      view: req.body.view,
    },
    {
      $set: { view: req.body.view + 1 },
    },
    {},

    function (err, docs) {
      console.log({ docs });
      res.send({ docs });
    }
  );
});

router.post("/api/update/open", (req, res) => {
  db.comments.update(
    {
      id: req.body.id,
      no: req.body.no,
    },
    {
      $set: { open: true },
    },
    function (err, docs) {
      res.send({ msg: "성공하였습니다." });
    }
  );
});

router.post("/api/new/comment1", (req, res) => {
  db.comments.insert(
    {
      id: req.body.id,
      no: req.body.no,
      author: req.body.author,
      contents: req.body.contents,
      level: 1,
    },
    function (err, docs) {
      res.send(docs);
    }
  );
});

router.post("/api/get/comment1", (req, res) => {
  db.comments.find(
    {
      id: req.body.id,
      no: req.body.no,
      level: 1,
    },
    function (err, docs) {
      res.send(docs);
    }
  );
});

router.post("/api/get/allcomment1", (req, res) => {
  db.comments.find(
    {
      level: 1,
    },
    function (err, docs) {
      res.send(docs);
    }
  );
});

router.post("/api/update/phoneNo", (req, res) => {
  db.accounts.update(
    {
      loginId: req.body.loginId,
    },
    { $set: { phoneNo: req.body.phoneNo } },
    function (err, docs) {
      res.send({ msg: "변경완료되었습니다." });
    }
  );
});

router.post("/api/find/accountId", (req, res) => {
  db.accounts.find({ loginId: req.body.loginId }, function (err1, docs1) {
    if (docs1.length != 0) {
      res.send({ msg: "같은 아이디가 있습니다." });
    } else {
      db.accounts.insert(
        {
          author: req.body.author,
          loginId: req.body.loginId,
          password: req.body.password,

          resNo: req.body.resNo,
          phoneNo: req.body.phoneNo,
          path: "",
        },
        function (err2, docs2) {
          res.send([]);
        }
      );
    }
  });
});

router.post("/api/files/images", upload.single("image"), (req, res, next) => {
  const path = req.file.path.slice(47);
  db.posts.update(
    { loginId: req.body.loginId },
    { $set: { path: path } },
    {},
    function (err, docs) {}
  );
  db.accounts.update(
    { loginId: req.body.loginId },
    { $set: { path: path } },
    {},
    function (err, docs) {}
  );
  console.log("rwqewqeqe", req.file.path);
  res.send({ msg: path });
});

router.post("/api/add/refId", (req, res) => {
  db.comments.insert();
});

router.post("/api/remove/comment", (req, res) => {
  db.comments.remove(
    { no: req.body.no },
    { multi: true },
    function (err, numRemoved) {
      res.send({ msg: numRemoved + " Items Removed" });
    }
  );
});
module.exports = router;
