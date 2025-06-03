const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require('../middlewares/Auth');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: 'https://zeno-crm.onrender.com/dashboard',
  failureRedirect: '/'
}));

router.post('/login',
  passport.authenticate("local", {
  successRedirect: 'https://zeno-crm.onrender.com/dashboard',
  failureRedirect: '/'
})
)
router.get('/logout',isAuthenticated, (req, res) => {
  req.logout(() => res.redirect('/'));
});

router.get("/status", (req, res) => {
 console.log("in auth status ",req.user)
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true, user: req.user });
  }
  res.status(401).json({ isAuthenticated: false });
});


module.exports = router;
