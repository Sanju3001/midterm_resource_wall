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
        data: {q: url.URL, key: '5999f0099c5101ef3fd934ccdc49332e769d5fe78898c'},
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



// Create a URL element (to be added to the DOM by renderURLS)
function createURLElement(url) {



  let $url = $('<div>').addClass('col-lg-3')
                .append($('<p>').text(url.Title))


  return $url
}




















