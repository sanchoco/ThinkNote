const express = require('express');
const router = express.Router();
const multer = require('../lib/multer');
const {
	User,
	AnswerCard,
	Like,
	CommentBoard,
	Friend,
	QuestionDaily,
	Alarm,
	Search
} = require('../models');
const authMiddleware = require('../auth/authMiddleware');
const sanitize = require('../lib/sanitizeHtml');
const s3 = require('../lib/s3.js');
require('dotenv').config();

// s3에서 이미지 삭제
const deleteImg = (fileName) => {
	fileName = fileName.split('.com/profileImg/')[1];
	s3.deleteObject(
		{
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName
		},
		// eslint-disable-next-line no-unused-vars
		(err, data) => {
			if (err) console.log('s3에 지울 이미지 없음');
		}
	);
};

// 프로필 변경
router.patch('/profile', authMiddleware, multer.single('profileImg'), async (req, res) => {
	try {
		const user = res.locals.user;
		const data = req.body;
		// 사용 불가능한 닉네임
		if (data.nickname != user.nickname && (await User.findOne({ nickname: data.nickname })))
			return res.status(400).json({ msg: 'unavailable_nickname' });
		if (user.first == true && (await User.findOne({ nickname: data.nickname }))) {
			return res.status(400).json({ msg: 'unavailable_nickname' });
		}
		if (2 > data.nickname.length || 12 < data.nickname.length)
			return res.status(400).json({ msg: 'please check nickname length' });

		if (data.introduce.length >= 50) {
			return res.status(400).json({ msg: 'please check introduce length' });
		}

		// 프로필 이미지가 들어온 경우
		if (data.defaultImg == 'true') {
			deleteImg(user.profileImg);
			user.profileImg =
				'https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg';
		} else if (req.file && req.file.transforms && req.file.transforms.length > 0) {
			deleteImg(user.profileImg);
			user.profileImg = req.file.transforms[0].location;
		}
		user.nickname = sanitize(data.nickname);
		user.introduce = sanitize(data.introduce);
		user.preferredTopic = JSON.parse(data.topic);
		user.first = false;

		await user.save();
		res.json({
			id: user._id,
			nickname: user.nickname,
			introduce: user.introduce,
			profileImg: user.profileImg,
			topic: user.preferredTopic,
			first: false
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ msg: 'fail' });
	}
});

// 회원 탈퇴
router.delete('/profile/quit', authMiddleware, async (req, res) => {
	try {
		const number = String(Math.floor(Math.random() * 100000));
		const user = res.locals.user;
		user.profileImg =
			'https://blog.kakaocdn.net/dn/cyOIpg/btqx7JTDRTq/1fs7MnKMK7nSbrM9QTIbE1/img.jpg';
		user.nickname = '알 수 없는 유저';
		user.provider = '탈퇴';
		user.introduce = '';
		const currentSocialId = user.socialId;
		user.socialId = `${currentSocialId}` + `-${number}`;
		await user.save();

		//누군가 팔로잉 그 부분도 다 삭제
		// eslint-disable-next-line no-undef
		await Promise.all([
			AnswerCard.deleteMany({ userId: user.userId }),
			CommentBoard.deleteMany({ userId: user.userId }),
			Like.deleteMany({ userId: user.userId }),
			QuestionDaily.deleteMany({ userId: user.userId }),
			Friend.deleteMany({ followingId: user.userId }),
			Friend.deleteMany({ followerId: user.userId }),
			Alarm.deleteMany({ userId: user.userId }),
			Search.deleteMany({ userId: user.userId })
		]);

		return res.json({ msg: '탈퇴 완료' });
	} catch (err) {
		console.log(err);
		res.status(400).json({ msg: 'fail' });
	}
});

module.exports = router;
