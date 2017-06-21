// =============================================================================
// Parallel Lines


function ready() {
  const fbApp = firebase.app();
  const fbAuth = firebase.auth();
  const fbDatabase = firebase.database();

  fbAuth.onAuthStateChanged(loadUser);

  // This helps avoid FOUC while the user is loading...
  function show() {
    document.querySelector('#body').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
  }

  function loadUser(user) {
    if (!user) return show();

    fbDatabase.ref('users/' + user.uid).once('value').then(function(u) {
      app.user = u.toJSON();
      show();
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }).catch(function(e) {
      // TODO handle error
      console.log(e);
    });

    if (challengeId) {
      fbDatabase.ref('answers/' + fbAuth.currentUser.uid + '/' + challengeId).once('value')
        .then(answers => {
          let a = answers.toJSON();
          for (let k of Object.keys(a)) Vue.set(app.answers, k, a[k]);
        });
    }
  }

  const signup = {
    error: null,
    school: null,
    country: 'United Kingdom',
    birthYear: 2000,
    submit(e) {
      e.preventDefault();
      signup.error = null;
      // TODO form validation
      fbAuth.createUserWithEmailAndPassword(signup.email, signup.password)
        .then(function(user) {
          app.user = {
            first: signup.first,
            last: signup.last,
            birthYear: signup.birthYear,
            country: signup.country,
            gender: signup.gender,
            school: signup.school
          };
          fbDatabase.ref('users/' + user.uid).set(app.user);
        })
        .then(function() {
          window.location = signup.redirect;
        })
        .catch(function(error) {
          switch(error.code) {
            case 'auth/email-already-in-use':
              return signup.error = 'There already exists an account with this email address. Please login!';
            case 'auth/invalid-email':
              return signup.error = 'The email address you provided is invalid.';
            case 'auth/weak-password':
              return signup.error = 'Please pick a longer password!';
            default:
              return signup.error = 'Sorry, we couldn\'t create your account. Please try again!';
          }
        });
    }
  };

  const login = {
    error: null,
    showDropdown: false,
    toggleDropdown() {
      login.showDropdown = !login.showDropdown;
    },
    submit(e) {
      e.preventDefault();
      login.error = null;
      fbAuth.signInWithEmailAndPassword(login.email, login.password)
        .then(loadUser)
        .catch(function(error) {
          switch(error.code) {
            case 'auth/invalid-email':
              return login.error = 'This email address is invalid.';
            case 'auth/user-not-found':
              return login.error = 'There is no account with this email address.';
            case 'auth/wrong-password':
              return login.error = 'Incorrect password!';
            default:
              return login.error = 'Sorry, we couldn\'t log you in. Please try again!';
          }
        });
    }
  };

  const submit = document.querySelector('#submit');
  const challengeId = submit ? submit.dataset.challenge : null;

  const app = window.app = new Vue({
    el: '#body',
    data: {
      user: null,
      toggleAnswers: false,
      signup,
      login,
      answers: {submitted: false},
      showAnswers: false,
      feedback: {},
      currentChallenge: null,
      logout() {
        fbAuth.signOut().then(() => { app.user = null; })
      },
      submit() {
        if (!fbAuth.currentUser) return;
        app.answers.submitted = true;
        fbDatabase.ref('answers/' + fbAuth.currentUser.uid + '/' + challengeId)
          .set(app.answers);
      },
      setAnswer(key, value) {
        if (app.answers.submitted) return;
        Vue.set(app.answers, key, value);
        if (fbAuth.currentUser) {
          fbDatabase.ref('answers/' + fbAuth.currentUser.uid + '/' + challengeId)
            .set(app.answers);
        }
      },
      refresh() {
        if (app.answers.submitted || !fbAuth.currentUser) return;
        fbDatabase.ref('answers/' + fbAuth.currentUser.uid + '/' + challengeId)
          .set(app.answers);
      }
    }
  });

  // TODO Save hint state to db

  Array.from(window.document.querySelectorAll('.hint')).forEach(hint => {
    hint.addEventListener('click', function() {
      hint.style.height = hint.children[0].offsetHeight + 'px';
    });
  });
}

document.addEventListener('DOMContentLoaded', ready);


function countdown(deadline) {
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var end = new Date(deadline);
  var now = new Date();
  var distance = end - now;

  var string;
  if (distance < 0) {
    string = "any time now";
  } else {
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);
    var string = days + ' days ';
    string += hours + ' hrs ';
    string += minutes + ' mins ';
    string += seconds + ' secs';
  }
  return string;
}