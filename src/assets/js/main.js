"use strict";
var ApplicationConfiguration = function() {
    var applicationModuleName = "mean", applicationModuleVendorDependencies = ["ngResource", "ngAnimate", "ui.router", "ui.bootstrap", "ui.utils", "d3", "ui.select2"], registerModule = function(moduleName) {
        angular.module(moduleName, []), angular.module(applicationModuleName).requires.push(moduleName)
    };
    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    }
}();
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies), angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider", function($locationProvider) {
    $locationProvider.hashPrefix("!")
}
]), angular.element(document).ready(function() {
    "#_=_" === window.location.hash && (window.location.hash = "#!"), angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName])
}), ApplicationConfiguration.registerModule("core"), ApplicationConfiguration.registerModule("publishers"), ApplicationConfiguration.registerModule("users"), angular.module("core").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/"), $stateProvider.state("home", {
        url: "/",
        templateUrl: "modules/core/views/home.client.view.html"
    })
}
]), angular.module("core").controller("HeaderController", ["$scope", "Authentication", "Menus", function($scope, Authentication, Menus) {
    $scope.authentication = Authentication, $scope.isCollapsed=!1, $scope.menu = Menus.getMenu("topbar"), $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed=!$scope.isCollapsed
    }, $scope.$on("$stateChangeSuccess", function() {
        $scope.isCollapsed=!1
    })
}
]), angular.module("core").controller("HomeController", ["$scope", "Authentication", function($scope, Authentication) {
    $scope.authentication = Authentication
}
]), angular.module("d3", []).factory("d3Service", ["$document", "$q", "$rootScope", function($document, $q, $rootScope) {
    function onScriptLoad() {
        $rootScope.$apply(function() {
            d.resolve(window.d3)
        })
    }
    var d = $q.defer(), scriptTag = $document[0].createElement("script");
    scriptTag.type = "text/javascript", scriptTag.async=!0, scriptTag.src = "lib/d3/d3.min.js", scriptTag.onreadystatechange = function() {
        "complete" === this.readyState && onScriptLoad()
    }, scriptTag.onload = onScriptLoad;
    var s = $document[0].getElementsByTagName("body")[0];
    return s.appendChild(scriptTag), {
        d3: function() {
            return d.promise
        }
    }
}
]), angular.module("core").directive("timelinejs", ["$q", "$http", "$timeout", function($q, $http, $timeout) {
    return {
        restrict: "AE",
        template: '<div id="{{ embedId }}"></div>',
        scope: {
            tarticles: "="
        },
        link: function(scope) {
            function createTimelineData(apiData) {
                function articleToEvent(article) {
                    var event_ = {
                        startDate: article.published,
                        headline: article.title,
                        text: "<p>" + article.description + '</p><p><a href="' + article.url + '">read more...</a><p>',
                        asset: {
                            media: article.image_url.replace("600x300", "280x140"),
                            credit: article.author,
                            caption: ""
                        }
                    };
                    return event_
                }
                var deferred = $q.defer(), timelineDates = [];
                return apiData.forEach(function(article) {
                    timelineDates.push(articleToEvent(article))
                }), deferred.resolve({
                    timeline: {
                        headline: "Timeline",
                        type: "default",
                        text: "Articles",
                        date: timelineDates
                    }
                }), deferred.promise
            }
            function drawTimeline(timelineData) {
                createStoryJS({
                    type: "timeline",
                    embed_id: scope.embedId,
                    hash_bookmark: !0,
                    width: "100%",
                    height: "600",
                    start_at_end: !0,
                    source: timelineData
                })
            }
            scope.embedId = "id" + Math.floor(1e7 * Math.random()), scope.$watch("tarticles", function(newVal) {
                $timeout(function() {
                    scope.tarticles && createTimelineData(newVal).then(drawTimeline)
                }, 0)
            }, !0)
        }
    }
}
]), angular.module("core").directive("trending", ["d3Service", function(d3Service) {
    return {
        restrict: "AE",
        scope: {
            vizdata: "="
        },
        link: function(scope) {
            d3Service.d3().then(function(d3) {
                function render(data) {
                    function findNeighbours(root, scaledX, scaledR, maxR) {
                        var neighbours = [];
                        return root.visit(function(node, x1, y1, x2) {
                            var p = node.point;
                            if (p) {
                                var overlap, x2 = xScale(p.x), r2 = rScale(p.r);
                                overlap = scaledX > x2 ? x2 + r2 + padding >= scaledX - scaledR : scaledX + scaledR + padding >= x2 - r2, overlap && neighbours.push(p)
                            }
                            return x1 - maxR > scaledX + scaledR + padding && scaledX - scaledR - padding > x2 + maxR
                        }), neighbours
                    }
                    function calculateOffset(maxR) {
                        return function(d) {
                            var neighbours = findNeighbours(quadroot, xScale(d.x), rScale(d.r), maxR), n = neighbours.length, upperEnd = 0, lowerEnd = 0;
                            if (n) {
                                for (var j = n, occupied = new Array(n); j--;) {
                                    var p = neighbours[j], hypoteneuse = rScale(d.r) + rScale(p.r) + padding, base = xScale(d.x) - xScale(p.x), vertical = Math.sqrt(Math.pow(hypoteneuse, 2) - Math.pow(base, 2));
                                    occupied[j] = [p.offset + vertical, p.offset - vertical]
                                }
                                for (occupied = occupied.sort(function(a, b) {
                                    return a[0] - b[0]
                                }), lowerEnd = upperEnd = 1 / 0, j = n; j--;)
                                    lowerEnd > occupied[j][0] ? (upperEnd = Math.min(lowerEnd, occupied[j][0]), lowerEnd = occupied[j][1]) : lowerEnd = Math.min(lowerEnd, occupied[j][1])
                            }
                            return d.offset = Math.abs(upperEnd) < Math.abs(lowerEnd) ? upperEnd : lowerEnd
                        }
                    }
                    var randNorm = d3.random.normal(.5, .2);
                    data.forEach(function(d) {
                        d.x = randNorm(), d.r = .5
                    });
                    var h = 600, svg = d3.select("svg").attr("width", "100%").attr("height", h), digits = /(\d*)/, margin = 50, padding = 4, maxRadius = 25, biggestFirst=!1, width = window.getComputedStyle(svg[0][0]).width;
                    width = digits.exec(width)[0];
                    var height = window.getComputedStyle(svg[0][0]).height;
                    height = Math.min(digits.exec(height)[0], width);
                    var baselineHeight = height / 2, xScale = d3.scale.linear().domain([0, 1]).range([margin, width - margin]), rScale = d3.scale.sqrt().domain([0, 1]).range([1, maxRadius]), defs = svg.append("defs"), bubbleLine = svg.append("g").attr("class", "bubbles").attr("transform", "translate(0," + baselineHeight + ")"), tooltip = bubbleLine.append("rect").attr("id", "viz_tooltip").attr("width", "200").attr("height", "50").attr("rx", "4").attr("ry", "4");
                    bubbleLine.append("line").attr("x1", xScale.range()[0]).attr("x2", xScale.range()[1]);
                    var quadtree = d3.geom.quadtree().x(function(d) {
                        return xScale(d.x)
                    }).y(0).extent([[xScale( - 1), 0], [xScale(2), 0]]), quadroot = quadtree([]), maxR = 0;
                    bubbleLine.selectAll("circle").data(data.sort(biggestFirst ? function(a, b) {
                        return b.r - a.r
                    } : function(a, b) {
                        return a.r - b.r
                    })).enter().append("circle").attr("r", function(d) {
                        var r = rScale(d.r);
                        return maxR = Math.max(r, maxR), r
                    }).each(function(d, i) {
                        var scaledX = xScale(d.x);
                        d3.select(this).attr("cx", scaledX).attr("cy", - baselineHeight + margin).transition().delay(10 * i).duration(300).attr("cy", calculateOffset(maxR)), quadroot.add(d), d3.select(this).attr("style", function(d) {
                            var pattern = defs.append("pattern").attr("patternUnits", "userSpaceOnUse").attr("id", d._id).attr("width", 50).attr("height", 25).attr("x", 0).attr("y", 0);
                            return pattern.append("svg:image").attr("xlink:href", d.image_url).attr("width", 60).attr("height", 30), "fill: url(#" + d._id + ")"
                        }).on("mouseover", function(d) {
                            tooltip.attr("x", scaledX).attr("y", d.offset), d3.select("#viz_tooltip").classed("hidden", !1)
                        }).on("mouseout", function() {
                            d3.select("#viz_tooltip").classed("hidden", !0)
                        })
                    })
                }
                render(scope.vizdata)
            })
        }
    }
}
]), angular.module("core").service("Menus", [function() {
    this.defaultRoles = ["user"], this.menus = {};
    var shouldRender = function(user) {
        if (!user)
            return this.isPublic;
        for (var userRoleIndex in user.roles)
            for (var roleIndex in this.roles)
                if (this.roles[roleIndex] === user.roles[userRoleIndex])
                    return !0;
        return !1
    };
    this.validateMenuExistance = function(menuId) {
        if (menuId && menuId.length) {
            if (this.menus[menuId])
                return !0;
            throw new Error("Menu does not exists")
        }
        throw new Error("MenuId was not provided")
    }, this.getMenu = function(menuId) {
        return this.validateMenuExistance(menuId), this.menus[menuId]
    }, this.addMenu = function(menuId, isPublic, roles) {
        return this.menus[menuId] = {
            isPublic: isPublic ||!1,
            roles: roles || this.defaultRoles,
            items: [],
            shouldRender: shouldRender
        }, this.menus[menuId]
    }, this.removeMenu = function(menuId) {
        this.validateMenuExistance(menuId), delete this.menus[menuId]
    }, this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
        return this.validateMenuExistance(menuId), this.menus[menuId].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            menuItemType: menuItemType || "item",
            menuItemClass: menuItemType,
            uiRoute: menuItemUIRoute || "/" + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            items: [],
            shouldRender: shouldRender
        }), this.menus[menuId]
    }, this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
        this.validateMenuExistance(menuId);
        for (var itemIndex in this.menus[menuId].items)
            this.menus[menuId].items[itemIndex].link === rootMenuItemURL && this.menus[menuId].items[itemIndex].items.push({
                title: menuItemTitle,
                link: menuItemURL,
                uiRoute: menuItemUIRoute || "/" + menuItemURL,
                isPublic: isPublic || this.menus[menuId].isPublic,
                roles: roles || this.defaultRoles,
                shouldRender: shouldRender
            });
        return this.menus[menuId]
    }, this.removeMenuItem = function(menuId, menuItemURL) {
        this.validateMenuExistance(menuId);
        for (var itemIndex in this.menus[menuId].items)
            this.menus[menuId].items[itemIndex].link === menuItemURL && this.menus[menuId].items.splice(itemIndex, 1);
        return this.menus[menuId]
    }, this.removeSubMenuItem = function(menuId, submenuItemURL) {
        this.validateMenuExistance(menuId);
        for (var itemIndex in this.menus[menuId].items)
            for (var subitemIndex in this.menus[menuId].items[itemIndex].items)
                this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL && this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
        return this.menus[menuId]
    }, this.addMenu("topbar")
}
]), angular.module("publishers").run(["Menus", function() {}
]), angular.module("publishers").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("listPublishers", {
        url: "/publishers",
        templateUrl: "modules/publishers/views/list-publishers.client.view.html"
    }).state("viewPublisher", {
        url: "/publishers/:publisherId",
        templateUrl: "modules/publishers/views/view-publisher.client.view.html"
    }).state("viewPublisher.grid", {
        url: "/posts/grid",
        templateUrl: "modules/publishers/views/articles/grid-articles.client.view.html"
    }).state("viewPublisher.list", {
        url: "/posts/list",
        templateUrl: "modules/publishers/views/articles/list-articles.client.view.html"
    }).state("viewPublisher.trending", {
        url: "/posts/trending",
        templateUrl: "modules/publishers/views/articles/trending-articles.client.view.html"
    }).state("viewPublisher.timeline", {
        url: "/posts/timeline",
        templateUrl: "modules/publishers/views/articles/timeline-articles.client.view.html"
    })
}
]), angular.module("publishers").controller("PublishersController", ["$scope", "$stateParams", "$location", "Authentication", "Publishers", "Follows", "Articles", function($scope, $stateParams, $location, Authentication, Publishers, Follows, Articles) {
    $scope.authentication = Authentication, $scope.isConnectedSocialAccount = function(provider) {
        return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]
    }, $scope.closeAlert = function() {
        $scope.error = null
    }, $scope.find = function() {
        $scope.publishers = Publishers.query()
    }, $scope.findOne = function() {
        $scope.publisher = Publishers.get({
            publisherId: $stateParams.publisherId
        })
    }, $scope.follow = function(index, id) {
        Follows.follow(id).then(function() {
            $scope.publishers[index].following=!0
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.unfollow = function(index, id) {
        Follows.unfollow(id).then(function() {
            $scope.publishers[index].following=!1
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.articleView = "list", Articles.fetch($stateParams.publisherId).then(function(response) {
        $scope.articles = response.data
    }, function(errorResponse) {
        $scope.error = errorResponse.data.message
    }), $scope.loadArticleDetails = function(index) {
        $scope.activeArticle = $scope.articles[index]
    }, $scope.radioModel = "all", $scope.PublisherFilter = function(publisher) {
        return "fav" === $scope.radioModel ? publisher.following===!0 : "!"
    }
}
]), angular.module("publishers").factory("Publishers", ["$resource", function($resource) {
    return $resource("publishers/:publisherId", {
        publisherId: "@_id"
    }, {
        update: {
            method: "PUT"
        }
    })
}
]), angular.module("publishers").factory("Follows", ["$http", function($http) {
    var Follows = function(data) {
        angular.extend(this, data)
    };
    return Follows.follow = function(id) {
        var body = {
            followee_type: "Publisher",
            followee: id
        };
        return $http({
            url: "/follows/",
            data: body,
            method: "post"
        }).then(function(response) {
            return response
        })
    }, Follows.unfollow = function(id) {
        var body = {
            followee_type: "Publisher",
            followee: id
        };
        return $http({
            url: "/follows/",
            data: body,
            method: "PUT"
        }).then(function(response) {
            return response
        })
    }, Follows
}
]), angular.module("publishers").factory("Articles", ["$http", function($http) {
    var Articles = function(data) {
        angular.extend(this, data)
    };
    return Articles.fetch = function(id) {
        return $http({
            url: "/articles/",
            data: id,
            method: "get"
        }).then(function(response) {
            return response
        })
    }, Articles
}
]), angular.module("users").config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push(["$q", "$location", "Authentication", function($q, $location, Authentication) {
        return {
            responseError: function(rejection) {
                switch (rejection.status) {
                case 401:
                    Authentication.user = null, $location.path("signin");
                    break;
                case 403:
                }
                return $q.reject(rejection)
            }
        }
    }
    ])
}
]), angular.module("users").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("profile", {
        url: "/settings/profile",
        templateUrl: "modules/users/views/settings/edit-profile.client.view.html"
    }).state("password", {
        url: "/settings/password",
        templateUrl: "modules/users/views/settings/change-password.client.view.html"
    }).state("accounts", {
        url: "/settings/accounts",
        templateUrl: "modules/users/views/settings/social-accounts.client.view.html"
    }).state("signup", {
        url: "/signup",
        templateUrl: "modules/users/views/signup.client.view.html"
    }).state("signin", {
        url: "/signin",
        templateUrl: "modules/users/views/signin.client.view.html"
    })
}
]), angular.module("users").controller("AuthenticationController", ["$scope", "$http", "$location", "Authentication", function($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication, $scope.authentication.user && $location.path("/"), $scope.signup = function() {
        $http.post("/auth/signup", $scope.credentials).success(function(response) {
            $scope.authentication.user = response, $location.path("/")
        }).error(function(response) {
            $scope.error = response.message
        })
    }, $scope.signin = function() {
        $http.post("/auth/signin", $scope.credentials).success(function(response) {
            $scope.authentication.user = response, $location.path("/")
        }).error(function(response) {
            $scope.error = response.message
        })
    }
}
]), angular.module("users").controller("SettingsController", ["$scope", "$http", "$location", "Users", "Authentication", function($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user, $scope.user || $location.path("/"), $scope.hasConnectedAdditionalSocialAccounts = function() {
        for (var i in $scope.user.additionalProvidersData)
            return !0;
        return !1
    }, $scope.isConnectedSocialAccount = function(provider) {
        return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]
    }, $scope.removeUserSocialAccount = function(provider) {
        $scope.success = $scope.error = null, $http.delete("/users/accounts", {
            params: {
                provider: provider
            }
        }).success(function(response) {
            $scope.success=!0, $scope.user = Authentication.user = response
        }).error(function(response) {
            $scope.error = response.message
        })
    }, $scope.updateUserProfile = function() {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function(response) {
            $scope.success=!0, Authentication.user = response
        }, function(response) {
            $scope.error = response.data.message
        })
    }, $scope.changeUserPassword = function() {
        $scope.success = $scope.error = null, $http.post("/users/password", $scope.passwordDetails).success(function() {
            $scope.success=!0, $scope.passwordDetails = null
        }).error(function(response) {
            $scope.error = response.message
        })
    }
}
]), angular.module("users").factory("Authentication", [function() {
    var _this = this;
    return _this._data = {
        user: window.user
    }, _this._data
}
]), angular.module("users").factory("Users", ["$resource", function($resource) {
    return $resource("users", {}, {
        update: {
            method: "PUT"
        }
    })
}
]);

