$(document).ready(function() {

  var transitionDone = false;
  //var helperPopupTimerPromise = null;

  var choices = {'projectStatus':null, 'pageType':null, 'repoStatus':null};
  var currentView, nextView, thisView, previousView;
  var lastViewCount = null;
  /* for going back from lastView, need to scroll up before transition to last page
    so I want to store the id of the view that was last looked at to scroll up from
    and also must have boolean set for whether or not its relevant to store this */
  var lastViewed = 0;
  var storeLastViewed = false; // set to true once we are looking at #views so we store view onscroll event

  //var $scope = {};
  //$scope.stepNumbers = {};

  /* for choices sliding */
  var bodyWidth = $('body').width();
  var bodyHeight = $('body').height();

  // places the current view top and center and shows it
  var showView = function(view){view.css({'top':0, 'left':0, 'display':'block'});}

  var clickChoice1 = function() { //question: ?started project?
    /* at the start of the view page1 is shown, by the end the next one is */
    if(choices['projectStatus']=='new-project'){changeViewLeft($('#page1'),$('#page3'));}
    else{changeViewRight($('#page1'),$('#page2'));}
  }
  var handle1 = function(){
    thisView = $('#page1');
    console.log('lastViewCount:'+lastViewCount);
    if(lastViewCount==0){slideDown($('#intro'), thisView);}
    else if(lastViewCount==2){
      if(choices['projectStatus']=='new-project'){changeViewRight($('#page3'),thisView);}
      else{changeViewLeft($('#page2'), thisView);}
    }
    else{showView($('#page1'));}
    lastViewCount = 1;
  }
  var handle2 = function(){
    thisView = $('#page2');
    console.log('lastViewCount:'+lastViewCount);
    if(lastViewCount==0){slideDown($('#page1'), thisView);}
    else if(lastViewCount==2){
      if(choices['projectStatus']=='new-project'){changeViewRight($('#page3'),thisView);}
      else{changeViewLeft($('#page2'), thisView);}
    }
    else{showView($('#page4'));}
    lastViewCount = 1;
  }
  var handle0 = function(){
    thisView = $('#page1');
    nextView = $('#page2');
    // detect if user hit back button from previous page in which case want to undo the slide down
    if(lastViewCount==0){undoSlideDown(nextView, thisView);}
    else{showView(thisView);}
    lastViewCount = 0;
  }
  var handle4 = function(){
    thisView = $('#page2');
    console.log('lastViewCount:'+lastViewCount);
    if(lastViewCount==0){
      changeViewRight($('#page1'),thisView);
    }
    else{showView($('#page1'));}
    lastViewCount = 1;
  }

  var undoSlideDown = function(toHideView, toShowView){
    showView(toHideView); // show it before we hide it
    if((toHideView.attr('id')=='views')&&(lastViewed>0)){
      // I know we've left the lastView by the end of this transition, so stop storing last viewed
      storeLastViewed = false;

      var toShowViewHeight = toShowView.height();

      toHideView.css({top:'-'+lastViewed+'px'});
      toShowView.css({'top': '-'+toShowView.css('height'), 'display':'block'});

      toHideView.animate({top:0}, (1000*(lastViewed*1.0/toShowViewHeight)), function(){
        toHideView.animate({top: toShowView.css('height')}, 1000, function(){toHideView.hide();});
        toShowView.animate({top: 0}, 1000);
        lastViewed = 0;
      });
    }
    else{
      toShowView.css({'top': '-'+toShowView.css('height'), 'display':'block'});
      toHideView.animate({top: toShowView.css('height')}, 1000, function(){toHideView.hide();});
      toShowView.animate({top: 0}, 1000);
    }
  }
  var slideDown = function(currentView, nextView) {
    console.log('slideDown');
    // store scrolling point now that we're looking at the last view
    if(nextView.attr('id')=='views'){storeLastViewed=true;}
    showView(currentView);
    nextView.css({'top': currentView.css('height'), 'display':'block'});
console.log('nextView.css top: '+currentView.css('height'));
console.log('currentView.css top: 0');
console.log('currentView.animate -'+currentView.css('height'));
console.log('nextView.animate top 0 ');
    currentView.animate({top: '-'+(currentView.css('height'))}, 1000, function(){currentView.hide();});
    nextView.animate({top: 0}, 1000);
  }
  // handles showing the correct views based on parameters
  /*var handleViews = function(pathArray, pathArrayLength){
    if(pathArrayLength < 3){handle0();}
    else if(pathArrayLength == 3){handle1();}
    else if(pathArrayLength == 4){handle2();}
    else if(pathArrayLength == 5){handle3();}
    else{handle4();}
  }*/

  var changeViewLeft = function(toHideView, toShowView){
    // set up the current view first
    showView(toHideView);
    // position next view then slide it over
    toShowView.css({'top':0, 'left':'-'+bodyWidth+'px', 'display':'block'});
    toHideView.animate({left: bodyWidth}, 1000, function(){toHideView.hide();});
    toShowView.animate({left: 0}, 1000);
  }
  var changeViewRight = function(toHideView, toShowView){
    // set up the current view first
    showView(toHideView);
    // position next view then slide it over
    toShowView.css({'top':0, 'left':bodyWidth+'px', 'display':'block'});
    toHideView.animate({left: '-'+bodyWidth+'px'}, 1000, function(){toHideView.hide();});
    toShowView.animate({left: 0}, 1000);
  }
  window.onscroll = function(event){
    if(transitionDone && storeLastViewed && $('#views').css('display')=='block'){
      lastViewed = document.body.scrollTop;
    }
  }


  // buttons in the view have ng-click = 'go(goTo)' to route to next view
  //$scope.go = function(goTo){$location.path($scope.currentPath+goTo+'/');};
  //$scope.startOver = function(){$window.location.href = '/learn/a-guide-to-using-github-pages';};

  var viewIds = ['page1', 'page2', 'page3', 'page4', 'page5'];

  var resize = function(){
    bodyWidth = $('body').width();
    bodyHeight = $('body').height();
    for(var i=0; i<viewIds.length; i++){$('#'+viewIds[i]).css('width', bodyWidth+'px');}
    $('#intro').css('min-height', bodyHeight);
  }

  // called for each route change
  var transition = function(){
    storeLastViewed = false;
    //handleHelperPopup();
    transitionDone = true;
    // hide all the views
    for(var i=0; i<viewIds.length; i++){$('#'+viewIds[i]).hide();}
  };
  var init = function(){
    window.onresize = resize;
    resize();

    transitionDone = false;
    //$scope.currentPath = $location.path();
    //var pathArray = $scope.currentPath.split('/');
    transition();

  }
  init();

  $("#button-page-intro").on("click", function() {
    console.log("TEST intro");
    lastViewCount = 0;
    handle1();
  });
  $("#button-page-1").on("click", function() {
    console.log("TEST page1");
    lastViewCount = 0;
    handle4();
  });
  $("#button-page-2").on("click", function() {
    console.log("TEST page2");
    lastViewCount = 0;
    handle0();
  });

});
