JT2htmlJS
=========

Json + Template => HTML By Javascript  
Generate HTML from JSON and Template by Javascript. By default,there is a JSON resolver to get the google sheet data as source to generate HTML.  

> This document is very simple I know, but I might improve it ... when I have time ...  

## Basic Usage

First, include the engine of course.  

 ```html
 <script src="path/to/jt2html.js"></script>
 ```

### Create a JT2htmlJS instance with your desired template

```js
var jt = JT2html({
    body: "@{title}:@{list}",
    title: "@{text}",
    list: "[@{name}]: @{des} ... ",
});
```

The `@{some_variable}` will be replace to the other key or your string in json.  

### Pass a json into it, get the HTML back and paste it to your DOM

```js
    var html = jt.fromJson([
        {
            "type":"title",
            "text":"JT2HTML DEMO 1"
        },
        {
            "type":"list",
            "name":"hello1",
            "des":"1234567890"
        },
        {
            "type":"list",
            "name":"hello2",
            "des":"ABCD"
        }
    ]);

    jQuery('#test').text(html);
```

The `html` variable will be `JT2HTML DEMO 2:[hello1]: 1234567890 ... [hello2]: ABCD ...`  

### use Google sheet as json source

 * [Go to google get your google sheet published, so as the url, click me if you don't know how to.](https://gist.github.com/chgu82837/83dd10813d82048dbe9e)
 * Use the follow code to generate a html from your google sheet.

  ```js
  var jt = JT2html(template);
  jt.fromGS(GS_url,function(HTML){
    var body = document.getElementsByTagName('body')[0].innerHTML;
    document.getElementsByTagName('body')[0].innerHTML = HTML + body;
  });
  ```

### JT2htmlJS API

 * `JT2html(template,config)`: JT2html instance constructor
 * `.fromJson(JSON)`: generate a HTML from a json
 * `.fromGSJson(JSON)`: generate a HTML from a Google sheet Json (`json.feed.entry` object)
 * `.fromGS(url,success,fail)`: generate a HTML from a `Google sheet url`, you need to assign a callback to get the HTML result (like example above)
 * `.fromAjax(url,success,fail)`: generate a HTML from a `Json url`, you need to assign a callback to get the HTML result (like example above)
 * `.setJsonResolver(modifier)`: set your own JsonResolver

### About config

The config object can be like below, they are default value for this engine.  

```js
{
  // info is a boolean, true then enable all debug message
  info: false,

  // root type name, this will be introduce later in Template + JSON => HTML section.
  root: 'body',

  // pattern is the replacement in your template, this is a regex
  pattern: /@\{(\w*)\}/,

  // defaultValue for a variable, this will be introduce later in Template + JSON => HTML section.
  defaultValue: {
    href: '#'
  }
}
```

Template + JSON => HTML
===

 * genHTML function:
![genHTML function](https://raw.github.com/chgu82837/JT2htmlJS/master/_readmeImg/jt2html_genHTML.png)

 * genContext function:
![genContext function](https://raw.github.com/chgu82837/JT2htmlJS/master/_readmeImg/jt2html_genContext.png)
