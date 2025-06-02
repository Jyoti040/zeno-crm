const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Customer = require("../../models/Customer")

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URI,
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            // This callback is executed after Google authenticates the user.
            // 'profile' contains user information (id, displayName, emails, photos).
            try {
                let user = await Customer.findOne({ googleId: profile.id });

                if (user) {
                    // User exists, log them in
                    done(null, user);
                } else {
                    // New user, create an account
                    user = new Customer({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value, // Get primary email
                    });
                    await user.save();
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }
    )
);

// Serialize user into the session (what to store in the session cookie)
passport.serializeUser((user, done) => {
    done(null, user.id); // Store only the user ID in the session
});

// Deserialize user from the session (retrieve user object from ID in session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Customer.findById(id);
        done(null, user); // Attach the full user object to req.user
    } catch (err) {
        console.error(err);
        done(err, null);
    }
});