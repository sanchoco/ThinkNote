const jwt = require('jsonwebtoken');
const { User } = require('../models')
require('dotenv').config();

module.exports = (req, res, next) => {
	try {
		const { authorization } = req.headers;
		const [tokenType, tokenValue] = authorization.split(' ');
		console.log(authorization)
		console.log(tokenType)
		console.log(tokenValue)
		if (tokenType !== 'Bearer') {
			res.json({
				msg: 'TypeIncorrect'
			});
			return;
		}
		console.log(tokenValue)
		const { userId } = jwt.verify(tokenValue, process.env.LOVE_JWT_SECRET);
		User.findById(userId)
			.exec()
			.then((user) => {
				res.locals.user = user;
				next();
			});
	} catch (error) {
		res.json({
			msg: 'not_login'
		});
		return;
	}
};