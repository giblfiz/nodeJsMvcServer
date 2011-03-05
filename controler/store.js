var pageFunctions = {
  "/store/catalog": function(req){
    return({saleItem:"blubber"});
  }
}


exports.main = function(req){
  //return({saleItem:"blubber"});
  //  console.log("loading in store: " + req.url);
  //  console.log(pageFunctions);
  if (typeof pageFunctions[req.url] === "function"){
    return(pageFunctions[req.url](req));
  } else if (typeof pageFunctions[req.url] === "object"){
    return(pageFunctions[req.url]);
  } else {
    return({});
  }
}