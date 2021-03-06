$(document).ready(function() {

  // Load the number of all existing likes for this specific URL
  loadLikeCount()

  // Load all existing comments first
  loadComments()

  // Load the URLs via API - function name changed to loadURLsTwice so that there is no confusion with profile.js script
  loadURLsTwice()


  // Add a new listener to new comment form and wait for new comment submission
  $('#newcomment').on('submit', function(event) {
    event.preventDefault()

    let commentText = ''
    if ($(this).serializeArray()[0]){
      commentText = $(this).serializeArray()[0].value
    }

    let rating = ''
    if ($(this).serializeArray()[1]){
      rating = $(this).serializeArray()[1].value
    }

    let urlid = $('#newcomment').attr('URLid')
    let url   = `/urls/${urlid}/comments`

    let error = validateComment(commentText, rating)
    if (error) {
      $('#newcomment .error').remove()
      $('#newcomment').append($('<div>').addClass('error').text(error))
    }
    else{
      $.ajax({
        method: 'POST',
        url   : url,
        data  : {'content': commentText, 'rating': rating}
      }).then(function(error) {
        if (error) {
          $('#newcomment .error').remove()
          $('#newcomment').append($('<div>').addClass('error').text(error))
        }
        else {
          loadComments()
        }
      })
      $(this).trigger('reset')
      $('#newcomment .error').remove()
      $('.star-cb-group input').removeAttr('checked')
    }
  })


  // Add a listener to rating stars and wait for rating submission
  $('.star-cb-group label').on('click', function(event) {
    $('.star-cb-group input').removeAttr('checked')
    $(this).prev('input').attr('checked','checked')
    //console.log($(this).siblings('input'))
  })


  // Add a listener to comments button
  $('#likebutton').on('click', function(event) {

    event.preventDefault()

    let urlid = $('#likebutton').attr('URLid')
    let url   = `/urls/${urlid}/likes`

    $.ajax({
      method: 'POST',
      url   : url,
    }).then(function(result) {
      $('#counter').text(result.likecount)
      })
  })
})




// loadLikeCount
function loadLikeCount() {

  let urlid = $('#likebutton').attr('URLid')
  let url   = `/urls/${urlid}/likes`

  $.ajax({
    method: 'GET',
    url   : url,
  }).then(function(result) {
    $('#counter').text(result.likecount)
    })
}




// Load all comments by calling the render comments function
function loadComments() {
  let urlid = $('#newcomment').attr('URLid')
  let url   = `/urls/${urlid}/comments`

  $('#comments-container').html('')
  $('#comments-container').append($('<div>').addClass('row').addClass('justify-content-center'))


  $.ajax({
    method: 'GET',
    url: url,
  }).then(function(response) {
    renderComments(response)
  })
}



// Render all comments by calling the createCommentElement
function renderComments(comments) {
  let commentsContainer = $('#comments-container div')
  comments.forEach(function(comment) {
    let commentElm = createCommentElement(comment)
    commentsContainer.prepend(commentElm)
  })
}



// Create a URL element (to be added to the DOM by renderURLS)
function createCommentElement(comment) {
  let $ratingStars = $('<div>').addClass('rating')
  for (let i = 0; i < comment.rating; i++) {
    $ratingStars.append($('<span>').html('<i class="fa fa-star" aria-hidden="true"></i>'))
  }
  for (let i = 0; i < 5 - comment.rating; i++) {
    $ratingStars.append($('<span>').html('<i class="fa fa-star-o" aria-hidden="true"></i>'))
  }


  let $comment = $('<div>').addClass('container').addClass('comment-box')
                    .append($('<div>').append($('<img>').addClass('avatar-img').attr('src',comment.avatar)))
                    .append($('<div>').addClass('comment-name').append($('<p>').text(comment.name)))
                    .append($('<div>').addClass('comment-text').text(comment.content))
                    .append($ratingStars)
  return $comment
}


function loadURLsTwice () {
  let apiURL  = $('.preview-container').attr('urlAPI')

  //console.log(apiURL)

  renderURLS(apiURL)

}


// Renders all the URLs in the database and adds them to the DOM (one by one)

function renderURLS(apiURL) {


  let urlsContainer = $('.preview-container').first()

  //console.log(urlsContainer)

      $.ajax({

        url: "http://api.linkpreview.net",
        dataType: 'jsonp',
        data: {q: apiURL, key: '5997560f6be6493a7f79074954ae858b60ed5be482161'},
        success: function (response) {
          //console.log(response);
              urlsContainer.append($(`<img src="${response.image}">`).addClass('image-rendered'))
        }
      });


}


















