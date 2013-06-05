/*
Main Guidelines for Coupon Options.

-Coupon structure
id:
Id assigned to the main coupon Div
Type: string
Default: dealeronCoupon

image:
image assigned as a background css attribute to the main coupon/button div
Type: string

width:
Coupon Width
Type: integer
Default: 0

height:
Coupon height
Type: integer
Default: 0


-HTML content to pass to the coupon
content:
type: HTML / Text
default:blank

contentTag:
main div surrounding the custom content.
type: Tag Elements
default: div

contentID:
Id assigned to the custom content container.
type: string
default: couponContent


-Coupon Positioning
top:
top position for the coupon, based on the page.
type: integer
default:
if page size is less than 800, 10%
if not 25%

left:
left position for the coupon, based on the page.
type: integer
default: 25%


-Close Button
close:
displaying or not displaying the close image on the top, left corner of the coupon.
type: bit
default: 1

href:
If value is passed and "overlayclose" is active, closing the coupon will redirect the page to the entered URL.
type: string
default: blank

target:
Pass "blank" if you want the url to be opened in a new page.
type: string
default: blank


-Page Overlay
overlay:
displaying or not displaying the background overlay over the whole page.
type: bit
default: 0

overlayId:
Id assigned to the Overlay div.
type: string
default: dealeronOverlay

overlayColor:
background color assigned to the overlay div.
type: hexadecimal
default: #000000

overlayClose:
Option to close the Coupon by clicking on the background overlay.
type: bit
default: 0

overlayHref:
If value is passed and "close" is active(default), clicking on the overlay will redirect the page to assigned url URL.
type: string
default: blank

overlayTarget:
Pass "blank" if you want the url to be opened in a new page.
type: string
default: blank


-Buttons
id:
Id assigned to the button.
type: string
default: dealerOnCouponBtn

title:
title attribute for main button
type: string
default: blank

image:
image url assigned as a background css attribute to the main button div
type: string
default: blank

width:
button Width
type: integer
default: 0

height:
button height
type: integer
default: 0

top:
top position for the button, based on the coupon.
type: integer
default: 0

left:
left position for the button, based on the coupon.
type: integer
default: 0

right:
right position for the button, based on the coupon.
type: integer
default: 0

bottom:
bottom position for the button, based on the coupon.
type: integer
default: 0

href:
If value is passed clicking on the button will close the coupon and redirect the page to the entered URL.
type: string
default: blank

target:
Pass "blank" if you want the url to be opened in a new page.
type: string
default: blank


-Display Options
session:
Activate this option if you want the coupon only appear once per session.
For session check we will use session cookies.
type: bit
default: 0

cookieName:
Cookie Name you want to use. Please make sure you use a unique name
type: string
default: dealeronPopUp

pageName:
An array of pages you want the coupon to appear. Please use this in case you want the same Coupon on multiple pages.
type: array
default: empty

pageCriteria:
If you want the coupon to only appear under specific criteria (query parameters)
type: JSON array ( name/values pairs)
syntax: {"n":"name","v":"value"}
default: empty

*/

