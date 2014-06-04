'use strict';

window.JT2html=(
    JSON = [],
    complete = -> ,
    template = 
        body :
            """
            <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                @{title}
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    @{list}
                    @{link}
                </div><!-- /.navbar-collapse -->
            </nav>
            """
        title :
            """
            <div id="@{id}" class="navbar-header @{class}">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="\#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <div id="nav_title_bg" class="hidden-xs" style="height:50px">
                    <a class="hidden-xs navbar-brand" href="@{href}" title="@{info}">@{text}</a>
                </div>
                
                
                <a class="navbar-brand visible-xs" href="@{href}">@{text}</a>
                <p class="navbar-text visible-xs">@{info}</p>
            </div>


            """
        list :
            """
            <ul id="@{id}" class="nav navbar-nav @{class}">
                <li class="dropdown">
                    <a href="@{href}" class="dropdown-toggle" data-toggle="dropdown">@{text}<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        @{}
                    </ul>
                </li>
            </ul>
            """
        link :
            """
            <ul id="@{id}" class="nav navbar-nav @{class}">
                <li><a href="@{href}" target="_blank">@{text}</a></li>
            </ul>
            """
        "" :
            """
            <li id="@{id}" class="@{class}"><a href="@{href}">@{text}</a></li>
            """
    ,
    config = {},
    dontFireAtOnce = false
    ) ->

    instance = {
        JSON : JSON
        template : template
        config :
            JsonResolver : (aData) -> { [i.replace("gsx$",""), v[\$t]] for i, v of aData when (i.substr(0,4) is "gsx$") }
            info : off
            root : \body
            defaultValue :
                href : \#
    }

    config = instance.config <<<< config

    JSON = instance.JSON

    pattern = /@\{(\w*)\}/
    defaultValue = instance.config.defaultValue
    JsonResolver = instance.config.JsonResolver

    errSignal = \JT2htmlERROR

    # functions -----------

    genHTML = (navData) ->
        funTitle = \genHTML
        info "generating HTML...",funTitle
        instance.pool = {}
        pool = instance.pool
        templateS = instance.template
        ik = navData.length
        while ((--ik) >= 0) =>
            tmp = JsonResolver navData[ik]
            type = tmp[\type]+""
            delete tmp[\type]

            # info tmp
            template = templateS[type] or errSignal
            if template is errSignal =>
                warn "type:\"#type\" is not defined!",funTitle
            else
                info "type:\"#type\" is going to be processd...",funTitle
                
                for jk of tmp =>
                    pool[jk] = tmp[jk] + (pool[jk] or "")
                pool[type] = genContext(template) + (pool[type] or "")
                # info pool[""]
            # info pool
        
        type = instance.config.root
        template = templateS[type] or errSignal
        if template is errSignal =>
            warn "root type:\"#type\" is not defined!",funTitle
        else
            info "data collection done, generating root:\"#type\"",funTitle
        genContext(template)

    genContext = (template) ->
        funTitle = \genContext
        pool = instance.pool
        context = template+""
        touched = []

        while r = context.match pattern  =>
            touched.push r[1]

            context = context.substring(0,r.index) + (pool[r[1]] or defaultValue[r[1]] or "" ) + context.substring(r.index+r[0].length)

        for k,v of touched => pool[v] = ""

        context

    appendToBody = (HTML) ->
        info "appending HTML to body..."
        body = (document.getElementsByTagName \body)[0] .innerHTML
        (document.getElementsByTagName \body)[0] .innerHTML = HTML + body
        \done

    info = 
        if (instance.config.info and console.log) 
            then ((msg,title) -> if title then console.log "[ JT2html:#title ] => #msg" else console.log msg) 
            else (->)

    warn = ((msg,title) -> if title then console.log "[ JT2html:#title ] => #msg" else console.log msg)

    # main (fire) -----------
    
    instance.fire = ->
        funTitle = \start

        info "JT2html fired",funTitle
        
        HTML = genHTML JSON

        ToAppend = -> appendToBody HTML

        if not (complete ToAppend) then ToAppend!

    if not dontFireAtOnce then instance.fire!

    info "JT2html instance:"
    info instance

    instance
