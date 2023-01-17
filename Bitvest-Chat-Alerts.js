// ==UserScript==
// @name         Bitvest PM Notifier
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Notify the user when a PM is received on bitvest.io
// @author       CttCJim
// @match        https://bitvest.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitvest.io
// @grant        GM_notification
// @require https://code.jquery.com/jquery-3.6.3.min.js
// ==/UserScript==

(function() {
    'use strict';
    //get name
    var me = document.getElementsByClassName("self-username")[0].innerHTML;
    //-----------------------------------
    function getLastMsg(highest=0) {
    //get most recent chat DM
        var allchats = document.getElementsByClassName("pm-body");
        for(var i=0;i<allchats.length;i++) {
            //get parent
            var parentbox = allchats[i].parentElement;
            //check sender != me
            var firsttag = parentbox.getElementsByTagName('a')[0];
            //var senderlink = msgbox.firstChild.href.split("#");
            var senderlink = firsttag.href.split("#");
            var sendername = senderlink[senderlink.length-1].split(",")[1]; //gets username, aka RainBot
            if(sendername==me) {continue;} else {
                var thisid = parentbox.id.replace("chat_","");
                if(Number(thisid)>highest){
                    highest=Number(thisid);
                }
            }
        }
        //now we have the number of the most recent PM
        return highest;
    }
    var oldhighest = 0;
    setInterval(function(){
        var newhighest = getLastMsg(oldhighest); //get most recent PM's index
        if(document.hasFocus()) {
            oldhighest=newhighest;
            return;
        } //abort if you are already in the window
        if(oldhighest==0) { //script just started; initialize and don't alert
            oldhighest=newhighest;
            //do nothing
        }
        if(oldhighest!=newhighest) { //latest message is a new one
            oldhighest=newhighest;
            //get the message
            var msgbox = document.getElementById("chat_"+newhighest);
            //var msgtext = msgbox.lastChild.innerHTML;
            var msgtext = msgbox.getElementsByClassName('pm-body')[0].innerHTML;
            var firsttag = msgbox.getElementsByTagName('a')[0];
            //var senderlink = msgbox.firstChild.href.split("#");
            var senderlink = firsttag.href.split("#");
            var sendername = senderlink[senderlink.length-1].split(",")[1];
            sendername = sendername.replace("%20"," ");
            //forward the message to GM_notifiction
            GM_notification({
                text: msgtext,
                title: "New Message from "+sendername,
                onclick: () => {/*alert('Message clicked')*/}
            });
        }
    },1000);
})();
