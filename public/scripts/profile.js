// This file includes all the javascript code for the profile.ejs

$(document).ready(function() {

  // Load all URLs first
  loadURLs()

  // Make an ajax call to the server to save the new URL
  $('#newForm').on('submit', function(event) {

    event.preventDefault()

    let URL = $(this).serializeArray()[0].value
    const http  = new RegExp("http://")
    const https = new RegExp("https://")
    if (!(URL.match(http)) && !(URL.match(https))) {
      URL = `http://${URL}`
    }

    let newURL = {
      URL           : URL,
      Title         : $(this).serializeArray()[1].value,
      cat_id        : $(this).serializeArray()[2].value,
      Desc          : $(this).serializeArray()[3].value,
      overallRating : 0
    }

    $.ajax({
      method: 'POST',
      url   : '/urls',
      data  : {'newURL': newURL}
    }).then(function(err) {
      if(err) {
        // Deal with this later
      }
      else {
        loadURLs()
      }
    })
    $(this).trigger('reset')
  })


  // Make an ajax call to the server when user edits their profile
  $('#editinfo').on('submit', function(event) {
    event.preventDefault()

    let id    = $('#editinfo').attr('userid')
    let url   = `/users/${id}`
    let name  = $(this).serializeArray()[0].value
    let email = $(this).serializeArray()[1].value

    $.ajax({
      method: 'PUT',
      url   : url,
      data: {id: id, name: name, email: email}
    })
    .then(function(err) {
      $(location).attr('href', url)
    })
  })



  //Initially form wil be hidden.
  $('#newForm, #editinfo').hide();

  $('#plus').click(function() {
    $('#newForm').toggle();//Form toggles on button clic
     $('#editinfo').hide();
    //Initially form wil be hidden.
  })

  $('#editprofile').click(function() {
    $('#editinfo').toggle();//Form toggles on button click
      $('#newForm').hide();
  })

})


function loadURLs () {
  let id  = $('#urls-container').attr('userid')
  let url = `/users/${id}/urls`

  $('#urls-container').html('')
  $('#urls-container').append($('<div>').addClass('row').addClass('justify-content-center'))

    $.ajax({
      method: 'GET',
      url: url,
    }).then(function(response) {
      renderURLS(response)
    })

  }



// Renders all the URLs in the database and adds them to the DOM (one by one)

function renderURLS(jSonResponse) {


  let urlsContainer = $('#urls-container div')
  //let dataURL = `/users/${id}/urls`

    // changing ajax request to use linkpreview
    jSonResponse.forEach(function(url) {
      let urlElement = createURLElement(url)
      urlsContainer.append(urlElement)
    });

    jSonResponse.forEach(function(url, index) {

      $.ajax({

        url: "http://api.linkpreview.net",
        dataType: 'jsonp',
        data: {q: url.URL, key: '5997560f6be6493a7f79074954ae858b60ed5be482161'},
        success: function (response) {
          //console.log(response);
          // console.log(response)
          $($('.row .col-lg-3')[index])
              .append($('<p>').text(response.url).addClass('url-rendered'))
              .append($(`<img src="${response.image}">`).addClass('image-rendered'))
              .append($('<p>').text(response.description).addClass('description-rendered'))
        }
      });

    });


}

// function renderURLS(urls) {
//   let urlsContainer = $('#urls-container div')

//   urls.forEach(function(url) {
//     let urlElement = createURLElement(url)
//     urlsContainer.prepend(urlElement)
//   })

// }

// Create a URL element (to be added to the DOM by renderURLS)
function createURLElement(url) {
  // let $ratingStars = $('<div>').addClass('rating')
  // for (let i = 0; i < url.overallRating; i++) {
  //   $ratingStars.append($('<span>').html('<i class="fa fa-star" aria-hidden="true"></i>'))
  // }
  // for (let i = 0; i < 5 - url.overallRating; i++) {
  //   $ratingStars.append($('<span>').html('<i class="fa fa-star-o" aria-hidden="true"></i>'))
  // }

  // let $url = $('<div>').addClass('col-lg-3')
  //               .append($('<header>').addClass('head')
  //                 .append($('<h5>')
  //                   .append($('<a>').attr('id','theTitle').attr('href',`/urls/${url.id}`).text(url.Title))
  //                   )
  //                 )
  //               .append($('<main>').addClass('textbox')
  //                   .append($('<p>').text(url.Desc))
  //                   )
  //               .append($('<footer>')
  //                   .append($ratingStars))

  // let $url = $('<a>').attr('href',`/urls/${url.id}`)
  //     .append($('<div>').addClass('col-lg-3')
  //       .append($('<header>').addClass('head')
  //         .append($('<h5>')
  //           .append($('<a>').attr('class','theTitle').text(url.Title))
  //           )
  //         )
  //       .append($('<main>').addClass('textbox')
  //           .append($('<p>').text(url.Desc))
  //           )
  //       .append($('<footer>')
  //           .append($ratingStars))
  //         )


  let $url = $('<div>').addClass('col-lg-3')
                .append($('<p>').text(url.Title))
                //.append($('<p>').text(url.Description))
                //.append($('<img>').attr('src', `${url.image}`))

  return $url
}




















