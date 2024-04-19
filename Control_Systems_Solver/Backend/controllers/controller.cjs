// write the rest of the functions here and then put them in module.exports 
// you have access to the chs function by this req.body.chsFunction



const solve = (req, res) => {

    console.log(req.body.chsFunction);
    let chsFunction = req.body.chsFunction;
    let response = {
        chsFunction: chsFunction,
        status: 'Solved'
    };
    res.send(response);
}



module.exports = {
    solve
};