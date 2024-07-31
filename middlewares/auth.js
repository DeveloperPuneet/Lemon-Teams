const isLogin = async (req, res, next) => {
    try {
        if (req.session.identity) {

        } else {
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        return res.render(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.identity) {
            return res.redirect('/dashboard');
        }
        next();
    } catch (error) {
        return res.render(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}