var Identity = function() {};

Identity.create = function(email, password, opts, cb){
  cb(null, {id: 122});
};
 
Identity.open = function(email, password, opts, cb){
    cb(null, {id: 122});
};
 
Identity.isAvailable = function(email, opts, cb){
    cb(null, true);
});
