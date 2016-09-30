/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var tasks = [];


// Set a configurable with just the close callback
Settings.config(
  { url: 'http://inikolov.info/pebble-routines/config/' },
  function (e) {
    var dict = {};

    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));

    if (e.options.tasks) {
      tasks = e.options.tasks;
    }

  }
);


// Pebble.addEventListener('ready', function() {
//   console.log('PebbleKit JS ready!');
// });

// Pebble.addEventListener('showConfiguration', function() {
//   var url = 'http://inikolov.info/pebble-routines/config/';

//   console.log('Showing configuration page: ' + url);

//   Pebble.openURL(url);
// });

// Pebble.addEventListener('webviewclosed', function(e) {
//   var configData = JSON.parse(decodeURIComponent(e.response));

//   console.log('Configuration page returned: ' + JSON.stringify(configData));

//   var dict = {};

//   if (configData.tasks) {
//     dict.tasks = configData.tasks;
//   }

//   // Send to watchapp
//   Pebble.sendAppMessage(dict, function() {
//     console.log('Send successful: ' + JSON.stringify(dict));
//   }, function() {
//     console.log('Send failed!');
//   });
// });



// some mock data
var demoRoutine = ["get up", "clean your face", "brush your teeth", "survive"];

// --- HELPERS ---
// ---------------

var getTasks = function () {
  var menuTasks = [];

  dict.tasks.forEach(function (taskName) {
    menuTasks.push({
      title: taskName,
      //subtitle: 'Some subtitle',
      icon: 'images/task.png'
    });
  });
  console.log(menuTasks);
  return menuTasks;
};

// ---------------

var menu = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: '#9afdfa',
  highlightTextColor: 'black',
  sections: [{
    title: 'First section',
    items: getTasks()
  }]
});

// show our list
menu.show();

menu.on('select', function (event) {
  menu.item(event.sectionIndex, event.itemIndex,
    {
      title: event.item.title,
      icon: "images/done.png",
      data: event.item.data,
      position: event.item.position
    });
});



