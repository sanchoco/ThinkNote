const express = require('express');
const router = express.Router();
const multer = require('../lib/multer');
const { User, AnswerCard, Like, CommentBoard, Friend, QuestionDaily } = require('../models');
const authMiddleware = require('../auth/authMiddleware');
const sanitize = require('sanitize-html');
const s3 = require('../lib/s3.js');
const randomNickname = require('../lib/nickname');
require('dotenv').config();

router.patch('/profile/defaultImg', authMiddleware, (req, res) => {
	try {
		const user = res.locals.user;
		user.profileImg = 'https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg';
		user.save();
		res.json({ profileImg: user.profileImg });
	} catch {
		res.status(400).json({ msg: 'fail' });
	}
});

router.patch('/profile/profileImg', authMiddleware, multer.single('profileImg'), async (req, res) => {
	try {
		const user = res.locals.user;

		s3.deleteObject(
			{
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: user.profileImg.split('.com/images/')[1]
			},
			(err, data) => {
				if (err) console.log('s3에 지울 이미지 없음');
			}
		);
		user.profileImg = req.file.location;
		user.save();
		res.json({ profileImg: user.profileImg });
	} catch {
		res.status(400).json({ msg: 'fail' });
	}
});

router.get('/profile/random-nickname', authMiddleware, async (req, res) => {
	try {
		const user = res.locals.user;
		let nickname = await randomNickname();
		while (true) {
			// 닉네임 중복 방지
			if (await User.findOne({ nickname: nickname })) nickname = await randomNickname();
			else break;
		}
		user.nickname = nickname;
		res.json({ nickname: user.nickname });
	} catch {
		console.log('에러');
		res.status(400).json({ msg: 'fail' });
	}
});

router.patch('/profile/nickname', authMiddleware, async (req, res) => {
	try {
		const user = res.locals.user;
		const nickname = sanitize(req.body.nickname);
		if (2 > nickname.length || 12 < nickname.length) return res.status(400).json({ msg: `Please check nickname length` });
		User.findOne({ nickname }).then((result) => {
			if (result || !nickname) {
				res.status(400).json({ msg: 'fail' });
			} else {
				user.nickname = nickname;
				user.save();
				res.json({ nickname: user.nickname });
			}
		});
	} catch {
		console.log('에러');
		res.status(400).json({ msg: 'fail' });
	}
});

router.patch('/profile/introduce', authMiddleware, (req, res) => {
	try {
		const user = res.locals.user;
		user.introduce = sanitize(req.body.introduce);
		user.save();
		res.json({ introduce: user.introduce });
	} catch {
		res.status(400).json({ msg: 'fail' });
	}
});

// 회원 탈퇴
router.delete('/profile/quit', authMiddleware, async (req, res) => {
	try {

		const user = res.locals.user;
		const profileImg = "https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg"
		const nickname = "알 수 없는 유저"
		const provider = "탈퇴"
		const socialId = "탈퇴"

		await AnswerCard.delete({ userId: user.userId });
		console.log('1')
		await CommentBoard.delete({ userId: user.userId });
		console.log('2')
		await Like.delete({ userId: user.userId });
		console.log('3')
		await QuestionDaily.delete({ userId: user.userId });
		console.log('4')
		await Friend.delete({ followingId: user.userId });
		console.log('5')
		await User.updateOne({ _id: user.userId }, { $set: { profile, nickname, provider, socialId } });

	} catch (err) {
		console.log(err)
		res.status(400).json({ msg: 'fail' });
	}
})

module.exports = router;