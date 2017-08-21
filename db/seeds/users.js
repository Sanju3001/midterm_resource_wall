exports.seed = function(knex, Promise) {
  return knex('comments').del()
    .then(function () {
      return knex('likes').del()
    })
    .then(function () {
      return knex('categories').del()
    })
    .then(function () {
      return knex('URLs').del()
    })
    .then(function () {
      return knex('users').del()
    })


    // then create users
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice', email:'alice@cool.com', password:'alice', avatar:'https://vanillicon.com/8ef313b1a62a78c9066aace9a1061b39.png'}),
        knex('users').insert({id: 2, name: 'Bob', email:'bob@mail.com', password:'bob', avatar:'https://vanillicon.com/b7ef7e9117491321ffb55bee54c8deed.png'}),
        knex('users').insert({id: 3, name: 'Charlie', email:'charlie@mail.com', password:'charlie', avatar:'https://vanillicon.com/7c8db9682ee40fd2f3e5d9e71034b717.png'})
      ])
    })
    // wait for users to be inserted into the database so they will get ids
    // then create urls
    .then(function () {
      let lorem1 = 'Lorem ipsum dolor sit amet, et virtute complectitur quo. Ea sed mentitum disputationi delicatissimi, saepe quaestio ocurreret pro te. Erat meis moderatius duo an. Eius voluptatum no has. At duo libris inimicus maluisset. Enim pericula te nam, eum duis aliquid eu, te ocurreret persequeris vim.'
      let lorem2 = 'Sonet atomorum ea ius, perfecto consequuntur et mea. Ex malis accumsan eum, eum et discere cotidieque, nam fugit evertitur an. Usu possim aperiam deserunt te, an est sonet pericula. Ferri reprimique omittantur in eum, sint eius accusamus ad eos, usu augue quaestio ei. Ea ius labore everti incorrupte, quis omnes sed in, nec ex delicata recteque disputationi.'
      return Promise.all([
        knex('URLs').insert({id: 1, Desc: lorem1, URL: 'https://www.google.com', cat_id: 1, Title: 'Google', user_id: 1, overallRating: 4}),
        knex('URLs').insert({id: 2, Desc: lorem2, URL: 'http://www.bestbuy.ca/', cat_id: 5, Title: 'Bestbuy', user_id: 1, overallRating: 3}),
        knex('URLs').insert({id: 3, Desc: lorem1, URL: 'https://www.lighthouselabs.ca/', cat_id: 3, Title: 'Lighthouse', user_id: 1, overallRating: 5})
      ])
    })
    // wait for urls to be inserted into the database so they will get ids
    .then(function(){
      // then create comments
      return knex('comments').insert(
        {id: 1, content: 'this is it', user_id: 1, url_id: 1, rating: 1}
      )
    })
    .then(function(){
      // then create comments
      return knex('likes').insert(
        {user_id: 1, url_id: 1}
      )
    })
    .then(function(){
      // then create categories
      return Promise.all([
        knex('categories').insert({id: 1, name: 'Chemistry'}),
        knex('categories').insert({id: 2, name: 'Biology'}),
        knex('categories').insert({id: 3, name: 'Culinary'}),
        knex('categories').insert({id: 4, name: 'Engineering'}),
        knex('categories').insert({id: 5, name: 'Physics'})
        knex('categories').insert({id: 6, name: 'Art'})
        knex('categories').insert({id: 7, name: 'English'})
        knex('categories').insert({id: 8, name: 'Geography'})
        knex('categories').insert({id: 9, name: 'Music'})
        knex('categories').insert({id: 10, name: 'Medicine'})
        knex('categories').insert({id: 11, name: 'Web Dev'})
      ])
    })
};
