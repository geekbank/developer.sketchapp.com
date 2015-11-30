// Main navigation logic
$('.main-nav .nav-toggle').click(function(){
  $('body').addClass('stop-scrolling');
  $('.overlay').toggleClass('active');
  $(this).toggleClass('active');
  $('.main-nav ul').toggleClass('active');
});

// TOC navigation logic
$('.toc-nav .nav-toggle').click(function(){
  if (window.innerWidth > 767) { return }
  $(this).toggleClass('active');
  $('.toc-nav ol').toggle();
});

// Overlay logic (dismiss everything when you click it)
$('.overlay').click(function(){
  $('body').removeClass('stop-scrolling');
  $('.overlay').removeClass('active all');
  $('.main-nav .nav-toggle').removeClass('active');
  $('.main-nav ul').removeClass('active');
  $('.search-form').hide();
});

// Window resize changes needed
$(window).resize(function(){
  if(window.innerWidth > 767) {
    $('body').removeClass('stop-scrolling');
    $('.overlay[class="active"]').removeClass('active');
    $('.main-nav ul').removeClass('active');
    $('.toc-nav ol').removeAttr('style');
    $('.nav-toggle').removeClass('active');
  }
});

// Search logic
$(document).ready(function(){
  var documentCollection,
      lunrIndex = lunr(function () {
        this.field('title', {boost: 10})
        this.field('body')
        this.field('url')
        this.ref('id')
      }),
      url = '/js/lunr.json'

  $.ajax({
    url: url,
    crossDomain: true,
    success: function(data,status,xhr){
      documentCollection = data
      $.each(data,function(index, value){
        lunrIndex.add(value)
      })
      search_enable()
    },
    error: function(xhr, type){
      console.log('Error type: ' + type)
      console.log(xhr)
    }
  })

  function search_enable() {
    $('.search-form .search-field').on('keyup', function(){
      var searchTerm = $(this).val()
      if (searchTerm.length > 2) {
        search(searchTerm)
      }
    })
  }

  function search(text){
    var results = lunrIndex.search(text),
        htmlOutput = '<ul>'
    $.each(results, function(index, result){
      var searchResult = documentCollection[result.ref - 1] // Because Lunr results are 0-based, and Jekyll collections are 1-based
      htmlOutput += "<li><a href='" + searchResult.url + "'>" + searchResult.title + '</a></li>'
    })
    htmlOutput += '</ul>'
    $('.search-results').html(htmlOutput)
  }

  function search_close() {
    $('.overlay').removeClass('active all');
    $('.search-form').hide();
  }

  $('.search-toggle').click(function(){
    $('body').addClass('stop-scrolling');
    $('.overlay').addClass('active all');
    $('.search-field').val('');
    $('.search-results').html('')
    $('.search-form').show();
    $('.search-field').focus();
  });

  $('.search-close').click(function(){
    search_close();
  });
})
