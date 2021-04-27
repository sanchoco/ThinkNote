const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware')
// 인증 ^^
router.get("/", authMiddleware, (req, res) => {
    console.log('인증 시작')
    user = res.locals.user;

    res.json({
        nickname: user.nickname,
        profileImg: user.profileImg,
        introduce: user.introduce
    })
})

module.exports = router;
