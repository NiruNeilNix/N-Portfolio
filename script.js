const spans = document.querySelectorAll('.progress-bar span');



spans.forEach((span) => {

    span.style.width = span.dataset.width;

    span.innerHTML = span.dataset.width;

});



document.addEventListener("DOMContentLoaded", () => {

    const dots = document.querySelectorAll('.dot');

    const sections = document.querySelectorAll('section, header.hero');



    

    dots.forEach((dot, index) => {

        dot.addEventListener('click', (event) => {

            event.preventDefault();

            sections[index].scrollIntoView({ behavior: 'smooth' });

            updateActiveDot(index);

        });

    });



  

    const updateActiveDot = (index) => {

        dots.forEach(dot => dot.classList.remove('active'));

        dots[index].classList.add('active');

    };



       const highlightDotOnScroll = () => {

        sections.forEach((section, index) => {

            const rect = section.getBoundingClientRect();

            if (rect.top >= 0 && rect.top < window.innerHeight / 3) {

                updateActiveDot(index);

            }

        });

    };



    window.addEventListener('scroll', highlightDotOnScroll);

});



// typing cursor

! function($) {



    "use strict";



    var Typed = function(el, options) {

 

        this.el = $(el);

        this.options = $.extend({}, $.fn.typed.defaults, options);

        this.isInput = this.el.is('input');

        this.attr = this.options.attr;



      

        this.showCursor = this.isInput ? false : this.options.showCursor;



        

        this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text()



    

        this.contentType = this.options.contentType;



    

        this.typeSpeed = this.options.typeSpeed;



    

        this.startDelay = this.options.startDelay;



        this.backSpeed = this.options.backSpeed;



        

        this.backDelay = this.options.backDelay;



      

        this.stringsElement = this.options.stringsElement;



       

        this.strings = this.options.strings;



    

        this.strPos = 0;



       

        this.arrayPos = 0;



        this.stopNum = 0;



       

        this.loop = this.options.loop;

        this.loopCount = this.options.loopCount;

        this.curLoop = 0;



      

        this.stop = false;



        

        this.cursorChar = this.options.cursorChar;



       

        this.shuffle = this.options.shuffle;

       

        this.sequence = [];



       

        this.build();

    };



    Typed.prototype = {



        constructor: Typed



        ,

        init: function() {

            // begin the loop w/ first current string (global self.strings)

            // current string will be passed as an argument each time after this

            var self = this;

            self.timeout = setTimeout(function() {

                for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;



                // shuffle the array if true

                if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);



                // Start typing

                self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);

            }, self.startDelay);

        }



        ,

        build: function() {

            var self = this;

            // Insert cursor

            if (this.showCursor === true) {

                this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");

                this.el.after(this.cursor);

            }

            if (this.stringsElement) {

                self.strings = [];

                this.stringsElement.hide();

                var strings = this.stringsElement.find('p');

                $.each(strings, function(key, value){

                    self.strings.push($(value).html());

                });

            }

            this.init();

        }



        ,

        typewrite: function(curString, curStrPos) {

            // exit when stopped

            if (this.stop === true) {

                return;

            }



    

            var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;

            var self = this;



            self.timeout = setTimeout(function() {

                var charPause = 0;

                var substr = curString.substr(curStrPos);

                if (substr.charAt(0) === '^') {

                    var skip = 1; // skip atleast 1

                    if (/^\^\d+/.test(substr)) {

                        substr = /\d+/.exec(substr)[0];

                        skip += substr.length;

                        charPause = parseInt(substr);

                    }



                    // strip out the escape character and pause value so they're not printed

                    curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);

                }



                if (self.contentType === 'html') {

                    // skip over html tags while typing

                    var curChar = curString.substr(curStrPos).charAt(0)

                    if (curChar === '<' || curChar === '&') {

                        var tag = '';

                        var endTag = '';

                        if (curChar === '<') {

                            endTag = '>'

                        } else {

                            endTag = ';'

                        }

                        while (curString.substr(curStrPos).charAt(0) !== endTag) {

                            tag += curString.substr(curStrPos).charAt(0);

                            curStrPos++;

                        }

                        curStrPos++;

                        tag += endTag;

                    }

                }



                self.timeout = setTimeout(function() {

                    if (curStrPos === curString.length) {

           

                        self.options.onStringTyped(self.arrayPos);



                        if (self.arrayPos === self.strings.length - 1) {

             

                            self.options.callback();



                            self.curLoop++;



                            // quit if we wont loop back

                            if (self.loop === false || self.curLoop === self.loopCount)

                                return;

                        }



                        self.timeout = setTimeout(function() {

                            self.backspace(curString, curStrPos);

                        }, self.backDelay);

                    } else {



                        /* call before functions if applicable */

                        if (curStrPos === 0)

                            self.options.preStringTyped(self.arrayPos);



             

                        var nextString = curString.substr(0, curStrPos + 1);

                        if (self.attr) {

                            self.el.attr(self.attr, nextString);

                        } else {

                            if (self.isInput) {

                                self.el.val(nextString);

                            } else if (self.contentType === 'html') {

                                self.el.html(nextString);

                            } else {

                                self.el.text(nextString);

                            }

                        }

                        curStrPos++;

                        self.typewrite(curString, curStrPos);

                    }

                }, charPause);

            }, humanize);



        }



        ,

        backspace: function(curString, curStrPos) {

        

            if (this.stop === true) {

                return;

            }



          

            var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;

            var self = this;



            self.timeout = setTimeout(function() {



    



                if (self.contentType === 'html') {

             

                    if (curString.substr(curStrPos).charAt(0) === '>') {

                        var tag = '';

                        while (curString.substr(curStrPos).charAt(0) !== '<') {

                            tag -= curString.substr(curStrPos).charAt(0);

                            curStrPos--;

                        }

                        curStrPos--;

                        tag += '<';

                    }

                }





                var nextString = curString.substr(0, curStrPos);

                if (self.attr) {

                    self.el.attr(self.attr, nextString);

                } else {

                    if (self.isInput) {

                        self.el.val(nextString);

                    } else if (self.contentType === 'html') {

                        self.el.html(nextString);

                    } else {

                        self.el.text(nextString);

                    }

                }



                if (curStrPos > self.stopNum) {

               

                    curStrPos--;

       

                    self.backspace(curString, curStrPos);

                }



                else if (curStrPos <= self.stopNum) {

                    self.arrayPos++;



                    if (self.arrayPos === self.strings.length) {

                        self.arrayPos = 0;



                       

                        if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);



                        self.init();

                    } else

                        self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);

                }



    

            }, humanize);



        }

        /**

         * Shuffles the numbers in the given array.

         * @param {Array} array

         * @returns {Array}

         */

        ,shuffleArray: function(array) {

            var tmp, current, top = array.length;

            if(top) while(--top) {

                current = Math.floor(Math.random() * (top + 1));

                tmp = array[current];

                array[current] = array[top];

                array[top] = tmp;

            }

            return array;

        }



        ,

        reset: function() {

            var self = this;

            clearInterval(self.timeout);

            var id = this.el.attr('id');

            this.el.after('<span id="' + id + '"/>')

            this.el.remove();

            if (typeof this.cursor !== 'undefined') {

                this.cursor.remove();

            }

            // Send the callback

            self.options.resetCallback();

        }



    };



    $.fn.typed = function(option) {

        return this.each(function() {

            var $this = $(this),

                data = $this.data('typed'),

                options = typeof option == 'object' && option;

            if (!data) $this.data('typed', (data = new Typed(this, options)));

            if (typeof option == 'string') data[option]();

        });

    };



    $.fn.typed.defaults = {

        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],

        stringsElement: null,

        // typing speed

        typeSpeed: 0,

        // time before typing starts

        startDelay: 0,

        // backspacing speed

        backSpeed: 0,

        // shuffle the strings

        shuffle: false,

        // time before backspacing

        backDelay: 500,

        // loop

        loop: false,

        // false = infinite

        loopCount: false,

        // show cursor

        showCursor: true,

        // character for cursor

        cursorChar: "|",

        // attribute to type (null == text)

        attr: null,

        // either html or text

        contentType: 'html',

        // call when done callback function

        callback: function() {},

        // starting callback function before each string

        preStringTyped: function() {},

        //callback for every typed string

        onStringTyped: function() {},

        // callback for reset

        resetCallback: function() {}

    };





}(window.jQuery);



