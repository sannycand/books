(function () {
  'use strict';

  angular
    .module('core')
    .controller('UserController', UserController)
    .controller('IndexController', IndexController)
    .controller('LoginController', LoginController)
    .controller('DashboardController', DashboardController)
    .controller('FeedController', FeedController)
    .controller('ProfileController', ProfileController)
    .controller('ProfileEditController', ProfileEditController)
    .controller('FavoritesController', FavoritesController)
    .controller('RecentActivitiesController', RecentActivitiesController)
    .controller('SocialAuthController', SocialAuthController)
  ;

  function UserController ($scope, AuthService) {
    var self = this;

    self.AuthService = AuthService;
  };

  function RecentActivitiesController ($scope, AuthService) {
    var self = this;
  };

  function IndexController ($scope) {
    var self = this;
  };

  function LoginController ($scope, AuthService) {
    var self = this;

    /* LOGIN FORM
     */
    self.signin = function (data) {
      AuthService.login(data).then(
        function (resp) {
          // successfully logged in
          window.location.href="/";
        },
        function (resp) {
          // error
          console.log(resp);
        }
      );
    };

  }; // END OF LOGIN CONTROLLER

  ///////////////////////////////
  /* SOCIAL ACCOUNT CONTROLLER */
  ///////////////////////////////

  function SocialAuthController () {
    window.location.reload();
  }

  function DashboardController ($scope, AuthService) {
    var self = this;

  };

  function FeedController ($scope, FeedService, AuthService) {
    var self = this;

    self.AuthService = AuthService;
    self.feeds = [];

    self.actionText = {
      add      : "Published a new book",
      update   : "Updated the book",
      follow   : "Followed",
      favorite : "Favorited the book"
    };

    FeedService.feed().then(function (resp) {
      self.feeds = resp.data;
    });

  }; // END OF FEED CONTROLLER

  function SearchController ($scope, ) {
    var self = this;

    
  };

  function ProfileController ($scope, $stateParams, AuthService, BookService) {
    var self = this;

    self._ = _;
    self.AuthService = AuthService;

    self.user = undefined;
    self.books = [];

    /* GET USER DETAILS
     */
    AuthService.detail($stateParams.handle).then(
      function (resp) {
        // successfully retrieved the data
        self.user = resp.data;

        /* GET BOOKS LIST
         */
        BookService.list({author:self.user.id}).then(function (resp) {
          self.books = resp.data;
        });
      },
      function (resp) {
        console.log(resp);
        // error.
        // TODO: redirect to 404 page
      }
    );

    /* follow/unfollow user
     */
    self.follow = function (id) {
      if (_.contains(self.user.fans, self.AuthService.auth.id)) {
        self.user.fans = _.without(self.user.fans, self.AuthService.auth.id);
      } else {
        self.user.fans.push(self.AuthService.auth.id);
      }
      
      AuthService.follow(id);
    };

    self.favorite = function (book) {
      if (_.contains(book.interested, self.AuthService.auth.id)) {
        book.interested = _.without(book.interested, self.AuthService.auth.id);
      } else {
        book.interested.push(self.AuthService.auth.id);
      };

      BookService.favorite(book.id);
    };

  }; // END OF PROFILE CONTROLLER

  function ProfileEditController ($scope, AuthService) {
    var self = this;

    self.AuthService = AuthService;
    self.user = AuthService.auth;

  };

  function FavoritesController ($scope, $stateParams, AuthService, BookService) {
    var self = this;

    self.AuthService = AuthService;

    self.books = [];

    /* GET USER DETAILS
     */
    AuthService.detail($stateParams.handle).then(
      function (resp) {
        // successfully retrieved the data
        self.user = resp.data;

        /* GET BOOKS LIST
         */
        BookService.list({interested__in:self.user.id}).then(function (resp) {
          self.books = resp.data;
        });
      },
      function (resp) {
        console.log(resp);
        // error.
        // TODO: redirect to 404 page
      }
    );

  };

})();