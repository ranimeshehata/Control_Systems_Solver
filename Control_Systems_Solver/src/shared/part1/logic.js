import * as math from 'mathjs';
export function convertExpression(expression) {
    expression = expression.replace(/(\d|\))(\()/g, '$1*$2');
    return expression;
}
export function ExpMult(exp1,exp2){
    if(exp1===0 || exp1==='0' || exp2 ===0 || exp2 ==='0') return 0;
    if((exp1===1 || exp1==='' || exp1==="(1)") && exp2!=='') return exp2;
    if((exp2===1 || exp2==='' || exp2==="(1)") && exp1!=='') return exp1;
    if(isNumber(exp1)&&isNumber(exp2)) return exp1*exp2
    let exp = '';
    let num = 1;
    let expn = [exp1+'',exp2+'']
    let negative=false;
    let flag=false;
    // console.log("entering function")
    for(let i=0 ; i<2;i++)
    {
        let n = expn[i].length;
        let value = expn[i];
        // console.log("In function with value",value)
        for(let j=0;j<n;j++ )
        {
            // console.log("entered here with value:",value[j]);
            if(value[j]==='-' && n>1 && j===0 && isNumber(value[j+1])){
                // console.log("toggle flag")
                flag=true;
                negative=!negative;
                j++;
            }
            if (isNumber(value[j]) && (j===0 || flag)){
                // console.log("it is a number")
                flag = false;
                let number='';
                number=number.concat(value[j]);
                // console.log("number is",number)
                while(j<n-1 && isNumber(value[j+1]))
                {
                    number=number.concat(value[j+1]);
                    j++;
                }
                num*=parseFloat(number);
            }
            else{
                exp=exp.concat(value[j]);
                console.log("it is not and expression is:",exp,"while value is:",value[j])
            }
        }
    }
    console.log("num is",num)
    console.log("exp is",exp)
    let result = '';
    if(negative)
        num*=-1;
    if(num===0)
        result=0;
    else if(num === -1 && exp!=='')
        result=result.concat('-').concat(exp);
    else if(num === 1 && exp!=='')
        result=result.concat(exp);
    else
        result=result.concat(num).concat(exp);

    //console.log("mult is: ", path , "with gain:",result);
    return result;
}

export function ExpAdd(exp1,exp2){
    if(exp1==='' || exp1===0 || exp1==='0')
        return exp2
    if(exp2==='' || exp2===0 || exp2==='0')
        return exp1
    if(isNumber(exp1) && isNumber(exp2))
        return parseFloat(exp1) + parseFloat(exp2);
    if(exp2.length>0 && exp2[0]==='-')
        return exp1+''+exp2;
    return exp1.concat('+'.concat(exp2));
}
export function areNonTouching(loop1, loop2) {
    return !loop1.some(node => loop2.includes(node));
}

