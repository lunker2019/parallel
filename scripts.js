/* (c) Parallel Project, 2017 */

"use strict";function ready(){function a(){document.querySelector("#body").style.display="block",document.querySelector("footer").style.display="block"}function b(b){return b?(d.ref("users/"+b.uid).once("value").then(function(b){i.user=b.toJSON(),a(),document.body.scrollTop=document.documentElement.scrollTop=0})["catch"](function(a){console.log(a)}),void(h&&d.ref("answers/"+c.currentUser.uid+"/"+h).once("value").then(function(a){var b=a.toJSON(),c=!0,d=!1,e=void 0;try{for(var f,g=Object.keys(b)[Symbol.iterator]();!(c=(f=g.next()).done);c=!0){var h=f.value;Vue.set(i.answers,h,b[h])}}catch(j){d=!0,e=j}finally{try{!c&&g["return"]&&g["return"]()}finally{if(d)throw e}}}))):a()}var c=(firebase.app(),firebase.auth()),d=firebase.database();c.onAuthStateChanged(b);var e={error:null,school:null,country:"United Kingdom",birthYear:2e3,submit:function(a){a.preventDefault(),e.error=null,c.createUserWithEmailAndPassword(e.email,e.password).then(function(a){i.user={first:e.first,last:e.last,birthYear:e.birthYear,country:e.country,gender:e.gender,school:e.school},d.ref("users/"+a.uid).set(i.user)})["catch"](function(a){switch(a.code){case"auth/email-already-in-use":return e.error="There already exists an account with this email address. Please login!";case"auth/invalid-email":return e.error="The email address you provided is invalid.";case"auth/weak-password":return e.error="Please pick a longer password!";default:return e.error="Sorry, we couldn't create your account. Please try again!"}})}},f={error:null,showDropdown:!1,toggleDropdown:function(){f.showDropdown=!f.showDropdown},submit:function(a){a.preventDefault(),f.error=null,c.signInWithEmailAndPassword(f.email,f.password).then(b)["catch"](function(a){switch(a.code){case"auth/invalid-email":return f.error="This email address is invalid.";case"auth/user-not-found":return f.error="There is no account with this email address.";case"auth/wrong-password":return f.error="Incorrect password!";default:return f.error="Sorry, we couldn't log you in. Please try again!"}})}},g=document.querySelector("#submit"),h=g?g.dataset.challenge:null,i=window.app=new Vue({el:"#body",data:{user:null,toggleAnswers:!1,signup:e,login:f,answers:{submitted:!1},showAnswers:!1,feedback:{},currentChallenge:null,logout:function(){c.signOut().then(function(){i.user=null})},submit:function(){c.currentUser&&(i.answers.submitted=!0,d.ref("answers/"+c.currentUser.uid+"/"+h).set(i.answers))},setAnswer:function(a,b){i.answers.submitted||(Vue.set(i.answers,a,b),c.currentUser&&d.ref("answers/"+c.currentUser.uid+"/"+h).set(i.answers))},refresh:function(){!i.answers.submitted&&c.currentUser&&d.ref("answers/"+c.currentUser.uid+"/"+h).set(i.answers)}}});Array.from(window.document.querySelectorAll(".hint")).forEach(function(a){a.addEventListener("click",function(){a.style.height=a.children[0].offsetHeight+"px"})})}function countdown(a){var b,c=1e3,d=60*c,e=60*d,f=24*e,g=new Date(a),h=new Date,i=g-h;if(i<0)b="any time now";else{var j=Math.floor(i/f),k=Math.floor(i%f/e),l=Math.floor(i%e/d),m=Math.floor(i%d/c),b=j+" days ";b+=k+" hrs ",b+=l+" mins ",b+=m+" secs"}return b}document.addEventListener("DOMContentLoaded",ready);