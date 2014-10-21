var twittler = {

  // This property defines the current stream to view
  currentStream: null,
  username: null,
  
  setUsername: function() {
    vex.dialog.open({
      message: 'Enter your username:',
      input: '<input name="username" type="text" placeholder="Username" required />',
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, {
          text: 'OK'
        })
      ],
      callback: function(data) {
        if (data === false) {
          twittler.setUsername();
        } else {
          twittler.username = data;
          twittler.currentStream = streams.home;
          twittler.showAllTweets();
        }
      }
    });
  },
  showAllTweets: function() {
    var $container = $('.tweets-container');
    var index = twittler.currentStream.length - 1;
    var tweetCount = index + 1;

    $container.find('.tweet').remove();     

    while (index >= 0) {
      var tweet = twittler.currentStream[index];
      var $tweetContainer = $('<div></div>').addClass('tweet');
      var $user = $('<a href="#"></a>').text('@' + tweet.user).addClass('user');
      var $time = $('<time></time>').attr('datetime', tweet.created_at).addClass('age');
      var $message = $('<div></div>').text(tweet.message).addClass('message lead');
      $tweetContainer.append($user, $time, $message);
      $tweetContainer.appendTo($container);
      index -= 1;
    }

    $('.show-tweets').hide();
    $('.age').age();

  },

  getNewTweets: function() {
    if (twittler.currentStream !== null) {
      var totalTweets = twittler.currentStream.length;
      var shownTweets = $('.tweet').length;  

      if (totalTweets > shownTweets) {
        $('.show-tweets').show().text(totalTweets - shownTweets + ' unread tweets');
      }
    }
  }
};

$(document).ready(function() {

  // Init
  vex.defaultOptions.className = 'vex-theme-plain';
  twittler.setUsername();
  

  $('.show-tweets').on('click', function() {
    twittler.showAllTweets();
  });

  $('.tweets-container').on('click', '.user', function() {
    twittler.currentStream = streams.users[$(this).text().slice(1)];
    twittler.showAllTweets();
  });

  $('.home').on('click', function() {
    twittler.currentStream = streams.home;   
    twittler.showAllTweets();
  });

  window.setInterval(twittler.getNewTweets, 1500);

});