export function isNumber (value){
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function findAllSimplePaths(graph, startNode, endNode, path = []) {
    const paths = [];
    path = path.concat(startNode);

    if (startNode === endNode) {
        paths.push(path);
        return paths;
    }

    for (let adjacencyIndex = 0; adjacencyIndex < graph[startNode].length; adjacencyIndex++) {
        if (graph[startNode][adjacencyIndex] !== null && !path.includes(adjacencyIndex)) {
            const newPaths = findAllSimplePaths(graph, adjacencyIndex, endNode, path);
            paths.push(...newPaths);
        }
    }
    return paths;
}

export function findLoopsFromNode(graph, startNode, visited = [], path = []) {
    const loops = [];
    path.push(startNode);
    visited[startNode] = true;

    for (let nextNode = 0; nextNode < graph[startNode].length; nextNode++) {
        if (graph[startNode][nextNode] !== null) {
            if (!visited[nextNode]) {
                const newLoops = findLoopsFromNode(graph, nextNode, visited.slice(), path.slice());
                loops.push(...newLoops);
            } else if (path.includes(nextNode)) {
                loops.push(path.slice(path.indexOf(nextNode)));
            }
        }
    }    
    return loops;
}

export function paths_loops(graph, forward_paths, loops) {
    let paths_loops = [];
    let n = graph.length;
    for (let path of forward_paths) {
        let path_loop = [];
        for (let loop of loops) {
            if(areNonTouching(path, loop)){
                path_loop.push(loop);
            }
        } 
        paths_loops.push(path_loop);      
    }
    // console.log("paths loops are",paths_loops, "for",forward_paths,loops)
    return paths_loops;
}

export function calculatePathGain(graph, path) {

    //console.log("-------------------------------------------------------");
    let n = path.length;
    //console.log("length of loop is:",n);
    let exp = '';
    let negative=false;
    let num = 1;
    let flag = false;
    for (let i =0;i<n-1;i++)
    {
    
        let value = graph[path[i]][path[i+1]]+''
        //console.log("value is",value);
        let m = value.length;
        //console.log("length is",m);

        for(let j=0;j<m;j++ )
        {
            //console.log("entered here with value:",value[j]);
            if(value[j]==='-' && n>1 && j===0 && isNumber(value[j+1])){
                flag=true;
                negative=!negative;
                j++;
            }
            if (isNumber(value[j]) && (j===0 || flag)){
                //console.log("it is a number")
                flag = false;
                let number='';
                number=number.concat(value[j]);
                while(j<m-1 && isNumber(value[j+1]))
                {
                    number=number.concat(value[j+1]);
                    j++;
                }
                num*=parseFloat(number);
            }
            else{
                exp=exp.concat(value[j]);
                //console.log("it is not and expression is:",exp,"while value is:",value[j])
            }
        }
    }
    let result = '';
    if(negative)
        num*=-1;
    if(num===0)
        result=0;
    else if(num === -1)
        result=result.concat('-').concat(exp);
    else if(num === 1)
        result=result.concat(exp);
    else
        result=result.concat(num).concat(exp);

    // console.log("path is: ", path , "with gain:",result);
    return result;
}

export function calculateLoopGain(graph, loop) {

    // console.log("-------------------------------------------------------");
    let n = loop.length;
    // console.log("length of loop is:",n);
    let exp = '';
    let negative=false;
    let num = 1;
    let flag = false;
    for (let i =0;i<n;i++)
    {
        let value='';
        // console.log(loop)
        try {
            if(i<n-1){
                value = graph[loop[i]][loop[i+1]]+''
            }else{
                value = graph[loop[i]][loop[0]]+''
            }
        } catch (error) {
            console.log(error.message)
        }
        
        // console.log("value is",value);
        let m = value.length;
        // console.log("length is",m);

        for(let j=0;j<m;j++ )
        {
            // console.log("entered here with value:",value[j]);
            if(value[j]==='-' && n>1 && j===0 && isNumber(value[j+1])){
                flag=true;
                negative=!negative;
                j++;
            }
            if (isNumber(value[j]) && (j===0 || flag)){
                // console.log("it is a number")
                flag = false;
                let number='';
                number=number.concat(value[j]);
                while(j<m-1 && isNumber(value[j+1]))
                {
                    number=number.concat(value[j+1]);
                    j++;
                }
                num*=parseFloat(number);
            }
            else{
                exp=exp.concat(value[j]);
                // console.log("it is not and expression is:",exp,"while value is:",value[j])
            }
        }
    }
    let result = '';
    if(negative)
        num*=-1;
    if(num===0)
        result=0;
    else if(num === -1)
        result=result.concat('-').concat(exp);
    else if(num === 1)
        result=result.concat(exp);
    else
        result=result.concat(num).concat(exp);

        // exp.split("").sort().join("")
    // console.log("loop is: ", loop , "with gain:",result);
    return result;
}

export function calculateDelta(graph,loops) {
    let allNonTouchingLoops = findNonTouchingLoopsSets(loops);
    // console.log("non touching loops are",allNonTouchingLoops)
    for (let i = 0; i < allNonTouchingLoops.length-1; i++) {
        console.log("non touching loops of index",i+1,"are",allNonTouchingLoops[i])
    }
    let delta = 1;
    let sign = -1;
    // Iterate over each group of non-touching loops (grouped by size: 1, 2, 3, ...)
    for (let i = 0; i < allNonTouchingLoops.length-1; i++) {
        // console.log("index is",i)
        let currentGroup = allNonTouchingLoops[i];
        let sum = '';
        // Calculate the sum of products of loop gains for the current group
        for (let set of currentGroup) {
            let product = '';
            for (let loop of set) {
                product = ExpMult(product,calculateLoopGain(graph,loop)); // Assuming calculateLoopGain computes the gain of a single loop
                // console.log("at function and loop gain for this loop",loop,"is",calculateLoopGain(graph,loop),"and product becomes",product)
            }
            sum = ExpAdd(sum,product);
        }
        if(sum !== ''){
            sum = '('+ sum+')';
            // Add or subtract this sum from delta depending on the size of the group
            if(sign===-1)
            sum = '-'+sum;
        delta= ExpAdd(delta,sum);
        }
    // console.log("Entering with",currentGroup,"that has sum",sum,"with index of",i)
        sign *= -1; // Alternate the sign for each group
    }
    console.log("delta for",loops,"is",delta)
    return '('+delta+')';
}


export function findNonTouchingLoopsSets(loops) {
    let nonTouchingLoops = [];
    // Initialize nonTouchingLoops with individual loops
    nonTouchingLoops[0] = loops.map(loop => [loop.sort((a, b) => a - b)]); // index 0 for size 1

    // Find all sets of non-touching loops
    for (let size = 2; size <= loops.length; size++) {
        nonTouchingLoops[size - 1] = []; // Adjust index by -1
        let uniqueSets = []; // Use a list to track unique sets based on a serialized key

        // Compare each set of the previous size with every other loop
        for (let previousSet of nonTouchingLoops[size - 2]) { // Adjust index by -1
            for (let loop of loops) {
                if (previousSet.every(existingLoop => areNonTouching(existingLoop, loop))) {
                    let newSet = previousSet.concat([loop.sort((a, b) => a - b)]);
                    newSet.sort((a, b) => a[0] - b[0]); // Sort the new set by the first element of each loop

                    // Serialize the set to a string for comparison
                    let key = newSet.map(loop => loop.join(',')).join(';');
                    if (!uniqueSets.includes(key)) {
                        uniqueSets.push(key);
                        nonTouchingLoops[size - 1].push(newSet); // Adjust index by -1
                    }
                }
            }
        }
    }
    // console.log("non touching loops are",nonTouchingLoops)
    return nonTouchingLoops;
}

export function solve(graph,inputNode,outputNode,isNumbers){

    // Example usage
    let simplePaths = findAllSimplePaths(graph, inputNode, outputNode);
    let loops = findLoopsFromNode(graph, inputNode)
    console.log("paths are",simplePaths);
    console.log("loops are",loops)
    for(let loop of loops)
    {
        console.log("loop is",loop,"it's gain",calculateLoopGain(graph,loop));
    }
    let loops_paths = paths_loops(graph,simplePaths,loops);
    console.log("paths loops are",loops_paths);
    let denom = calculateDelta(graph,loops);
    console.log("main loop gain",denom)
    let numer = ''
    for(let i=0;i<simplePaths.length;i++){
        console.log("path is",simplePaths[i],"it's gain",calculatePathGain(graph,simplePaths[i]), "its loop",loops_paths[i], "its gain",calculateDelta(graph,loops_paths[i]));
        console.log("the final term will be",ExpMult(calculatePathGain(graph,simplePaths[i]),calculateDelta(graph,loops_paths[i])))
        numer=ExpAdd(numer,ExpMult(calculatePathGain(graph,simplePaths[i]),calculateDelta(graph,loops_paths[i])));
    }
    let numer_number;
    let denom_number;
    console.log("final term numerator",numer);
    if(isNumbers){
        try {
            numer_number = eval(convertExpression(numer));
            console.log("Result of the expression of numerator:", numer_number);
        } catch (error) {
            console.log("Error evaluating the expression:", error.message);
        }
    }
    console.log("-------------------------------------");
    console.log("final term denominator",denom);
    if(isNumbers){
        try {
            denom_number = eval(convertExpression(denom));
            console.log("Result of the expression of denominator:", denom_number);
            console.log("Final value is",math.round(numer_number/denom_number,3))
        } catch (error) {
            console.log("Error evaluating the expression:", error.message);
        }
    }

    return numer+'/'+denom;
}

// // let adjacency_matrix = [
    // //     [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    // //     [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    // //     [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    // //     [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    // //     [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    // //     [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    // //     [0, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    // //     [0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    // //     [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    // //     [0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
    // // ];
    // // let adjacency_matrix2 = [
        // //     [0,1,0,0],
        // //     [0,0,1,1],
        // //     [0,1,1,1],
        // //     [0,0,0,0]
        // // ]
        let graph = [
            //     // [null, 's1', null, 's4'],
            //     // [null, null, 's2', null],
            //     // [null, null, null, 's3'],
            //     // [null, null, null, null]
            //     // -----------------------------
            //     // [null,'a',null,null],
            //     // [null,null,'b','c'],
            //     // [null,'d','e','f'],
            //     // [null,null,null,null]
            //     //-----------------------------
            // [null,1,null,null],
            // [null,null,1,1],
            // [null,null,null,1],
            // [null,null,null,null]
            [-1,5,null],
            [-5,-1,4],
            [null,null,null]
        ];
        let inputNode = 0;
        let outputNode = 2;
        
        // demo to a function call
        console.log(graph, inputNode, outputNode);
        console.log(solve(graph,inputNode,outputNode,true));
        // console.log(findAllSimplePaths(graph,0,2))
        // console.log(ExpMult('-1','-1'))