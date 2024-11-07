const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 requests per windowMs
  message: { message: 'Too many login attempts, please try again after 60 seconds' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many login attempts, please try again after 60 seconds' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, firstName, lastName, phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email, 
      firstName, 
      lastName, 
      phoneNumber, 
      password: hashedPassword 
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password, totpToken } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.twoFactorEnabled) {
      if (!totpToken) {
        return res.status(400).json({ 
          message: '2FA token required',
          requires2FA: true 
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: totpToken
      });

      if (!verified) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/2fa/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const secret = speakeasy.generateSecret({
      name: `EncryBid:${user.username}`
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    user.twoFactorSecret = secret.base32;
    await user.save();

    res.json({
      qrCode: qrCodeUrl,
      secret: secret.base32
    });
  } catch (error) {
    console.error('2FA generation error:', error);
    res.status(500).json({ message: 'Error generating 2FA' });
  }
});

router.post('/2fa/verify', auth, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.userId);
    
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.json({ message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ message: 'Error verifying 2FA' });
  }
});

module.exports = router;
