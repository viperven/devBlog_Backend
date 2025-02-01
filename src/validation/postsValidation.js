
const validator = require('validator');

const validatePost = (req) => {
    let customError = new Error();

    const { content, image } = req.body;

    if (!content || !image) {
        customError.message = "Content and image is required";
        customError.statusCode = 400;
        throw customError;
    }

    if (!validator.isURL(image)) {
        customError.message = "Invalid URL image url";
        customError.statusCode = 400;
        throw customError;
    }


}


// const validatePostById = (req)=>{

//     let customError = new Error();
    

// }

module.exports = { validatePost };