$(document).ready(function(){
  // fixed 맵 토글
  $('.map_box').click(function(){
    $('.map_modal').slideDown();
    // $('html, body').css('overflow','hidden');
    $('html, body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });
  $('.map_modal .map_close').click(function(){
    $('.map_modal').slideUp();
    $('html, body').off('scroll touchmove mousewheel');
  });

  // fixed 스토리지 토글
  $('.storage_box').click(function(){
    $('.storage_modal').slideDown();
    $('html, body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });
  $('.storage_modal .storage_close').click(function(){
    $('.storage_modal').slideUp();
    $('html, body').off('scroll touchmove mousewheel');
  });
  // 스토리지 아이템 설명 토글
  $('.storage_item span').hide();
  $('.storage_item a').hover(
    function() { $(this).find('span').show(); },
    function() { $(this).find('span').hide(); }
  );
  
  // 스토리지 아이템 모달 토글
  $('.storage_item a').click(function() {
    var targetModal = $(this).attr('id') + '_modal';
    $('.item_modal').hide();
    $('.' + targetModal).fadeIn();
  });
  $('.item_modal').click(function(e){
    if ($(e.target).closest('.item_modal_inner').length === 0) {
      $(this).fadeOut();
    }
  });

  // fixed 헬프 토글
  $('.help_box').click(function(){
    $('.help_modal, .help_text_modal').fadeIn();
    $('html, body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });
  $('.help_modal, .help_text_modal').click(function(){
    $('.help_modal, .help_text_modal').fadeOut();
    $('html, body').off('scroll touchmove mousewheel');
  });
});

// 스크롤
$(document).ready(function() {
  let char_img = $('.char_img');
  let moon = $('.moon_box');
  let sun = $('.sun_box');
  let width = $(document).width();    // 문서 가로
  let w_width = $(window).width();    // 윈도우 가로
  let sposL = $(window).scrollLeft();
  let timeout;

  // 노크 캐릭터
  function knock_char(){
    $('.char_img').css({
      'width': '150px',
      'background-image': 'url("images/knock_char.png")',
      'background-position': 'left',
      'background-size': '1050px 200px',
      'animation': 'char_knock 1.5s steps(7)'
    });
  }

  // 일반 캐릭터
  function char(){
    $('.char_img').css({
      'width': '150px',
      'transform': 'translate(-50%, -50%) scaleX(1)',
      'background-image': 'url("images/char1.png")',
      'background-position': 'left',
      'background-size': '600px 200px',
      'animation': 'char_move 4s steps(4) infinite'
    });
  }

  // 캐릭터 모션
  function char_motion(animate) {
    if (animate) {
      char_img.css({
        'width': '150px',
        'background-image': 'url("images/3d_char_move.png")',
        'background-position': 'left',
        'background-size': '600px 200px',
        'animation': 'char_move 0.5s steps(4) infinite'
      });
    } else {
      char_img.css({
        'width': '150px',
        'transform': 'translate(-50%, -50%) scaleX(1)',
        'background-image': 'url("images/char1.png")',
        'background-position': 'left',
        'background-size': '600px 200px',
        'animation': 'char_move 4s steps(4) infinite'
      });
    }
  }

  // 마우스휠 움직일 때마다 이벤트 실행
  $(window).on('wheel', function(e) {
    // e(jQuery가 반환)
    // .originalEvent(자바스크립트에서의 원래 이벤트)
    // .deltaY(마우스 휠을 어느 방향으로 얼만큼을 굴렸는지 => 양수이면 아래쪽으로, 음수이면 위쪽으로)
    let delta = e.originalEvent.deltaY;
    // 현재 위치 표시
    let sposC = $(this).scrollLeft();
    // 현재 위치 출력
    $('.coin_text').text(parseInt(sposC));
    
    char_img.css('transform', sposC > sposL || sposL == 0 ? 'translate(-50%, -50%) scaleX(1)' : 'translate(-50%, -50%) scaleX(-1)');

    moon.css('transform', `rotate(-${sposC / width * 310 + 280}deg)`);
    sun.css('transform', `rotate(-${sposC / width * 320 + 80}deg)`);        
    $('.map_pic').css('left',`${sposC / 140}vw`);   // 지도위치

    // 현재 스크롤 위치(sposC) + 휠이동값(delta)를 더해서 스크롤 위치 업데이트
    $(this).scrollLeft(sposC + delta);

    char_motion(true);

    clearTimeout(timeout);
    timeout = setTimeout(() => char_motion(false), 300);

    sposL = sposC;

    // 처음과 마지막 모션 중지 (마지막 수정해야함)
    if(sposL <= 0 || sposL >= width) {
      clearTimeout(timeout);
      char_motion(false);
    }
  });

  // 클릭 시 스크롤 원하는 곳으로 이동 (문 두드리기 이벤트 실행을 위한 밑작업)
  $('div.move_location').on('click', function() {
    let id = parseInt(($(this).attr('id')).slice(-1));
    // slice로 마지막 숫자 추출 후 parseInt로 숫자로 변경
      $('html, body').animate({
        scrollLeft: 1920 * id + (960 - w_width / 2)
      }, 500, function() {
        // 코인 옆 숫자 업데이트 다시 하기
        $('.coin_text').text(parseInt($(window).scrollLeft()));
      });
    setTimeout(knock_char,300);
    $('.modal_back').css('z-index','1999').delay(1700).show().animate({'width':'300vw','height':'300vw'},500);
    $(`.modal`+id).delay(2100).fadeIn();
    $('html, body').css('overflow','hidden');
    setTimeout(char,2200);

    $('html, body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });

  // 콘택트 모달
  $('#house4').on('click', function() {
    $('.modal_back').css('z-index','1999').delay(200).show().animate({'width':'300vw','height':'300vw'},500);
    $('.modal4').delay(600).fadeIn();
    $('html, body').css('overflow','hidden');
    setTimeout(char,700);

    $('html, body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });

  // 맵에서 모달 팝업
  $('.map_r_box > div').on('click', function() {
    let id = parseInt(($(this).attr('id')).slice(-1));
      $('html, body').animate({
        scrollLeft: 1920 * id + (960 - w_width / 2)
      }, 500, function() {
        // 코인 옆 숫자 업데이트 다시 하기
        $('.coin_text').text(parseInt($(window).scrollLeft()));
      });
    $('.map_modal').hide();
    $('.modal_back').css('z-index','1999').show().animate({'width':'300vw','height':'300vw'},500);
    $(`.modal`+id).delay(600).fadeIn();
    $('html, body').css('overflow','hidden');
    setTimeout(char,2200);

    $('html, body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  });

  // 맵에서 이동
  $('a.map_location').on('click', function() {
    let id = parseInt(($(this).attr('id')).slice(-1));
    // slice로 마지막 숫자 추출 후 parseInt로 숫자로 변경
    $('.map_modal').slideUp();
    $('html, body').delay(300).animate({
      scrollLeft: 1920 * id + (960 - w_width / 2)
    }, 600, function() {
      // 코인 옆 숫자 업데이트 다시 하기
      $('.coin_text').text(parseInt($(window).scrollLeft()));
      $('.map_pic').css('left',`${$(window).scrollLeft() / 140}vw`);
    });
  });

  // 테스트중
  $('.map').on('click', function(){
    $('.map_modal').slideDown();
    // $('html, body').scrollLeft();
    // $('html').css('width','100vw');
    $('html, body').css('overflow','hidden');
    $('body').on('scroll touchmove mousewheel', function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  })

  $('.map_close').on('click', function(){
    $('.modal_back').css({'width':'0px','height':'0px'}).hide();
    $('.map_modal').slideUp();
    // $('html').css('width','max-content');
    $('html, body').css('overflow','auto');
    // let sposC = $(window).scrollLeft();
    // $('.coin_text').text(parseInt(sposC));
    $('body').off('scroll touchmove mousewheel');
  })

  $(window).resize(function() {
    // let sposC = $(window).scrollLeft();
    // $('.coin_text').text(parseInt(sposC));
    // document.location.reload();
  });
});

// 프로필 모달
$(document).ready(function(){
  let check_box1 = $('.p_job > ul > li > div');
  let check_box2 = $('.p_hobby > ul > li > div');
  let check_box3 = $('.p_license > ul > li > div');
  check_box1.click(function(){
    check_box1.removeClass('profile_act');
    $(this).addClass('profile_act');
  });
  check_box2.click(function(){
    check_box2.removeClass('profile_act');
    $(this).addClass('profile_act');
  });
  check_box3.click(function(){
    check_box3.removeClass('profile_act');
    $(this).addClass('profile_act');
  });
  $('.profile_close').click(function(){
    $('.modal_back').css({'width':'0px','height':'0px'}).hide();
    $('.modal_back').hide();
    $('.modal1').fadeOut();
    $('html, body').off('scroll touchmove mousewheel');
  });
  $('.skill_close').click(function(){
    $('.modal_back').css({'width':'0px','height':'0px'}).hide();
    $('.modal_back').hide();
    $('.modal2').fadeOut();
    $('html, body').off('scroll touchmove mousewheel');
  });
  $('.project_close').click(function(){
    $('.modal_back').css({'width':'0px','height':'0px'}).hide();
    $('.modal_back').hide();
    $('.modal3').fadeOut();
    $('html, body').off('scroll touchmove mousewheel');
  });
  $('.contact_close').click(function(){
    $('.modal_back').css({'width':'0px','height':'0px'}).hide();
    $('.modal_back').hide();
    $('.modal4').fadeOut();
    $('html, body').off('scroll touchmove mousewheel');
  });
});

// 스킬 모달
$(document).ready(function(){
  $('.skill_box > div > div > ul > li').click(function(){
    let pop_class = $(this).attr('id');
    $('.skill_box > div > div > div').hide();
    $('.skill_box > div > div > div.' + pop_class).fadeIn();

    $(this).addClass('skill_act').siblings().removeClass('skill_act');
  });
});

// 프로젝트 모달
$(document).ready(function(){
  $('.project_box .box_inner > div').click(function(){
    // alert('클릭');
    let project_id = parseInt(($(this).attr('id')).slice(-1));
    $('.p_inner_modal').hide();
    $(`.p_modal` + project_id).fadeIn();
  });
  $('.pm_close').click(function(){
    $('.p_inner_modal').fadeOut();
  });
});