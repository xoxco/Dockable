/*
	Dockable.js
	version 1.0
	
	Allow elements to dock to the top of the page, or stack up on one another as the user scrolls.
		
	Copyright 2012 XOXCO, Inc
	http://xoxco.com/

	Documentation for this plugin lives here:
	http://xoxco.com/projects/code/dockable
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

*/

	(function($) {
		var PILES = [];
		var INTERVAL = null;
		var LAST_SCROLL = null;				
		$.fn.redock = function() {

				top_of_screen = $(window).scrollTop();
				if (top_of_screen == LAST_SCROLL) {
					return;
				}
				LAST_SCROLL = top_of_screen;

				$('.dockable-processed').each(function() {
					settings = $(this).data('settings');

					if ((top_of_screen+PILES[settings.pid].stack_height) >= ($(this).data('y')) ) {
						if (!$(this).hasClass('docked')) { 
							$(this).data('ph',$('<div class="placeholder" style="height: ' + $(this).outerHeight() + 'px; width: ' + $(this).width() + 'px;"></div>').insertAfter(this));
							$(this).addClass('docked');
							$(this).data('orig-position',$(this).css('position'));
							$(this).css('position','fixed');
							if (settings.style=='stack') {
								$(this).css('top',(PILES[settings.pid].stack_height)+'px');
								$(this).data('stacked',PILES[settings.pid].stack_height);
								PILES[settings.pid].stack_height += $(this).outerHeight() + settings.margin;
							}
							if (settings.style=='dock') {
								
								// slide up previous items
								$('.foo').css('top','-100px');
								// dock THIS item
								$(this).css('top',(settings.top)+'px');
								$(this).addClass('foo');
								$(this).data('stacked',PILES[settings.pid].stack_height);
								PILES[settings.pid].stack_height = $(this).outerHeight() + settings.top;
																
							}
						}
					}
					if (top_of_screen < ($(this).data('y')-$(this).data('stacked')) ) {
						if ($(this).hasClass('docked')) {
							if (settings.style=='stack') {
								PILES[settings.pid].stack_height -= $(this).outerHeight() + settings.margin;
							}
							if (settings.style=='dock') {
								$(this).css('top','0px');	
								$(this).removeClass('foo');
								if ($('.foo').length==0) {
									PILES[settings.pid].stack_height = settings.top;
								} else {
									$('.foo').eq($('.foo').length-1).css('top','0px');
								}
							}
							$(this).removeClass('docked');
							$(this).css('position',$(this).data('orig-position'));
							$($(this).data('ph')).remove();
						}
					}
				
				});
			}
		
		$.fn.dockable = function(options) {
			options = $.extend({offset:0,margin:0,style:'stack'},options);
			
			pid = PILES.length;
			options.pid = pid;
			PILES[pid] = options;
			PILES[pid].top = PILES[pid].stack_height = options.offset;

			this.each(function() {
				$(this).data('settings',options);
				$(this).data('y',$(this).position().top);
				$(this).addClass('dockable-processed');
			});
		
			$(window).scroll(function() {
				$(window).redock();
			});

/*
			 if (!INTERVAL) {
			 	console.log("Setting interval");
			 	INTERVAL = setInterval(function(){$(window).redock();},100);
			 }
*/
		
		}
	
	
	})(jQuery);

