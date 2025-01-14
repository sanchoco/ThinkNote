const express = require('express');
const router = express.Router();
const passport = require('../auth/passport');
const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
	res.send(
		`<a href='http://lkj99/auth/naver'>네이버 로그인</a> <a href='http://lkj99/auth/google'>구글 로그인</a> <a href='http://lkj99/auth/kakao'> 카카오 로그인 </a>`
	);
});

router.use('/user', require('./authUser'));

// 네이버 로그인
router.get('/naver', passport.authenticate('naver', null));

// 카카오 로그인
router.get('/kakao', passport.authenticate('kakao', null));

// 구글 로그인
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

const makeToken = (userId) => {
	const payload = {
		userId,
		exp: parseInt(Date.now() / 1000) + 60 * 60 * 24 * 30, // 만료기간 30일
		iat: parseInt(Date.now() / 1000)
	};
	const token = jwt.sign(payload, process.env.LOVE_JWT_SECRET);
	return token;
};

// 네이버 콜백
// http://thinknote.shop.s3-website.ap-northeast-2.amazonaws.com/
router.get(
	'/naver/oauth',
	passport.authenticate('naver', { failureRedirect: '/auth' }),
	(req, res) => {
		res.redirect(`https://thinknote.online/auth/${makeToken(req.user._id)}`);
	}
);

// 카카오 콜백
router.get(
	'/kakao/oauth',
	passport.authenticate('kakao', { failureRedirect: '/auth' }),
	(req, res) => {
		res.redirect(`https://thinknote.online/auth/${makeToken(req.user._id)}`);
	}
);

// 구글 콜백
router.get(
	'/google/oauth',
	passport.authenticate('google', { failureRedirect: '/auth' }),
	(req, res) => {
		res.redirect(`https://thinknote.online/auth/${makeToken(req.user._id)}`);
	}
);

module.exports = router;
