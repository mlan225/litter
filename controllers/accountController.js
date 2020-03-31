var User = require('../models/user');

function getAccountInfo(follow) {

  console.log(follow)

  return new Promise(resolve => {
    User.findOne({'_id': follow}, function(err, userFound){
      if(err) return console.log(err)
      if(!userFound) return;

      resolve({
        _id: userFound._id,
        handle: userFound.handle,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        profile_image: userFound.profile_image,
        short_id: userFound.short_id
      })
    })
  })
}

module.exports = {
  getAccountInfo
}