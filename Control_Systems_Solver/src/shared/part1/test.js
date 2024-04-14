// function isNumber (value){
//     return !isNaN(parseFloat(value)) && isFinite(value);
// }

// function ExpMult(exp1,exp2){
//     if(exp1===0 || exp1==='0' || exp2 ===0 || exp2 ==='0') return 0;
//     if(exp1===1 || exp1==='') return exp2;
//     if(exp2===1 || exp2==='') return exp1;
//     let exp = '';
//     let num = 1;
//     let expn = [exp1,exp2]
//     let negative=false;
//     let flag=false;
//     for(let i=0 ; i<2;i++)
//     {
//         let n = expn[i].length;
//         let value = expn[i];
//         for(let j=0;j<n;j++ )
//         {
//             //console.log("entered here with value:",value[j]);
//             if(value[j]==='-' && n>1 && j===0 && isNumber(value[j+1])){
//                 flag=true;
//                 negative=!negative;
//                 j++;
//             }
//             if (isNumber(value[j]) && (j===0 || flag)){
//                 //console.log("it is a number")
//                 flag = false;
//                 let number='';
//                 number=number.concat(value[j]);
//                 while(j<n-1 && isNumber(value[j+1]))
//                 {
//                     number=number.concat(value[j+1]);
//                     j++;
//                 }
//                 num*=parseFloat(number);
//             }
//             else{
//                 exp=exp.concat(value[j]);
//                 //console.log("it is not and expression is:",exp,"while value is:",value[j])
//             }
//         }
//     }
//     // console.log("num is",num)
//     // console.log("exp is",exp)
//     let result = '';
//     if(negative)
//         num*=-1;
//     if(num===0)
//         result=0;
//     else if(num === -1)
//         result=result.concat('-').concat(exp);
//     else if(num === 1)
//         result=result.concat(exp);
//     else
//         result=result.concat(num).concat(exp);

//     //console.log("mult is: ", path , "with gain:",result);
//     return result;
// }

// function ExpAdd(exp1,exp2){
//     if(exp1==='' || exp1===0 || exp1==='0')
//         return exp2
//     if(exp2==='' || exp2===0 || exp2==='0')
//         return exp1
//     if(isNumber(exp1) && isNumber(exp2))
//         return parseFloat(exp1) + parseFloat(exp2);
//     if(exp2.length>0 && exp2[0]==='-')
//         return exp1+''+exp2;
//     return exp1.concat('+'.concat(exp2));
// }


// function areNonTouching(loop1, loop2) {
//     return !loop1.some(node => loop2.includes(node));
// }


// function findNonTouchingLoopsSets(loops) {
//     let nonTouchingLoops = [];
//     // Initialize nonTouchingLoops with individual loops
//     nonTouchingLoops[0] = loops.map(loop => [loop.sort((a, b) => a - b)]); // index 0 for size 1

//     // Find all sets of non-touching loops
//     for (let size = 2; size <= loops.length; size++) {
//         nonTouchingLoops[size - 1] = []; // Adjust index by -1
//         let uniqueSets = []; // Use a list to track unique sets based on a serialized key

//         // Compare each set of the previous size with every other loop
//         for (let previousSet of nonTouchingLoops[size - 2]) { // Adjust index by -1
//             for (let loop of loops) {
//                 if (previousSet.every(existingLoop => areNonTouching(existingLoop, loop))) {
//                     let newSet = previousSet.concat([loop.sort((a, b) => a - b)]);
//                     newSet.sort((a, b) => a[0] - b[0]); // Sort the new set by the first element of each loop

//                     // Serialize the set to a string for comparison
//                     let key = newSet.map(loop => loop.join(',')).join(';');
//                     if (!uniqueSets.includes(key)) {
//                         uniqueSets.push(key);
//                         nonTouchingLoops[size - 1].push(newSet); // Adjust index by -1
//                     }
//                 }
//             }
//         }
//     }

//     return nonTouchingLoops;
// }

// function calculateLoopGain(graph, loop) {

