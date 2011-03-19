//I think there is some great room for currying here...
//perhaps foo = lPreCurry("model.foo")
//or foo_bar = lCurry("model.foo", "Bar")
// then call foo("bar", function(){


//l("model.foo", "Bar", function(result){

var Loader = function(){
  var loadedModules = {};

  var loader = function(){
    var args = [].splice.call(arguments,0);
    console.log(args);
    var submods = args.shift().split(".");
    console.log("in loader");
    var subLoader = function(target){
      var nextLoad = submods.shift();
      console.log("in subloader... nextLoad is ");
      console.log(nextLoad);

      if (nextLoad !== null){
        if(submods.length === 0){
          console.log("sending args which are:");
          console.log(args);
          target[nextLoad].apply(null,args);
        } else {
          console.log("async Cascading");
          target[nextLoad](subLoader);
        }
      } else {
        if(typeof callback === "function"){
          callback(target);
        }
      }
    }
    subLoader(avalible);
  }//close loader 
  return(loader);
}


var avalible = {

   model: function(callback){
    console.log("in model");
    callback({ 
      foo: function(text,cb){
        console.log("in foo");
        console.log("typeof text is: " + typeof text); 
        console.log("typeof cb is: " + typeof cb); 
        cb("This is foo and " + text);
      },
      sum:function(one, two, cb){
        cb(one + two);
      }
    });
   }
};

var l = Loader();
console.log("typeof l is " + typeof l);

l("model.foo", "bar", function(result){
  console.log("finished!!!");
  console.log("result is "+ result);
  
});

l("model.sum", 6, 4, function(result){
  console.log("sum of 6 and 4 is " + result);
});

