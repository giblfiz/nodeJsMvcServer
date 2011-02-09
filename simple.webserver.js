var http = require('http');
var fs = require('fs');
var path = require('path');
var ft = require('./filetypes');

var template = require('./templateEngine');

var data = {bla: "foo",
           moo: function(){ 
               return("x");}
           };
var mrs = template.interperate("foobie <%= true ? 't' : 'f' %>", data);

console.log("out:" +  mrs)


http.createServer(function (req, res) {
    var url = req.url.substr(1);
    path.exists("./flatfile/"+url, function(found){
        if(found){
            console.log("flat file");
            respondFile("flatfile/"+url, res);
        } else {
            path.exists("./controler/"+url, function(controlerFound){
                if(controlerFound){
                    console.log("controler");
                    var controler = require("./controler/"+url);
                    var viewVars = controler.main(req);
                    if(viewVars !== false){
                        path.exists("./view/"+url, function(viewFound){
                            if(viewFound){
                                console.log(" & view");
                                respondTpl("view/"+url, viewVars, res);
                            }
                        });
                    }
                } else {
                    path.exists("./view/"+url, function(viewFound){
                        if(viewFound){
                            console.log("just view");
                            respondTpl("view/"+url, {}, res);
                        } else {
                            //no flatfile, no controler, no view
                            respondFile("flatfile/404.html", res);
                        }
                    });
                }//no controler load view

            });
        }//close flatfile search
    });


/*
    } else if(path.exists("controler/"+url) ||
              path.exists("view/"+url)){

    } else if (path.exists("upload/"+url)){

    } else {
        //404
        console.log("404");
        respond("flatfile/404.html", res);
    }

*/

/*
    if (url === 'favicon.ico'){
        res.writeHead(200, {'Content-Type': 'image/x-icon'});
        fs.readFile("flatfile/" + url, function(err,data){
            console.log(err);
            res.end(data);
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(url + '\n');
        fs.readFile(url, function(err,data){
            console.log(err);
            res.end(data);
        });
    }
*/
}).listen(8124, "127.0.0.1");


var respondFile = function(file, res){
    res.writeHead(200, {'Content-Type': ft.ext(file)});
    console.log("responding with:" + file + '\n');
    fs.readFile(file, function(err,data){
        console.log(err);
        res.end(data);
    });
}

var respondTpl  = function(tplPath, data, res){
    res.writeHead(200, {'Content-Type': "text/html"});
    console.log("responding with template:" + tplPath + '\n');
    fs.readFile(tplPath, 'utf8', function(err,tpl){
        console.log(tpl);
        console.log(err);
        try{
            res.end(
                template.interperate(tpl, data));
        } catch(templateError){
            console.log(templateError);
            res.end("Tempalte Error");
        }
    });
}


console.log('Server running at http://127.0.0.1:8124/');


/*
On request:
 1) check for flat-file in flat-file-dir
   --respond with flat-file
 2) check for controler/view combo
   --load controler (if found)
   --run controler.init (if found)
   --return view, with controler results (if found)
 3) check for uploaded file
   --respond with flat-file
*/