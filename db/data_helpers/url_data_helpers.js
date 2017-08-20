'use strict'

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeURLDataHelpers(knex) {
  return {

    getURL: function(id, callback) {
      knex
        .select(
          'URLs.id',
          'URLs.URL',
          'URLs.cat_id',
          'URLs.Title',
          'URLs.overallRating',
          'URLs.user_id',
          'URLs.Desc',
          'categories.name as categoryname')
        .from('URLs')
        .innerJoin('categories', 'URLs.cat_id', 'categories.id')
        .where('URLs.id', '=', id)
        .then((urls) => {
          return callback(null, urls)
        })
        .catch((err) => {
          return callback(err)
        })
    },

    // GET ALL THE URLS
    getURLs: function(callback) {
      knex
        .select("*")
        .from("URLs")
        .then((urls) => {
          // foreach
          return callback(null, urls)
        })
        .catch((err) => {
          return callback(err)
        })
    },


    // ADD A NEW URL
    saveURL: function(url, callback) {
      knex("URLs")
      .returning('id')
      .insert(url)
      .then((id) => {
        return callback(null, id)
      })
      .catch((err) => {
        return callback(err)
      })
    },


    // GET ALL COMMENTS FOR ONE URL
    getComments: function(id , callback) {
      knex
        .select("*")
        .from('comments')
        .innerJoin('users', 'comments.user_id', 'users.id')
        .where('url_id', '=', id)
        .then((comments) => {
          return callback(null, comments)
        })
        .catch((err) => {
          return callback(err)
        })
    },

    // SAVE A NEW USER
    saveComment: function(comment, callback) {
      knex('comments')
      .insert(comment)
      .returning('id')
      .then((id) => {
        return callback(null, id)
      })
      .catch((err) => {
        return callback(err)
      })
    },


    // GET LIKE COUNT
    countLikes: function(url_id, callback) {
      knex('likes')
        .count('user_id as num')
        .where('url_id', '=', url_id)
      .then((result) =>{
        callback(null,result[0].num)
        })
      .catch((err) => {
        return callback(err)
      })
    },


    // UPDATE (ADD/REMOVE) LIKES
    updateLikes: function(like, callback) {
      knex('likes')
      .select('*')
      .where(like)
      .then((result) => {
        if (result.length === 0) {
          return knex('likes')
          .insert(like)
        }
        else {
          return knex('likes')
          .where(like)
          .del()
        }
      })
      .then(() => {
        knex('likes')
          .count('user_id as num')
          .where('url_id', '=', like.url_id)
        .then((result) =>{
          callback(null,result[0].num)
          })
      })
      .catch((err) => {
        return callback(err)
      })
    },


    // A new comment is saved in comments -> Update the overall rating in URLs table
    updateOverallRating: function (urlid, callback) {
      knex('comments')
        .avg('rating as avg')
        .where('url_id', '=', urlid)
        .then((result) => {
          return knex('URLs')
            .where('id', '=', urlid)
            .update({
              overallRating  : Math.round(result[0].avg)
            })
        })
        .then(() => {
          callback(null)
        })
        .catch((err) => {
          callback(err)
        })
    },


    // SEARCH A QUERY
    search: function(text, callback) {
      knex
      .select('*')
      .from('URLs')
      .where('URL', 'like', `%${text}%`)
      .then((urls) => {
        return callback(null, urls)
      })
      .catch((err) => {
        return callback(err)
      })
      // knex.raw
      // ('select * from URLs where URL = ?', [text])
      //   .then((url) => {
      //     return callback(null, url)
      //   })
      //   .catch((err) => {
      //     return callback(err)
      //   })
    }



  }
}