//     //console.log("-------------------------------------------------------");
//     let n = loop.length;
//     //console.log("length of loop is:",n);
//     let exp = '';
//     let negative=false;
//     let num = 1;
//     let flag = false;
//     for (let i =0;i<n;i++)
//     {
//         let value='';
//         //console.log(loop)
//         if(i<n-1){
//             value = graph[loop[i]][loop[i+1]]
//         }else{
//             value = graph[loop[i]][loop[0]]
//         }
//         //console.log("value is",value);
//         let m = value.length;
//         //console.log("length is",m);

//         for(let j=0;j<m;j++ )
//         {
//             //console.log("entered here with value:",value[j]);
//             if(value[j]==='-' && n>1 && j===0 && isNumber(value[j+1])){
//                 flag=true;
//                 negative=!negative;
//                 j++;
//             }
//             if (isNumber(value[j]) && (j===0 || flag)){
//                 //console.log("it is a number")
//                 flag = false;
//                 let number='';
//                 number=number.concat(value[j]);
//                 while(j<m-1 && isNumber(value[j+1]))
//                 {
//                     number=number.concat(value[j+1]);
//                     j++;
//                 }
//                 num*=parseFloat(number);
//             }
//             else{
//                 exp=exp.concat(value[j]);
//                 //console.log("it is not and expression is:",exp,"while value is:",value[j])
//             }
//         }
//     }
//     let result = '';
//     if(negative)
//         num*=-1;
//     if(num===0)
//         result=0;
//     else if(num === -1)
//         result=result.concat('-').concat(exp);
//     else if(num === 1)
//         result=result.concat(exp);
//     else
//         result=result.concat(num).concat(exp);

//         // exp.split("").sort().join("")
//     //console.log("loop is: ", loop , "with gain:",result);
//     return result;
// }

// function calculateDelta(graph,loops) {
//     let allNonTouchingLoops = findNonTouchingLoopsSets(loops);
//     let delta = 1;
//     let sign = -1;

//     // Iterate over each group of non-touching loops (grouped by size: 1, 2, 3, ...)
//     for (let size in allNonTouchingLoops) {
//         let currentGroup = allNonTouchingLoops[size];
//         let sum = '';

//         // Calculate the sum of products of loop gains for the current group
//         for (let set of currentGroup) {
//             let product = '';
//             for (let loop of set) {
//                 product = ExpMult(product,calculateLoopGain(graph,loop)); // Assuming calculateLoopGain computes the gain of a single loop
//             }
//             sum = ExpAdd(sum,product);
//         }
//         if(sum !== ''){
//             sum = '('+ sum+')';
//             // Add or subtract this sum from delta depending on the size of the group
//             if(sign===-1)
//                 sum = '-'+sum;
//             delta= ExpAdd(delta,sum);
//         }
//         sign *= -1; // Alternate the sign for each group
//     }

//     return delta;
// }



// // console.log(isNumber('-'));
// // console.log(ExpMult('-12','2'));
// // console.log(ExpAdd('-50','-50a'));
// // let v=findNonTouchingLoopsSets([[1,2,3],[4,5,6],[2],[9,7],[19]]);
// // console.log(v);
// // console.log(v.length)
// // console.log(d)
// const graph = [
//     // [null, 's1', null, 's4'],
//     // [null, null, 's2', null],
//     // [null, null, null, 's3'],
//     // [null, null, null, null]
//     [null,'2a1',null,null],
//     [null,null,'10b2','4c'],
//     [null,'5d3','2e','4f'],
//     [null,null,null,null]
// ];
// let v=findNonTouchingLoopsSets([[1,2],[2]]);
// let d = calculateDelta(graph,[]);
// console.log(v);
// console.log(d);
// // console.log(ExpAdd("a","b"))

function convertExpression(expression) {
    // Insert a multiplication symbol between a number or closing parenthesis and an opening parenthesis
    expression = expression.replace(/(\d|\))(\()/g, '$1*$2');
    return expression;
}

// Example usage
let examples = ["8+4(1-(2))", "(1-(6))", "(2)", "3(2+2)", "5x(3+2)"];
examples.forEach(expr => {
    let convertedExpression = convertExpression(expr);
    console.log("Original expression: ", expr);
    console.log("Converted expression:", convertedExpression);

    // Evaluating the expression safely
    try {
        let result = eval(convertedExpression);
        console.log("Result of the expression:", result);
    } catch (error) {
        console.log("Error evaluating the expression:", error.message);
    }
    console.log(); // Add a newline for readability in output
});
