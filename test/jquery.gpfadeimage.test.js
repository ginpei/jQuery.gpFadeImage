var gpFadeImage = com.ginpen.gpFadeImage;

module('units');

test('general', function() {
  ok(com.ginpen.gpFadeImage, 'com.ginpen.gpFadeImage');
  var $el = $('<div />');
  equal($el.gpFadeImage()[0], $el[0], 'jQuery.fn.gpFadeImage');
});

test('set/get settings', function() {
  var $el, settings;

  $el = $('<img />');
  settings = {};
  gpFadeImage._setSettings($el, settings);
  equal(gpFadeImage.getSettings($el), settings, 'commonly');

  $el = $('<img />');
  gpFadeImage._setSettings($el, null);
  notEqual(gpFadeImage.getSettings($el), null, 'null');
});

test('check available', function() {
  var $el;

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, {src: ['about:blank']});
  ok(gpFadeImage._isAvailable($el), 'commonly');

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, ['about:blank']);
  ok(gpFadeImage._isAvailable($el), 'settings as array');

  $el = $('<img />');
  gpFadeImage._setSettings($el, []);
  ok(!gpFadeImage._isAvailable($el), 'empty array');

  $el = $('<img />');
  gpFadeImage._setSettings($el, {src: ['about:blank']});
  ok(!gpFadeImage._isAvailable($el), 'no src');

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, {src: []});
  ok(!gpFadeImage._isAvailable($el), 'empty src list');

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, {});
  ok(!gpFadeImage._isAvailable($el), 'no src list');

  $el = $('<span />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, {src: ['about:blank']});
  ok(!gpFadeImage._isAvailable($el), 'not img');
});

test('normalize settings', function() {
  var $el, settings;

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, ['ginpen.com']);
  gpFadeImage._normalizeSetting($el);
  settings = gpFadeImage.getSettings($el);
  equal(settings.src.length, 2, 'insert original image src: length');
  equal(settings.src[0], 'about:blank', 'insert original image src: original');
  equal(settings.src[1], 'ginpen.com', 'insert original image src: specified');
  equal(settings.duration, 1000, 'default duration');
  equal(settings.interval, 2000, 'default interval');

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, {
    duration: 321,
    interval: 1234,
    src: ['ginpen.com']
  });
  gpFadeImage._normalizeSetting($el);
  settings = gpFadeImage.getSettings($el);
  equal(settings.src.length, 2, 'convert settings from array: length');
  equal(settings.src[0], 'about:blank', 'convert settings from array: value');
  equal(settings.src[1], 'ginpen.com', 'convert settings from array: value');
  equal(settings.duration, 321, 'specified duration');
  equal(settings.interval, 1234, 'specified interval');

  $el = $('<img />').attr('src', 'about:blank');
  gpFadeImage._setSettings($el, {
    duration: 0,
    interval: 0,
    src: ['img1', null, '', 'img2']
  });
  gpFadeImage._normalizeSetting($el);
  settings = gpFadeImage.getSettings($el);
  equal(settings.src.length, 3, 'remove empty src item: length');
  equal(settings.src[1], 'img1', 'remove empty src item: 1');
  equal(settings.src[2], 'img2', 'remove empty src item: 2');
  equal(settings.duration, 1, 'duration will be more than 0');
  equal(settings.interval, 1, 'interval will be more than 0');
});

test('wrap element', function() {
  var $el, $wrapper;

  var $el = $('<img />')
    .attr({
      src: 'ginpen.jpeg'
    })
    .attr({
      height: 123,
      width: 456
    })
    .appendTo('#qunit-fixture');
  gpFadeImage._wrap($el);
  $wrapper = $el.parent();
  ok($wrapper.hasClass('gpfadeimage-wrapper'), 'class');
  equal($wrapper.length, 1, 'wrapped');
  equal($wrapper.height(), 123, 'height');
  equal($wrapper.width(), 456, 'width');
});
