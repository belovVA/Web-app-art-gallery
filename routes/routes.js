const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const userController = require('../controllers/userController');
const artController = require('../controllers/artController');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage: storage });

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:userId', userController.getProfile);
router.put('/profile/:userId', userController.updateProfile);
router.delete('/profile/:userId', userController.deleteProfile);
router.post('/usersNew', userController.userNewCreate);
router.get('/users', userController.usersList);
router.get('/usersByRole',userController.sortedUserByRole);

// Announcement routes
router.post('/createArt', artController.createArt);
router.get('/adDetail', artController.getAdDetail);
router.put('/updateAd', artController.updateAd);
router.delete('/deleteAd', artController.deleteAd);
router.get('/user-ads', artController.getUserAds);
router.get('/ads', artController.getAds);
router.post('/updateAdStatus', artController.updateAdStatus);
router.get('/adsModeration', artController.getAdsModeration);

// Photo upload route
router.post('/uploadPhoto', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Не удалось загрузить файл');
  }
  
  const photoUrl = req.file.filename; 
  res.json({ photoUrl });
});

router.use(express.static(path.join(__dirname, '../client/')));

// Routes for serving HTML files
const setRoute = (routePath, filePath) => {
  router.get(routePath, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', filePath));
  });
};
setRoute('/artDetail', 'ArtDetail/artDetail.html');
setRoute('createUser', 'admin/createUser/createUser.html');
setRoute('/manageAccounts', 'admin/manageAccounts/manageAccounts.html');
setRoute('/createArt', 'Advert/createArt.html');
setRoute('/editAd', 'EditAd/editAd.html');
setRoute('/login', 'LoginOrRegistration/logReg.html');
setRoute('/moderator/checkAds', 'moderator/checkAds.html');
setRoute('/moderationAds', 'moderator/moderationAds.html');
setRoute('/myArts', 'MyArts/myArts.html');
setRoute('/myProfile', 'profDate/profDate.html');
setRoute('/main', 'main/main.html', 'main/main.css', 'main/main.js');
module.exports = router;
