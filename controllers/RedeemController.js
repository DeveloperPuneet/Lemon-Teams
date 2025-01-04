const accounts = require("../models/accounts");
const redeemCode = require("../models/ReedemCode");
const randomstring = require("randomstring");

const CurrentDate = () => {
    try {
        return Date.now();
    } catch (error) {
        console.log(error.message);
    }
}

const LoadRedeemCodeGenerator = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        if (user.admin == true) {
            return res.render("AdminRedeemCodeGenerator", { user, profile });
        } else {
            return res.redirect("/reedem-code");
        }
    } catch (error) {
        console.log(error.message);
    }
}

const PublishingRedeemCode = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        let message;
        if (user.admin == true) {
            const { code, amount } = await req.body;
            const expire = await CurrentDate() + 2592000000;
            const newCode = await redeemCode({
                code: code,
                amount: amount,
                expire: expire
            });
            const result = await newCode.save();
            if (result) {
                message = "Redeem Code saved successfully 🤗"
            } else {
                message = "Failed to save Redeem Code ��"
            }
            return res.render("AdminRedeemCodeGenerator", { user, profile, message });
        } else {
            return res.redirect("/reedem-code");
        }
    } catch (error) {
        let message = "This Code is already in use. Please try again later. 😓";
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        return res.render("AdminRedeemCodeGenerator", { user, profile, message });
    }
}

setInterval(async () => {
    await redeemCode.deleteMany({
        expire: { $lt: CurrentDate() }
    });
}, 7200000);

const RedeemCode = async (req, res) => {
    try {
        const code = await randomstring.generate(20);
        return code
    } catch (error) {
        console.log(error);
    }
}

const autoRedeemCodeGenerator = async (req, res) => {
    try {
        const expire = await CurrentDate() + 2592000000;
        const code = await RedeemCode();
        const amount = await req.body.amount;
        const newCode = await redeemCode({
            code: code,
            amount: amount,
            expire: expire
        });
        const result = await newCode.save();
        if (result) {
            return res.redirect(`/redeem-code-winner-game?code=${code}`);
        }
    } catch (error) {
        console.log(error);
    }
}

const redeemCodeWinner = async (req, res) => {
    try {
        const user = await accounts.findOne({ identity: req.session.identity });
        const profile = "/accounts/" + user.profile;
        const code = await req.query.code;
        return res.render("redeemCodeWinner", { code, user, profile });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    LoadRedeemCodeGenerator,
    PublishingRedeemCode,
    autoRedeemCodeGenerator,
    redeemCodeWinner
}