/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

    var container = container,
        currentPage,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page, noslide, removeOlder) {

        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            if(noslide){
                if(removeOlder) {
                    currentPage && currentPage.remove();
                }
                this.slidePageFrom(page);
            } else {
                this.slidePageFrom(page, 'left');
            }
        } else {
            stateHistory.push(state);
             if(noslide){
                if(removeOlder) {
                    currentPage && currentPage.remove();
                }
                this.slidePageFrom(page);
            }else {
                this.slidePageFrom(page, 'right');
            }
        }

    };

    var opMap = {
        left: "right",
        right: "left",
        top: 'bottom',
        bottom: 'top'
    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, from, noremove, noappend) {

        !noappend && container.append(page);

        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        !noappend &&  page.attr("class", "page " + from);
        if(!noremove) {
            (function  (currentPage) {
                currentPage.one('webkitTransitionEnd', function(e) {
                     currentPage.removeClass('transition');
                    !noremove && currentPage.remove();
                });
            })(currentPage);
        }

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        !noappend && page.attr("class", "page transition center");
        !noremove && currentPage.attr("class", "page transition " + opMap[from]);
        if(page && page[0].id != 'network-warning')
            currentPage = page;
    };

}