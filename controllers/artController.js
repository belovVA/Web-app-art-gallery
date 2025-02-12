const Art = require('../models/artModel.js');
const User = require('../models/userModel');

const createArt = async (req, res) => {
  const { title, author, description, date, location, style,  userId, photoUrl } = req.body;

  try {
      const announcement = new Art({
          title,
          author,
          description,
          date,
          location,
          style,
          userId,
          photoUrl
      });
      await announcement.save();
      res.status(201).send('Картина успешно добавлено!');
  } catch (error) {
      console.error('Ошибка при добавлении картины:', error);
      res.status(500).send('Ошибка при добавлении картины');
  }
};

const getAdDetail = async (req, res) => {
  const adId = req.query.id;
  try {
      const ad = await Art.findById(adId);
      if (!ad) {
          return res.status(404).send('Картина не найдено');
      }

      const adDetail = {
          ...ad.toObject(),
      };

      res.json(adDetail);
  } catch (error) {
      console.error(error);
      res.status(500).send('Ошибка при получении картины');
  }
};

const updateAd = async (req, res) => {
  const { id, title, author, description, date, location, style, moderationStatus, photoUrl } = req.body;

  try {
      const updatedAd = await Art.findByIdAndUpdate(id, {
          title,
          author,
          description,
          date,
          location,
          style,
          moderationStatus,
          photoUrl
      }, { new: true });
      res.json(updatedAd);
  } catch (error) {
      console.error('Ошибка при обновлении картины:', error);
      res.status(500).send('Ошибка при обновлении картины');
  }
};

const deleteAd = async (req, res) => {
  const { id } = req.body;

  try {
      const ad = await Art.findById(id);
      if (ad) {
          await Art.findByIdAndDelete(id);
          res.status(200).send({ message: 'Картина успешно удалено' });
      } else {
          res.status(404).send({ message: 'Картина не найдено' });
      }
  } catch (error) {
      console.error('Ошибка при удалении картины:', error);
      res.status(500).send('Ошибка при удалении картины');
  }
};

const getUserAds = async (req, res) => {
  const { userId, sortByStyle, filterStatus, searchQuery } = req.query;

  let filter = { userId: userId };

  if (filterStatus !== undefined) {
      if (filterStatus === 'true' || filterStatus === 'false') {
          filter.status = filterStatus === 'true';
      }
  }

  if (searchQuery) {
      filter.$or = [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { location: { $regex: searchQuery, $options: 'i' } }
      ];
  }

  try {
      const ads = await Art.find(filter).sort(sortByStyle ? { style: 1 } : {});
      const groupedAds = ads.reduce((acc, ad) => {
          const status = ad.moderationStatus;
          if (!acc[status]) {
              acc[status] = [];
          }
          acc[status].push(ad);
          return acc;
      }, {});

      res.json(groupedAds);
  } catch (error) {
      console.error('Ошибка при получении картин:', error);
      res.status(500).send('Ошибка при получении картин');
  }
};

const getAds = async (req, res) => {
  const { sortByStyle, searchQuery } = req.query;

  // Начальное условие фильтрации
  let filter = { moderationStatus: 'Accepted' };

  // // Фильтр по статусу
  // if (filterStatus !== undefined) {
  //   if (filterStatus === 'true' || filterStatus === 'false') {
  //     // filter.status = filterStatus === 'true';
  //   }
  // }

  // Фильтр по поисковому запросу
  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      {author : { $regex: searchQuery, $options: 'i' }},
      { description: { $regex: searchQuery, $options: 'i' } },
      { location: { $regex: searchQuery, $options: 'i' } },
      { style: { $regex: searchQuery, $options: 'i' } },
      {date: { $regex: searchQuery, $options: 'i' }}

    ];
  }

  // Фильтр по стилю
  if (sortByStyle !== '') {
    filter.style = sortByStyle;
    console.log(filter)
  }

  try {
    // Получение данных с учётом фильтров
    const ads = await Art.find(filter).sort(sortByStyle ? { style: 1 } : {});
    
    // Группировка картин по статусу модерации
    const groupedAds = ads.reduce((acc, ad) => {
      const status = ad.moderationStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(ad);
      return acc;
    }, {});

    // Отправка данных клиенту
    res.json(groupedAds);
  } catch (error) {
    console.error('Ошибка при получении картин:', error);
    res.status(500).send('Ошибка при получении картин');
  }
};



const updateAdStatus = async (req, res) => {
  const { id, moderationStatus } = req.body;
  if (!id || !moderationStatus) {
      return res.status(400).send('Invalid request');
  }

  try {
      const ad = await Art.findByIdAndUpdate(id, { moderationStatus }, { new: true });
      if (!ad) {
          return res.status(404).send('Art not found');
      }
      res.json(ad);
  } catch (error) {
      console.error('Ошибка при обновлении статуса картины:', error);
      res.status(500).send('Ошибка при обновлении статуса картины');
  }
};


const getAdsModeration = async (req, res) => {
  const { moderationStatus, searchQuery } = req.query;
  
  const filter = {};
  
  if (moderationStatus) {
      filter.moderationStatus = moderationStatus;
  }

  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      {author : { $regex: searchQuery, $options: 'i' }},
      { description: { $regex: searchQuery, $options: 'i' } },
      { location: { $regex: searchQuery, $options: 'i' } },
      { style: { $regex: searchQuery, $options: 'i' } },
      {date: { $regex: searchQuery, $options: 'i' }}

    ];
  }

  try {
      const ads = await Art.find(filter);
      res.json(ads);
  } catch (error) {
      console.error('Ошибка при получении картин:', error);
      res.status(500).send('Ошибка при получении картин');
  }
};

// module.exports = {
//   getAdsModeration
// };

module.exports = {
  createArt,
  getAdDetail,
  updateAd,
  deleteAd,
  getUserAds,
  getAds,
  updateAdStatus,
  getAdsModeration
};
