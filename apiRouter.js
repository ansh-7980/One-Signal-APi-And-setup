/**
 * This file contains server side endpoints that can be used to perform backend
 * tasks that can not be handled in the browser.
 *
 * The endpoints should not clash with the application routes. Therefore, the
 * endpoints are prefixed in the main server where this file is used.
 */

const express = require('express');
const bodyParser = require('body-parser');
const { deserialize } = require('./api-util/sdk');

const initiateLoginAs = require('./api/initiate-login-as');
const loginAs = require('./api/login-as');
const transactionLineItems = require('./api/transaction-line-items');
const initiatePrivileged = require('./api/initiate-privileged');
const transitionPrivileged = require('./api/transition-privileged');
const createUserWithIdp = require('./api/auth/createUserWithIdp');

const { authenticateFacebook, authenticateFacebookCallback } = require('./api/auth/facebook');
const { authenticateGoogle, authenticateGoogleCallback } = require('./api/auth/google');
const { fetchUsers } = require('./api/fetch-user-type');
const { getPurchaseCredits } = require('./api/strapi-api-collections/purchaseCredits');
const { createUserWallet, getVendorCredits, spentVendorCredits, updateUserWalletByReferral, updateSenderWalletByReferral } = require('./api/strapi-api-collections/userWallet');
const loadCurrentUser = require('./api-util/loadCurrentUser');
const { getPrice, createSubscription, getSubscriptions, getSubscriptionStatus, cancelStripeSubscription } = require('./api/stripe-subscription');
const { getDistance } = require('./api/getDistanceInMile');
const { updateReview } = require('./api/updateUserReview');
const { fetchUsersListings } = require('./api/fetchCustomerListing');
const { contactUsSendGrid } = require('./api/sendGrid/contactUsSendGrid');
const { fetchVendors } = require('./api/fetchVendor');
const { updateListingAfterView } = require('./api/updateAfterCustomerView');
const { sendOtp, verifyOtp } = require('./api/sendOtp');
const { phoneNumberExists } = require('./api/alreadyusedPhoneNumber');
const { getStrapiSubHeroVideos, getStrapiHeroVidoes, getStrapiSubHeroContent } = require('./api/strapi-api-collections/strapiVedio');
const { getStrapiImages } = require('./api/strapi-api-collections/strapiImages');
const { referalCodeExists } = require('./api/checkValidreferal');
const {sendNotificationViaTemplate} = require('./api/sendNotificationViaTemplate');

const router = express.Router();

// ================ API router middleware: ================ //

// Parse Transit body first to a string
router.use(
  bodyParser.text({
    type: 'application/transit+json',
  })
);

// Deserialize Transit body string to JS data
router.use((req, res, next) => {
    if (req.get('Content-Type') === 'application/transit+json' && typeof req.body === 'string') {
    try {
      req.body = deserialize(req.body);
    } catch (e) {
      console.error('Failed to parse request body as Transit:');
      console.error(e);
      res.status(400).send('Invalid Transit in request body.');
      return;
    }
  }
  next();
});

// ================ API router endpoints: ================ //

router.get('/initiate-login-as', initiateLoginAs);
router.get('/login-as', loginAs);
router.post('/transaction-line-items', transactionLineItems);
router.post('/initiate-privileged', initiatePrivileged);
router.post('/transition-privileged', transitionPrivileged);

// Create user with identity provider (e.g. Facebook or Google)
// This endpoint is called to create a new user after user has confirmed
// they want to continue with the data fetched from IdP (e.g. name and email)
router.post('/auth/create-user-with-idp', createUserWithIdp);
router.post('/fetch-users', fetchUsers);
router.post('/fetchvendors', fetchVendors);
router.post('/getPurchaseCredits', getPurchaseCredits);
router.post('/createUserWallet', createUserWallet);
router.post('/updateUserWalletByReferral', updateUserWalletByReferral);
router.post('/updateSenderWalletByReferral', updateSenderWalletByReferral);
router.post('/getVendorCredits', getVendorCredits);
router.post('/spentVendorCredits', spentVendorCredits);
router.post('/fetchUsersListings', fetchUsersListings);
router.post('/fetchUsersListings', fetchUsersListings);
router.post('/getStrapiSubHeroVideos', getStrapiSubHeroVideos);
router.post('/getStrapiHeroVidoes', getStrapiHeroVidoes);
router.post('/getStrapiSubHeroContent', getStrapiSubHeroContent);
router.post('/getStrapiImages', getStrapiImages);


// get Distance
router.post('/getDistance',getDistance)
router.post('/updateReview',updateReview)
router.post('/updateListingAfterView',updateListingAfterView)

// subscriptionn
router.post('/stripe-getPrice', getPrice);
router.post('/stripe-create-subscription',createSubscription);
router.post('/stripe-get-user-subscriptions',getSubscriptions);
router.post('/stripe-get-user-subscriptions-status',getSubscriptionStatus);
router.post('/cancel-stripe-subscription',cancelStripeSubscription);
router.post('/contact-us-message', contactUsSendGrid);

//twillio apis for sending OTPS
router.post("/sendOtp",sendOtp)
router.post("/verifyOtp",verifyOtp)
router.post("/phoneNumberExists",phoneNumberExists)
router.post("/referalCodeExists",referalCodeExists)

// oneSignal notifications api
router.post('/onesignal/send-notification-via-template', sendNotificationViaTemplate);








// Facebook authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Facebook
router.get('/auth/facebook', authenticateFacebook);

// This is the route for callback URL the user is redirected after authenticating
// with Facebook. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Sharetribe Auth API to authenticate user to the marketplace
router.get('/auth/facebook/callback', authenticateFacebookCallback);

// Google authentication endpoints

// This endpoint is called when user wants to initiate authenticaiton with Google
router.get('/auth/google', authenticateGoogle);

// This is the route for callback URL the user is redirected after authenticating
// with Google. In this route a Passport.js custom callback is used for calling
// loginWithIdp endpoint in Sharetribe Auth API to authenticate user to the marketplace
router.get('/auth/google/callback', authenticateGoogleCallback);

module.exports = router;
