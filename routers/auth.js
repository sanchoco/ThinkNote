const express = require('express');
const router = express.Router();
const passport = require('../auth/passport');

router.get('/', (req, res) => {
	res.send(`<a href='http://localhost:3000/auth/naver'>네이버 로그인</a>`);
});



// 네이버 로그인
router.get('/naver', passport.authenticate('naver', null));

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao', null));

// 네이버 콜백
router.get('/naver/oauth', passport.authenticate('naver', { failureRedirect: '/auth', successRedirect: 'http://naver.com' }));

// 카카오 콜백
router.get('/kakao/oauth', passport.authenticate('kakao', { failureRedirect: '/auth', successRedirect: 'https://www.kakaocorp.com/' }));

module.exports = router;
