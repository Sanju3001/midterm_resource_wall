$( document ).ready(function(){

  $('#search-form').on('submit',function (event) {

    event.preventDefault()

    let searchInput = $(this).serializeArray()[0].value

    if (validateSearch(searchInput)){

      $.ajax({
        url: '/urls/search/'+ searchInput,
        method: 'GET',
      })
      .then(function (results) {

        window.history.pushState('results','results',`/urls/search/${searchInput}`)

        let urls = results.urls
        if (urls.length !== 0) {
          $('main').html('')
          for (let i = 0; i < urls.length; i++){
            $('main')
            .prepend($('<div>').attr('id','search-results').addClass('row')
              .append($('<a>').attr('href', urls[i].URL)
                .append($('<h5>').text(urls[i].Title))
                )
              .append($('<p>').text(urls[i].Desc))
                )
          }
        }
        else {
          window.history.pushState('results','results',`/urls`)
          $('main').html('')
          .prepend($('<div>').attr('id','search-results')
              .append($('<p>').text('There are no matching results.'))
              .append($('<p>').text('To see a list of all resources click ')
                .append($('<a>').text('here.').attr('href','/urls')
                  )
                )
            )
        }

      })

    }

  })


})
