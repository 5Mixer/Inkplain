let checkAuthentication = (req, res, next) => {
	if (req.session && req.session.userId) {
		return next()
	} else {
		return res.json({
			success: false,
			message: 'Not authenticated.'
		});
	}
};

module.exports = {
	checkAuthentication: checkAuthentication
}