var CouponManagment = {
    //coupon object
    coupon: function(o)
    {
        o.id = (typeof o.id == 'undefined') ? 'coupon': o.id;
        o.title = (typeof o.title == 'undefined') ? '': o.title;
        o.image = (typeof o.image == 'undefined') ? '': o.image;
        o.content = (typeof o.html == 'undefined') ? '': o.html;
        o.contentTag = (typeof o.contentTag == 'undefined') ? 'div': o.contentTag;
        o.contentId = (typeof o.contentId == 'undefined') ? 'couponContent': o.contentId;
        o.width = (typeof o.width == 'undefined') ? '0': o.width;
        o.height = (typeof o.height == 'undefined') ? '0': o.height;
        o.top = (typeof o.top == 'undefined') ? '0': o.top;
        o.right = (typeof o.right == 'undefined') ? '0': o.right;
        o.bottom = (typeof o.bottom == 'undefined') ? '0': o.bottom;
        o.left = (typeof o.left == 'undefined') ? '0': o.left;
        o.close = (typeof o.left == 'undefined') ? 1: o.left;
        o.overlay = (typeof o.overlay == 'undefined') ? 0: o.overlay;
        o.overlayId = (typeof o.overlayId == 'undefined') ? 'couponOverlay': o.overlayId;
        o.overlayColor = (typeof o.overlayColor == 'undefined') ? '#000000': o.overlayColor;
        o.overlayClose = (typeof o.overlayClose == 'undefined') ? 0: o.overlayClose;
        o.overlayHref = (typeof o.overlayHref == 'undefined') ? '': o.overlayHref;
        o.overlayTarget = (typeof o.overlayTarget == 'undefined') ? '': o.overlayTarget;
        o.href = (typeof o.href == 'undefined') ? '': o.href;
        o.target = (typeof o.href == 'undefined') ? '': o.target;
        o.button = (typeof o.button == 'undefined') ? '[]': o.button;
        o.session = (typeof o.session == 'undefined') ? 0: o.session;
        o.cookieName = (typeof o.cookieName == 'undefined') ? 'couponPopUp': o.cookieName;
        o.pageName = (typeof o.pageName == 'undefined') ? '[]': o.pageName;
        o.pageCriteria = (typeof o.pageCriteria == 'undefined') ? '[]': o.pageCriteria;
        return o;
    },
    //calculate Page Height
    pageHeight: function()
    {
        var D = document;
        return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight)
        );
    },
    //page overlay
    createBackgroundOverlay: function(id, color)
    {
        var overlayDiv = document.createElement('div');
        overlayDiv.setAttribute('id', id);
        overlayDiv.style.display = 'block';
        overlayDiv.style.position = 'absolute';
        overlayDiv.style.top = '0';
        overlayDiv.style.left = '0';
        overlayDiv.style.width = '100%';
        overlayDiv.style.height = this.pageHeight() + 'px';
        overlayDiv.style.backgroundColor = color;
        overlayDiv.style.zIndex = '9998';
        overlayDiv.style.opacity = '0.8';
        overlayDiv.style.filter = 'alpha(opacity=80)';
        document.body.appendChild(overlayDiv);
    },
    //Add Button to Coupon
    couponButton: function(button, pId1, pId2)
    {
        if (typeof button == 'undefined') return false;
        var buttonDiv = document.createElement('div');
        if (button.id == 'coupon')
        {
            buttonDiv.setAttribute('id', 'couponBtn');
        }
        else
        {
            buttonDiv.setAttribute('id', button.id);
        }
        buttonDiv.setAttribute('alt', button.title);
        buttonDiv.setAttribute('title', button.title);
        if (button.image > '')
        {
            buttonDiv.style.backgroundImage = 'url("' + button.image + '")';
        }
        buttonDiv.style.width = button.width + 'px';
        buttonDiv.style.height = button.height + 'px';
        buttonDiv.style.cursor = 'pointer';
        buttonDiv.style.position = 'absolute';
        buttonDiv.style.dislay = 'block';
        if (button.top > 0) buttonDiv.style.top = button.top + 'px';
        if (button.right > 0) buttonDiv.style.right = button.right + 'px';
        if (button.bottom > 0) buttonDiv.style.bottom = button.bottom + 'px';
        if (button.left > 0) buttonDiv.style.left = button.left + 'px';
        buttonDiv.style.zIndex = '2';
        buttonDiv.onclick = function()
        {
            //ContentManagement: https://github.com/m-as/contentManagment.git
            if (typeof pId2 != 'undefined') ContentManagement.removeElementByID(pId2);
            if (typeof pId1 != 'undefined') ContentManagement.removeElementByID(pId1);
            if (button.href > '')
            {
                if (button.target == 'blank')
                {
                    window.open(button.href);
                }
                else
                {
                    window.location = button.href;
                }
            }
        };
        if (typeof pId1 != 'undefined')
        document.getElementById(pId1).appendChild(buttonDiv);
    },
    //checks cookie for coupon pop-up ( session cookie)
    popUpCookie: function(cookieName)
    {
        //ContentManagement: https://github.com/m-as/contentManagment.git
        var value = ContentManagement.readCookie(cookieName);
        if (value === null || value === 0)
        {
            DealerOn_Coupon.createCookie(cookieName, '1');
            return false;
        }
        else {
            return true;
        }
    },
    //check file name to match page condition for pop-up
    pageCheck: function(name)
    {
        var path = window.location.pathname;
        var filename = path.match(/.*\/([^/]+)\.([^?]+)/i)[1];
        if (filename == name)
        {
            return true;
        }
        else
        {
            return false;
        }
    },
    //only displaycoupon if field-value pair is passed in the query string is matching
    criteriaCheck: function(value)
    {
        var result = false;
        var c = eval(value);
        var name = c.n.toLowerCase();
        var value = c.v.toLowerCase();
        //ContentManagement: https://github.com/m-as/contentManagment.git
        if (ContentManagement.ParameterByName(name).toLowerCase() == value)
        {
            result = true;
        }
        return result;
    },
    //Generates the html code for the coupon
    createCoupon: function(coupon)
    {
        if (coupon.session)
        {
            if (this.popUpCookie(coupon.cookieName)) return false;
        }
        var p = eval(coupon.pageName);
        var activate = true;
        if (p.length > 0) activate = false;
        for (var i = 0; i < p.length; i++)
        {
            if (!activate)
            {
                activate = this.pageCheck(p[i]);
            }
        }
        if (!activate) return false;

        //-------------
        p = eval(coupon.pageCriteria);
        activate = true;
        if (p.length > 0) activate = false;
        for (var i = 0; i < p.length; i++)
        {
            if (!activate) {
                activate = this.criteriaCheck(p[i]);
            }
        }
        if (!activate) return false;
        var couponDiv = document.createElement('div');
        couponDiv.setAttribute('id', coupon.id);
        couponDiv.style.dislay = 'none';
        couponDiv.style.position = 'absolute';
        if (coupon.top > 0)
        {
            couponDiv.style.top = coupon.top + 'px';
        }
        else
        {
            if (parseInt(this.pageHeight()) > 800)
            {
                couponDiv.style.top = '10%';
            }
            else
            {
                couponDiv.style.top = '25%';
            }
        }
        if (coupon.left > 0)
        {
            couponDiv.style.left = coupon.left + 'px';
        }
        else
        {
            couponDiv.style.left = '25%';
        }
        couponDiv.style.zIndex = '99999';
        couponDiv.style.backgroundColor = '#fff';
        if (coupon.image > '')
        {
            couponDiv.style.backgroundImage = 'url("' + coupon.image + '")';
        }
        couponDiv.style.width = coupon.width + 'px';
        couponDiv.style.height = coupon.height + 'px';
        if (coupon.close)
        {
            var closeDiv = document.createElement('div');
            closeDiv.setAttribute('id', 'closeForm');
            closeDiv.setAttribute('alt', 'Close');
            closeDiv.setAttribute('title', 'Close');
            closeDiv.style.backgroundImage = 'url(images/close.png)';
            closeDiv.style.width = '27px';
            closeDiv.style.height = '31px';
            closeDiv.style.cursor = 'pointer';
            closeDiv.style.position = 'absolute';
            closeDiv.style.dislay = 'block';
            closeDiv.style.top = '-7px';
            closeDiv.style.right = '-5px';
            closeDiv.style.zIndex = '2';
            couponDiv.appendChild(closeDiv);
            closeDiv.onclick = function()
            {
                //ContentManagement: https://github.com/m-as/contentManagment.git
                ContentManagement.removeElementByID(coupon.id);
                if (coupon.overlay)
                {
                    //ContentManagement: https://github.com/m-as/contentManagment.git
                    ContentManagement.removeElementByID(coupon.overlayId);
                }
                if (coupon.href > '')
                {
                    if (coupon.target == 'blank')
                    {
                        window.open(coupon.href);
                    }
                    else
                    {
                        window.location = coupon.href;
                    }
                }
            };
        }
        if (coupon.content > '')
        {
            var contentDiv = document.createElement(coupon.contentTag);
            contentDiv.setAttribute('id', coupon.contentId);
            contentDiv.innerHTML = coupon.content;
            couponDiv.appendChild(contentDiv);
        }
        if (coupon.overlay)
        {
            this.createBackgroundOverlay(coupon.overlayId, coupon.overlayColor);
            if (coupon.overlayClose)
            {
                document.getElementById(coupon.overlayId).onclick = function()
                {
                    //ContentManagement: https://github.com/m-as/contentManagment.git
                    ContentManagement.removeElementByID(coupon.id);
                    ContentManagement.removeElementByID(coupon.overlayId);
                    if (coupon.overlayHref > '')
                    {
                        if (overlayTarget.target == 'blank')
                        {
                            window.open(overlayTarget.overlayHref);
                        }
                        else
                        {
                            window.location = overlayTarget.overlayHref;
                        }

                    }
                };
            }
        }
        document.body.appendChild(couponDiv);
        var b = eval(coupon.button);
        for (var i = 0; i < b.length; i++)
        {
            this.couponButton(b[i], coupon.id, coupon.overlayId);
        }
    }
};
