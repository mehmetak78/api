
const express = require('express');
const {body, check} = require('express-validator');   // https://express-validator.github.io/docs/

const router = express.Router();

const feedController = require('../controllers/feed')
const {isEmail} = require("validator");

router.get('/posts', feedController.getPosts);
router.post('/post', [
  body('title', 'Custom Error Message').trim().isLength({min: 7}).isAlphanumeric(),
  body('content').trim().isLength({min: 5}),
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom( (value, {req}) => {
      if (value === 'test@test.com') {
        throw new Error('This email address is forbidden');
      }
      return true;
    }),
  body('password','Please enter a password with a min length of 5')
    .isLength({min: 5})
    .isAlphanumeric(),
  body('confirmPassword').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Passwords have to match');
    }
    return true;
  }),
  check('email')              // Async validation
    .isEmail()
    .withMessage('Please enter a valid email')
    /*.custom( (value, {req}) => {
      return User.findOne({email:value}).then(userDoc => {  // async call from database.
        if (userDoc) {
          return Promise.reject(
            'Email already exists...'
          )
        }
      })
    }*/
], feedController.createPost);

module.exports = router;
