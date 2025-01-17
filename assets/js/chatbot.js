$(document).ready(function () {
    var chatWindow = $('#chat-box');
    var chatIcon = $('#chat-icon');
    // Set initial display style
    chatWindow.hide();
    chatIcon.show();

    // Pre-create and append the iframe to start loading it right away
    if (!chatWindow.find('iframe').length) {
      var iframe = $('<iframe>', {
        src: "https://chatbot-tofumelo.vercel.app/",
        id: "iframe-style",
      });
      chatWindow.append(iframe);
    }

    $("#chat-circle").click(function () {
      $("#chat-box").toggle('scale');
      $("#chat-icon").toggle('scale');

      // Ensure the iframe is visible when the chat window is shown
      var iframe = chatWindow.find('iframe');
      if (iframe.length) {
        iframe.css('visibility', 'visible');
      }
    });

    $("#close-button").click(function () {
      $("#chat-box").toggle('scale');
      $("#chat-icon").toggle('scale');
    });
  });

  var lastMessageTime = 0;
  var pageLoadTime = new Date().getTime();
  $(window).scroll(function () {
    var currentTime = new Date().getTime();

    // If more than one minute has passed since the last message
    if (currentTime - pageLoadTime > 6000){
      if (currentTime - lastMessageTime > 60000) {
        $('#chat-message').show();
        setTimeout(function () {
          $('#chat-message').hide();
        }, 3000);  // Message will be hidden after 5 seconds

        // Update the time of the last message
        lastMessageTime = currentTime;
      }
    }
  });

  /* Function to the chat-message happear when the mouse is hover the button*/
  $('#chat-icon').hover(
    function () {
      $('#chat-message').show();
    }, function () {
      $('#chat-message').hide();
    }
  );

  var iframe = $('#iframe-style')[0];
  iframe.contentWindow.postMessage({ type: 'changeCSS', css: '.st-emotion-cache-139wi93 { padding: 0 !important; padding-bottom: 20px !important; }' }, '*');