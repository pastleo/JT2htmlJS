(function(){
    'use strict';
    window.JT2html = function(template, config){
        var defaultConfig, errSignal, genHTML, genContext, info, warn, GSJsonResolver, defaultJsonResolver, JsonResolver, HttpGET;
        var pool;
        if(template === undefined) throw "You must pass some template here, visit https://github.com/chgu82837/JT2htmlJS for the docs";

        config == null && (config = {});
        defaultConfig = {
            info: false,
            root: 'body',
            pattern: /@\{(\w*)\}/,
            defaultValue: {
              href: '#'
            }
        };
        for (var key in defaultConfig) if(typeof config[key] === "undefined") config[key] = defaultConfig[key];

        errSignal = 'JT2htmlERROR';

        genHTML = function(navData){
            var funTitle, templateS, ik, tmp, type, t, jk;
            funTitle = 'genHTML';
            pool = {};
            info("generating HTML...", funTitle);
            templateS = template;
            ik = navData.length;
            while (--ik >= 0) {
                tmp = JsonResolver(navData[ik]);
                type = tmp['type'] + "";
                delete tmp['type'];
                t = templateS[type] || errSignal;
                if (t === errSignal) {
                    warn("type:\"" + type + "\" is not defined!", funTitle);
                } else {
                    info("type:\"" + type + "\" is going to be processd...", funTitle);
                    for (jk in tmp) {
                        pool[jk] = tmp[jk] + (pool[jk] || "");
                    }
                    pool[type] = genContext(t) + (pool[type] || "");
                }
            }
            type = config.root;
            t = templateS[type] || errSignal;
            if (t === errSignal) {
                warn("root type:\"" + type + "\" is not defined!", funTitle);
            } else {
                info("data collection done, generating root:\"" + type + "\"", funTitle);
            }
            return genContext(t);
        };
        genContext = function(template){
            var funTitle, context, touched, r, k, v;
            funTitle = 'genContext';
            context = template + "";
            touched = [];
            while (r = context.match(config.pattern)) {
                touched.push(r[1]);
                context = context.substring(0, r.index) + (pool[r[1]] || config.defaultValue[r[1]] || "") + context.substring(r.index + r[0].length);
            }
            for (k in touched) {
                v = touched[k];
                pool[v] = "";
            }
            return context;
        };
        info = config.info && console.log
            ? function(msg, title){
                if (title) {
                    return console.log("[ JT2html:" + title + " ] => " + msg);
                } else {
                    return console.log(msg);
                }
            } : function(){};
        warn = console.warn ? function(msg, title){
                if (title) {
                    return console.warn("[ JT2html:" + title + " ] => " + msg);
                } else {
                    return console.warn(msg);
                }
            } : function(){};

        GSJsonResolver = function(aData){
            var i, v, results$ = {};
            for (i in aData) {
                v = aData[i];
                if (i.substr(0, 4) === "gsx$") {
                    results$[i.replace("gsx$", "")] = v['$t'];
                }
            }
            return results$;
        };
        defaultJsonResolver = function(a){return a;};
        JsonResolver = defaultJsonResolver;

        HttpGET = function(url,success,fail){
            var funTitle = 'HttpGET';
            info("HttpGET fired", funTitle);

            var ajax;
            var ajaxHandler=function(){
                if ((ajax.readyState==4 && ajax.status==200)||(typeof XDomainRequest != "undefined")) {
                    info('GET success',funTitle);
                    success(ajax.responseText);
                }
                else if(ajax.readyState==4 && ajax.status!=200){
                    warn('GET Failed! status='+ajax.status,funTitle);
                    fail(ajax);
                }
            };

            if (typeof XDomainRequest != "undefined"){
                // code for IE7,8,9
                rs_nav.message("Using XDomainRequest");
                ajax=new XDomainRequest();
                ajax.onload=ajaxHandler;
            }else{
                ajax = new XMLHttpRequest();
                ajax.onreadystatechange=ajaxHandler;
            }

            ajax.open("GET",url,true);
            ajax.send();
        }

        return {
            setJsonResolver: function(modifier){
                JsonResolver = modifier;
            },
            fromJson: function(JSON){
              var funTitle;
              funTitle = 'fromJson';
              info("JT2html fired", funTitle);
              var html = genHTML(JSON);
              JsonResolver = defaultJsonResolver;
              return html;
            },
            fromAjax: function(url,success,fail){
                if(typeof success !== "function") success = function(){};
                if(typeof fail !== "function") fail = function(){};
                var funTitle = 'fromAjax';
                info("JT2html fired", funTitle);

                HttpGET(url,function(data){
                    var gsdata = JSON.parse(data);
                    success(genHTML(gsdata.feed.entry));
                    JsonResolver = defaultJsonResolver;
                },function(ajax){
                    fail(ajax);
                    JsonResolver = defaultJsonResolver;
                });

                return "Use fromAjax.(url,success,fail) callback to get the rendered value!";
            },
            fromGSJson: function(JSON){
              var funTitle = 'fromGSJson';
              JsonResolver = GSJsonResolver;
              info("JT2html fired", funTitle);
              var html = genHTML(JSON);
              JsonResolver = defaultJsonResolver;
              return html;
            },
            fromGS: function(url,success,fail){
                if(typeof success !== "function") success = function(){};
                if(typeof fail !== "function") fail = function(){};
                var funTitle = 'fromGS';
                JsonResolver = GSJsonResolver;
                info("JT2html fired", funTitle);

                HttpGET(url,function(data){
                    var gsdata = JSON.parse(data);
                    success(genHTML(gsdata.feed.entry));
                    JsonResolver = defaultJsonResolver;
                },function(ajax){
                    fail(ajax);
                    JsonResolver = defaultJsonResolver;
                });

                return "Use fromGS.(url,success,fail) callback to get the rendered value!";
            },
        }
    };
}).call(this);
