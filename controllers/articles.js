const Article = require('../models/article.js');
const NotFoundError = require('../erorrs/not-found-err.js');
const Forbidden = require('../erorrs/forbidden.js');

const getArticles = (req, res) => {
    Article.find({})
        .populate('user')
        .then(data => res.send(data))
}

const postArticle = (req, res, next) => {
    const {keyword, title, text, date, source, link, image} = req.body;
    const { _id } = req.user;
    Article.create({keyword, title, text, date, source, link, image, owner: {_id}})
        .then(data => res.send(data))
        .catch(next)
}

const deleteArticle = (req, res, next) => {
    const { articleId } = req.params;
    const userId = req.user._id;
    Article.findById(articleId)
        .orFail(() => {
            throw new NotFoundError('Карточка не найдена')
        })
        .then((data) => {
            if(data.owner._id.toString() === userId){
                Article.findByIdAndRemove({ _id: articleId })
                    .then(article => res.send(article))
            } else {
                throw new Forbidden('Нельзя удалить чужую карточку');
            }
        })
        .catch(err => {
            if (err.statusCode === 404) {
                next(new NotFoundError(''));
              }
              const error = new Error('Ошбика');
              next(error);
        })
}


module.exports = {
    getArticles,
    postArticle,
    deleteArticle
};