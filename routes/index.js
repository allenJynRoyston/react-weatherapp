//---------------------------------------------- default
exports.home = function(req, res){

	res.render('index', {
		title: 'Weather App',
		enviroment: req.device.enviroment,
		isMobile: 	req.device.isMobile,
		isIphone: 	req.device.isIphone,
		isIpad: 		req.device.isIpad,
		isAndroid: 	req.device.isAndroid,
		userAgent: 	req.device.ua
	});

};
//----------------------------------------------
