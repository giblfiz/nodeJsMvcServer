//I think there is some great room for currying here...
//perhaps foo = lPreCurry("model.foo")
//or foo_bar = lCurry("model.foo", "Bar")
// then call foo("bar", function(){


//ok, further consideration makes me think the following should happen
// with this lib
// cascades should be able to take variables
// I.E. model(thing).foo(thang), this will also eliminate 
// the need for the variable passes 
// cascades should be able to take a mix of regular cascades
// and async cascades, so regular cascades should be the normal
// . and async ones can be... @?
// allowing for something like
// l("libs.model()@foo().bar()" 
// our original code would look like: 
// var bar = 'bar';
// l("model()@foo(bar)", function(result){ });
// would be nice if you could pass constants in as well
// making int like l("model()@foo('bar')", function(result){});

//should also be able to take functions that pass out more than
// one result, and push those results down to its "children"
//... how to mix them with variables that were passed in?
// perhaps either/or? set a special "as passed" char?


//currently accepts...
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