$("document").ready(function() {

  handleShowHideSidebar();

  handleEscKey();

  handleSideBarClick();

  handleTyping();

});



function handleShowHideSidebar() {

  var $menuButton = $("#menu-button i"),

      show = "animated slideInLeft",

      hide = "animated slideOutLeft";



  $menuButton.on("click", function() {

    var $sideBar = $("#sidebar");



    if ($sideBar.hasClass("slideInLeft")) {

      $sideBar

        .removeClass(show)

        .addClass(hide)

        .removeClass("hidden");

    } else {

      $sideBar

        .removeClass(hide)

        .addClass(show)

        .removeClass("hidden");

    }

  });

}



function handleSideBarClick() {

  $("#sidebar li a").on("click", function() {

    var href = $(this).attr("href");

    $("html, body").animate({

      scrollTop: $(href).offset().top

    }, 600);

    $("#sidebar")

      .removeClass("animated slideInLeft")

      .addClass("animated slideOutLeft");

    return false;

  });

}



function handleEscKey() {

  $(document).on("keyup", function(e) {

    if (e.keyCode === 27) {

      var href = $(this).attr("href");

      $("html, body").animate({

        scrollTop: $(href).offset().top

      }, 600);

      $("#sidebar")

        .removeClass("animated slideInLeft")

        .addClass("animated slideOutLeft");

      return false;

    }

  });

}



