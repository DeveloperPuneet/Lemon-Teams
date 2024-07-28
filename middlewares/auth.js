const isLogin = async (req, res, next) => {
    try {
        if (req.session.identity) {

        } else {
            res.redirect('/login');
        }
        next();
    } catch (error) {
        res.render(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.identity) {
            res.redirect('/dashboard');
        }
        next();
    } catch (error) {
        res.render(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}