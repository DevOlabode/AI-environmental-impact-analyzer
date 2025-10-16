module.exports.about = (req, res)=>{
    res.render('footerLinks/about');
}

module.exports.helpCenter = (req, res)=>{
    res.render('footerLinks/helpCenter');
}

module.exports.contactUs = (req, res)=>{
    res.render('footerLinks/contactUs');
}

module.exports.privacyPolicy = (req, res)=>{
    res.render('footerLinks/privacyPolicy');
}

module.exports.termsOfService = (req, res)=>{
    res.render('footerLinks/termsOfService');
}