function handleTyping () {

  $(".element").typed({

    strings: ["A STUDENT", "A SPIRING DEVELOPER"],

    typeSpeed: 50,

    starDelay: 200,

    backDelay: 600,

    loop: true,

    showCursor: true,

    cursorChar: "|"

  });

}

//smooth scrolling

// Select all links with hashes

$('a[href*="#"]')

  // Remove links that don't actually link to anything

  .not('[href="#"]')

  .not('[href="#0"]')

  .click(function(event) {

    // On-page links

    if (

      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 

      && 

      location.hostname == this.hostname

    ) {

      // Figure out element to scroll to

      var target = $(this.hash);

      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      // Does a scroll target exist?

      if (target.length) {

        // Only prevent default if animation is actually gonna happen

        event.preventDefault();

        $('html, body').animate({

          scrollTop: target.offset().top

        }, 1000, function() {

          // Callback after animation

          // Must change focus!

          var $target = $(target);

          $target.focus();

          if ($target.is(":focus")) { // Checking if the target was focused

            return false;

          } else {

            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable

            $target.focus(); // Set focus again

          };

        });

      }

    }

  });



  //emailJS

  document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('contactForm');



    form.addEventListener('submit', function(event) {

        event.preventDefault(); // Prevent the default form submission



        // Get form values

        const name = document.getElementById('name').value;

        const email = document.getElementById('email').value;

        const message = document.getElementById('message').value;



         // Validate form values (simple validation)

         if (name === '' || email === '' || message === '') {

            alert('Please fill in all fields.');

        return;

        }



        // Create an object to hold the form data

        const formData = {

            name: name,

            email: email,

            message: message

        };



        // Send the form data using EmailJS

        emailjs.send('service_sh2nqcl', 'template_9e9y82t', formData)

            .then(function(response) {

                console.log('Success:', response.status, response.text);

                alert('Form submitted successfully!');

            }, function(error) {

                console.error('Error:', error);

                alert('There was an error submitting the form.');

            });

    });

});