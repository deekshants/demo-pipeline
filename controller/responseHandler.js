exports.sendResponse=(res, data) =>{
    console.log("sendResponse-->");
    console.log(data);
    res.send({"res" : data});
    res.end();
  }