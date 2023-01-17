// ==UserScript==
// @name         Bitvest Chat Alerts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Notify the user when a particular user chats on bitvest.io
// @author       CttCJim
// @match        https://bitvest.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitvest.io
// @grant        GM_notification
// @require https://code.jquery.com/jquery-3.6.3.min.js
// ==/UserScript==

(function() {
    'use strict';
    //get names
    const namelist = [ //list of names to watch for; not case-sensitive
        'promo',
        'zodiac',
        'lightlord'
    ];
    //var me = document.getElementsByClassName("self-username")[0].innerHTML;
    //-----------------------------------
    function getLastMsg(highest=0) {
    //get most recent chat DM
        var allchats = document.getElementsByClassName("msg");
        for(var i=0;i<allchats.length;i++) {
            //get index
            var thisid = allchats[i].id.replace('chat_','');
            //var senderlink = msgbox.firstChild.href.split("#");
            if(Number(thisid)>highest){
                highest=Number(thisid);
            }
        }
        //now we have the number of the most recent PM
        return highest;
    }
    var oldhighest = getLastMsg();
    setInterval(function(){
        if(oldhighest==0){return;}
        var newhighest = getLastMsg();
        if(document.hasFocus()) {
            oldhighest=newhighest;
            return;
        } //abort if you are already in the window
        if(oldhighest==newhighest) {return;}
        var allchats = document.getElementsByClassName("msg");
        for(var i=oldhighest+1;i<=newhighest;i++) {
            //check message
            if(typeof(document.getElementById("chat_"+i))=="undefined") {continue;} //if chat message doesnt exist (ie this index was in a channel you dont have access to)
            if(document.getElementById("chat_"+i)==null) {continue;} //if chat message doesnt exist (ie this index was in a channel you dont have access to)
            var msgbox = document.getElementById("chat_"+i);
            var firsttag = msgbox.getElementsByTagName('a')[0];
            var senderlink = firsttag.href.split("#");
            var sendername = senderlink[senderlink.length-1].split(",")[1];
            sendername = sendername.replace("[TIP]%20"," ");//.toLowerCase()
            for(var j=0;j<namelist.length;j++) {
                var thisname = namelist[j].toLowerCase();
                if(thisname==sendername.toLowerCase()) {
                    var msgtext = "";
                    if(msgbox.getElementsByClassName('pm-body').length>0) {
                        msgtext = msgbox.getElementsByClassName('pm-body')[0].innerHTML;
                    } else {
                        //remove username and present the text content
                        msgtext = msgbox.textContent.split(": ");
                        msgtext.shift();
                        msgtext = msgtext.join(": ");
                    }
                    //forward the message to GM_notifiction
                    GM_notification({
                        text: msgtext,
                        title: "New Chat from "+sendername,
                        onclick: () => {/*alert('Message clicked')*/}
                    });
                }
            }
        }
        oldhighest=newhighest;
    },1000);
})();
