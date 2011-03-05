// Based on 
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var cache = {};

exports.interperate = function tmpl(str, data){
     var fn =       
          new Function("obj",
                       "var p=[],print=function(){p.push.apply(p,arguments);};" +
        
                       // Introduce the data as local variables using with(){}
                       "with(obj){p.push('" +
                       
                       // Convert the template into pure JavaScript
                       str
                       .replace(/[\r\t\n]/g, " ")
                       .split("<%").join("\t")
                       .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                       .replace(/\t=(.*?)%>/g, "',$1,'")
                       .split("\t").join("');")
                       .split("%>").join("p.push('")
                       .split("\r").join("\\'")
                       + "');}return p.join('');");
      
      // Provide some basic currying to the user
      console.log("fn is a " + typeof fn);
      return data ? fn( data ) : fn;
};
