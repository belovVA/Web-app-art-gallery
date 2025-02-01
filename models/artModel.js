const mongoose = require('mongoose');

const artSchema = new mongoose.Schema({
    title: String,
    author: [String],
    photoUrl: String, 
    description: String,
    date: String,
    location: String,
    style: {
      type:String,
      enum:['Без жанра', 'Портрет', 'Пейзаж', 'Исторический', 'Натюрморт', 'Бытовой', 'Анималистичный'],
      default: 'Без жанра'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderationStatus: {
      type: String,
      enum: ['Watching', 'Accepted', 'Canceled'],
      default: 'Watching'
    }
});

const Art = mongoose.model('Art', artSchema);

module.exports = Art;