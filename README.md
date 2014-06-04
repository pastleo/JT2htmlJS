JT2htmlJS
=========

Json + Template => HTML By Javascript
Generate HTML from JSON and Template by Javascript. By default,there is a JSON resolver to get the google sheet data as source to generate HTML.

Usage
===

## JSON solver (source JSON type): Google sheet
For now, I make only one for google sheet JSON. And this is how to use...
 1. add the following line to html file
  
  ```
  <script src="path/to/jt2html.js"></script>
  ```

 2. use jquery.ajax or some way to get the google sheet json data and call JT2html function as following, here use jquery as example:
  ```
  $.ajax({
    url:"https://spreadsheets.google.com/feeds/list/1huBErviY2ehb7duwyI5mOzc9y3Ia5yBFQTvPaTyVfFM/od6/public/values?alt=json",
    success:function(data){
    
      // display the data
      console.log(data);
      
      // simplest way to use,only give the json entry
      jt2html=JT2html(data.feed.entry);
    }
  });
  ```

 3. JT2html function has at most 5 parameters, the following is how they can be used. (also default setting which does the same thing as `Req();` )
  ```
  // not finished
  ```


Using Livescript
===
This js is scripted by Livescript and js file is the compiled result.
check the _src folder and true source file is there
