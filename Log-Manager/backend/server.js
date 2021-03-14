const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8000;
const {sequelize, User, Post } = require("./models");
const { hashPassword, comparePassword } = require("./utils/bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");
const { logger } = require("./utils/winston");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(
    cors({
        origin: true,
        credentials:true
    })
)
sequelize.sync({force: false})
.then(() => console.log("DB 접속 성공"))
.catch(err => console.log(err));

const upload = multer({
    storage: multer.diskStorage({
        // 폴더위치 지정
        destination: (req, file, done) => {
        done(null, "uploads/");
        },
        // 파일 이름 지정
        filename: (req, file, done) => {
            const ext = path.extname(file.originalname);
            const fileName = path.basename(file.originalname, ext) + "&&" + Date.now() + ext;
            done(null, fileName);
            req.fileDir = fileName;
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
})

app.get("/api/user", (req, res) => {

});


app.post("/api/user", async (req, res) => {
    try {
        // 회원가입 부분
        console.log(req.body);
        const {email, password, name} = req.body;

        if (email && password && name) {
            const hashedPassword = await hashPassword(password);
            console.log(hashedPassword);
            const data = await User.create({
                email: email,
                password: hashedPassword,
                name: name
            });
            console.log(data);
            return res.json({signup: true});
        }else {
            throw new Error();
        }
    } catch(error) {
        console.log(error);
        return res.json({signup: false});
    }
});

app.post("/api/login", async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        // 암호화된 비밀번호를 가져온다.
        const userData = await User.findOne({
            attributes: ["id", "password"],
            where:{
                email: email
            }
        });
        const hashedPassword = userData.dataValues.password;
        console.log(userData);
        // 비밀번호와 암호화된 비밀번호를 대조해야한다.
        const compareResult = await comparePassword(password, hashedPassword);
        console.log(compareResult);
        if (compareResult) {
            logger.info("로그인 되었습니다");
            return res.json({login:true, id: userData.dataValues.id});
        } else {
            logger.error("로그인에 실패하였습니다")
            throw new Error();
        }

    } catch(error) {
        console.log(error);
        return res.json({login: false});
    }
});

// 게시글 리스트
app.get("/api/post", async (req, res) => {
    try {
        const postList = await Post.findAll({});
        console.log(postList);
        return res.json({postList});
    } catch(error) {
        console.log(error);
        logger.error(error);
    }
});

app.get("/api/post/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {dataValues} = await Post.findOne({
            where: {
                id:id
            }
        });
        console.log(dataValues);
        if (dataValues.file){
            console.log(dataValues.file.split(".").reverse()[0]);
            if(dataValues.file.split(".").reverse()[0] === "txt"||"log") {
                // 파일 읽기
                const log = await fs.readFile(`${__dirname}/uploads/${dataValues.file}`);
                return res.json({post: dataValues, log:log.toString().trim()})
            }
        } else {
            throw new Error("파일이 없습니다.");
        }
        return res.json({post:dataValues});
    } catch(error) {
        logger.info.error(error);
        return res.json({post:false});
 
    }
});

// 게시글 작성
app.post("/api/post", upload.single("file"), async (req, res) => {
    try {
        console.log(req.body);
        const {title, content, userId} = req.body;
        console.log(req.fileDir);
        console.log(title, content, userId);

        if (userId && title && content) {
        const post = await Post.create({
            title:title,
            content: content,
            file: req.fileDir,
            user_id: userId,
        });
        console.log(post);
        logger.info("업로드 성공");
        return res.json({upload:true});
    } else {
        throw new Error();
    }
    } catch(err) {
        console.log(err);
        logger.error(error);
        return res.json({upload:false});
    }
});

// 아이디 중복체크
app.post("/api/check", async (req, res) => {
    try {
        console.log(req.body);
        const {email} = req.body;

        if (email) {
            const userEmail = await User.findOne({
                attributes: ["id"],
                where:{
                    email: email
                }
            });
            console.log(userEmail);
            if(userEmail) return res.json({check: false});
            else return res.json({check: true});
        }
    } catch(error) {
        console.log(error);
    }
});

app.get("/api/download", async(req, res) => {
    try {
        const {fileName} = req.query;
        const file = await fs.readFile(`${__dirname}/uploads/${fileName}`);
        return res.send(file);
    } catch(error) {
        logger.error(error);
        return res.json({download:false})
    }
});
app.listen(PORT, () => console.log(`this server listening on ${PORT}`));