async function setAccountImage() {

  var randomNum = await generateRandNum();

  account_images = [
    '/assets/img/accountImage1.jpg',
    '/assets/img/accountImage2.jpg',
    '/assets/img/accountImage3.jpg',
    '/assets/img/accountImage4.jpg',
    '/assets/img/accountImage5.jpg',
  ]
  
  return new Promise(resolve => {
    resolve(account_images[randomNum]);
  })
}

function generateRandNum() {
  return new Promise(resolve => {
    resolve(Math.floor(Math.random() * (4 - 0) + 0));
  })
}

module.exports = {
  setAccountImage
}