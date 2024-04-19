<template>
  <div class="container">
    <!-- Input sections for adding nodes and edges -->
    <div class="input-section">
      <div class="node-input-section">
        <label class="label">Add Node:</label>
        <input type="text" v-model="newNode" placeholder="Node name" class="node-input">
        <button @click="addNode" class="custom-button">Add</button>
      </div>
      <div class="edge-input-section">
        <label class="label">Add Edge:</label>
        <input type="text" v-model="sourceNode" placeholder="Source node" class="node-input">
        <input type="text" v-model="targetNode" placeholder="Target node" class="node-input">
        <input type="number" v-model.number="edgeWeight" placeholder="Edge weight" class="weight-input">
        <button @click="addEdge" class="custom-button">Add</button>
      </div>
      <div class="t-f-input-section">
        <label class="label">Transfer Function:</label>
        <input type="text" v-model.number="startNode" placeholder="Starting Node" class="node-input">
        <input type="text" v-model.number="endNode" placeholder="Ending Node" class="node-input">
        <button @click="calculateTransferFunction(true)" class="custom-button">Calculate</button>
      </div>
    </div>
    <div ref="graph" class="graph"></div>
    <div class="output-section">
      <h3>Forward Pathes: 
        <li v-for="i in Array.from({ length: simplePaths.length }, (value, index) => index)">
          {{ simplePaths[i] }} = {{ simplePathsGain[i] }}
        </li>
      </h3>

      <h3>Indevedual Loops: 
        <li v-for="i in Array.from({ length: loops.length }, (value, index) => index)">
          {{ loops[i] }} = {{ loopsGain[i] }}
        </li>
      </h3>

      <h3>NonTouching Loops: 
        <li v-for="loop in nonTouchingLoops">
          {{ loop }}
        </li>
      </h3>

      <h3>Δ: 
        {{ Δ }}
      </h3>

      <h3>Δm: 
        <ol>
          <li v-for="delta in Δm">
            {{ delta }}
          </li>
        </ol>
      </h3>

      <h3>Final value: {{ finalValue }}</h3>
    </div>
  </div>
</template>

<script>
import * as logic from '../shared/part1/logic.js'
import Viz from 'viz.js';
import { Module, render } from 'viz.js/full.render.js';
export default {
  data() {
    return {
      newNode: '',
      sourceNode: '',
      targetNode: '',
      edgeWeight: 1,
      realtions: `A;`,
      digraph: '',
      adjacencyMatrix: [],
      deltas: [],
      forwardPaths: [],
      loops: [],
      transferFunction: 0,
      startNode: '',
      endNode: '',
      simplePaths: [],
      simplePathsGain: [],
      loops: [], 
      loopsGain: [],
      finalValue: 0,
      nodes: {"A":0},
      nodesCount: 1,
      nonTouchingLoops: [],
      Δ: 0,
      Δm: []
    };
  },
  mounted() {
    this.digraph = `digraph {
      ${this.realtions}
    }`;
    this.renderGraph();
  },
  methods: {
    renderGraph() {
      const viz = new Viz({ Module, render });
      viz.renderSVGElement(this.digraph)
        .then(element => {
          this.$refs.graph.innerHTML = '';
          this.$refs.graph.appendChild(element);
        })
        .catch(error => {
          console.error('Error rendering graph:', error);
        });
    },
    addNode() {
      this.nodes[this.newNode] = this.nodesCount;
      this.nodesCount++;
      if (this.newNode.trim() === '') return;
      this.realtions += `\n${this.newNode};`;
      this.updateGraph();
      
      this.newNode = '';
    },
    addEdge() {
      if (this.sourceNode.trim() === '' || this.targetNode.trim() === '') return;
      const edge = `${this.sourceNode} -> ${this.targetNode}`;
      this.realtions += `\n${edge}[label="${this.edgeWeight}"];`;
      this.updateGraph();
      this.sourceNode = '';
      this.targetNode = '';
      this.edgeWeight = 1
    },
    updateGraph() {
      this.digraph = `digraph {
        ${this.realtions}
      }`;
      this.renderGraph();
      this.computeAdjacencyMatrix();
    },
    computeAdjacencyMatrix() {
      const nodes = new Set();
      this.realtions.match(/(\w+) ->/g).forEach(match => {
        nodes.add(match.split(' ')[0]);
      });
      this.realtions.match(/-> (\w+)/g).forEach(match => {
        nodes.add(match.split(' ')[1]);
      });
      console.log(nodes);
      // create an adjacency matrix
      this.adjacencyMatrix = Array.from(nodes).map(source => {
        return Array.from(nodes).map(target => {
          const edge = `${source} -> ${target}`;
          const match = this.realtions.match(new RegExp(`${edge}\\[label="(.+)"\\];`));
          return match ? parseInt(match[1]) : 0;
        });
      });
      console.log(this.adjacencyMatrix);
      this.updateMatrix(this.adjacencyMatrix);
    },
    updateMatrix(matrix) {
      this.$store.dispatch('updateAdjacencyMatrix', matrix);
    },
//     convertExpression(expression) {
//     expression = expression.replace(/(\d|\))(\()/g, '$1*$2');
//     return expression;
//     },
//     ExpMult(exp1,exp2){
//       if(exp1===0 || exp1==='0' || exp2 ===0 || exp2 ==='0') return 0;
//       if(exp1===1 || exp1==='' || exp1==="(1)") return exp2;
//       if(exp2===1 || exp2==='' || exp2==="(1)") return exp1;
//       let exp = '';
//       let num = 1;
//       let expn = [exp1,exp2]
//       let negative=false;
//       let flag=false;
//       for(let i=0 ; i<2;i++)
//       {
//           let n = expn[i].length;
//           let value = expn[i];
//           for(let j=0;j<n;j++ )
//           {
//               //console.log("entered here with value:",value[j]);
//               if(value[j]==='-' && n>1 && j===0 && this.isNumber(value[j+1])){
//                   flag=true;
//                   negative=!negative;
//                   j++;
//               }
//               if (this.isNumber(value[j]) && (j===0 || flag)){
//                   //console.log("it is a number")
//                   flag = false;
//                   let number='';
//                   number=number.concat(value[j]);
//                   while(j<n-1 && this.isNumber(value[j+1]))
//                   {
//                       number=number.concat(value[j+1]);
//                       j++;
//                   }
//                   num*=parseFloat(number);
//               }
//               else{
//                   exp=exp.concat(value[j]);
//                   //console.log("it is not and expression is:",exp,"while value is:",value[j])
//               }
//           }
//       }
//       // console.log("num is",num)
//       // console.log("exp is",exp)
//       let result = '';
//       if(negative)
//           num*=-1;
//       if(num===0)
//           result=0;
//       else if(num === -1)
//           result=result.concat('-').concat(exp);
//       else if(num === 1)
//           result=result.concat(exp);
//       else
//           result=result.concat(num).concat(exp);

//       //console.log("mult is: ", path , "with gain:",result);
//       return result;
//     },
//     ExpAdd(exp1,exp2){
//       if(exp1==='' || exp1===0 || exp1==='0')
//           return exp2
//       if(exp2==='' || exp2===0 || exp2==='0')
//           return exp1
//       if(this.isNumber(exp1) && this.isNumber(exp2))
//           return parseFloat(exp1) + parseFloat(exp2);
//       if(exp2.length>0 && exp2[0]==='-')
//           return exp1+''+exp2;
//       return exp1.concat('+'.concat(exp2));
//     },
//     areNonTouching(loop1, loop2) {
//         return !loop1.some(node => loop2.includes(node));
//     },
//     isNumber (value){
//       return !isNaN(parseFloat(value)) && isFinite(value);
//     },
//     findAllSimplePaths(graph, startNode, endNode, path) {
//       const paths = [];
//       path = path.concat(startNode);

//       if (startNode === endNode) {
//           paths.push(path);
//           return paths;
//       }

//       for (let adjacencyIndex = 0; adjacencyIndex < graph[startNode].length; adjacencyIndex++) {
//           if (graph[startNode][adjacencyIndex] !== null && !path.includes(adjacencyIndex)) {
//               const newPaths = this.findAllSimplePaths(graph, adjacencyIndex, endNode, path);
//               paths.push(...newPaths);
//           }
//       }
//       return paths;
//     },
//     findLoopsFromNode(graph, startNode, visited = [], path = []) {
//       const loops = [];
//       path.push(startNode);
//       visited[startNode] = true;

//       for (let nextNode = 0; nextNode < graph[startNode].length; nextNode++) {
//           if (graph[startNode][nextNode] !== null) {
//               if (!visited[nextNode]) {
//                   const newLoops = this.findLoopsFromNode(graph, nextNode, visited.slice(), path.slice());
//                   loops.push(...newLoops);
//               } else if (path.includes(nextNode)) {
//                   loops.push(path.slice(path.indexOf(nextNode)));
//               }
//           }
//       }    
//       return loops;
//     },
//     paths_loops(graph, forward_paths, loops) {
//       let paths_loops = [];
//       let n = graph.length;
//       for (let path of forward_paths) {
//           let path_loop = [];
//           for (let loop of loops) {
//               if(this.areNonTouching(path, loop)){
//                   path_loop.push(loop);
//               }
//           } 
//           paths_loops.push(path_loop);      
//       }
//       return paths_loops;
//     },
//     calculatePathGain(graph, path) {

//       //console.log("-------------------------------------------------------");
//       let n = path.length;
//       //console.log("length of loop is:",n);
//       let exp = '';
//       let negative=false;
//       let num = 1;
//       let flag = false;
//       for (let i =0;i<n-1;i++)
//       {

//           let value = graph[path[i]][path[i+1]]+''
//           //console.log("value is",value);
//           let m = value.length;
//           //console.log("length is",m);

//           for(let j=0;j<m;j++ )
//           {
//               //console.log("entered here with value:",value[j]);
//               if(value[j]==='-' && n>1 && j===0 && this.isNumber(value[j+1])){
//                   flag=true;
//                   negative=!negative;
//                   j++;
//               }
//               if (this.isNumber(value[j]) && (j===0 || flag)){
//                   //console.log("it is a number")
//                   flag = false;
//                   let number='';
//                   number=number.concat(value[j]);
//                   while(j<m-1 && this.isNumber(value[j+1]))
//                   {
//                       number=number.concat(value[j+1]);
//                       j++;
//                   }
//                   num*=parseFloat(number);
//               }
//               else{
//                   exp=exp.concat(value[j]);
//                   //console.log("it is not and expression is:",exp,"while value is:",value[j])
//               }
//           }
//       }
//       let result = '';
//       if(negative)
//           num*=-1;
//       if(num===0)
//           result=0;
//       else if(num === -1)
//           result=result.concat('-').concat(exp);
//       else if(num === 1)
//           result=result.concat(exp);
//       else
//           result=result.concat(num).concat(exp);

//       //console.log("path is: ", path , "with gain:",result);
//       return result;
//     },
//     calculateLoopGain(graph, loop) {

//       // console.log("-------------------------------------------------------");
//       let n = loop.length;
//       // console.log("length of loop is:",n);
//       let exp = '';
//       let negative=false;
//       let num = 1;
//       let flag = false;
//       let m = 0; 
//       for (let i =0;i<n;i++)
//       {
//           let value='';
//           // console.log(loop)
//           try{
//             if(i<n-1){
//                 value = graph[loop[i]][loop[i+1]]+''
//             }else{
//                 value = graph[loop[i]][loop[0]]+''
//             }
//             // console.log("value is",value);
//             m = value.length;
//             // console.log("length is",m);
//           }catch(error){
//             console.log("Error evaluating the expression:", error.message);
//           }

//           for(let j=0;j<m;j++ )
//           {
//               // console.log("entered here with value:",value[j]);
//               if(value[j]==='-' && n>1 && j===0 && this.isNumber(value[j+1])){
//                   flag=true;
//                   negative=!negative;
//                   j++;
//               }
//               if (this.isNumber(value[j]) && (j===0 || flag)){
//                   // console.log("it is a number")
//                   flag = false;
//                   let number='';
//                   number=number.concat(value[j]);
//                   while(j<m-1 && this.isNumber(value[j+1]))
//                   {
//                       number=number.concat(value[j+1]);
//                       j++;
//                   }
//                   num*=parseFloat(number);
//               }
//               else{
//                   exp=exp.concat(value[j]);
//                   // console.log("it is not and expression is:",exp,"while value is:",value[j])
//               }
//           }
//       }
//       let result = '';
//       if(negative)
//           num*=-1;
//       if(num===0)
//           result=0;
//       else if(num === -1)
//           result=result.concat('-').concat(exp);
//       else if(num === 1)
//           result=result.concat(exp);
//       else
//           result=result.concat(num).concat(exp);

//           // exp.split("").sort().join("")
//       //console.log("loop is: ", loop , "with gain:",result);
//       return result;
//     },
//     calculateDelta(graph,loops) {
//       let allNonTouchingLoops = this.findNonTouchingLoopsSets(loops);
//       let delta = 1;
//       let sign = -1;

//       // Iterate over each group of non-touching loops (grouped by size: 1, 2, 3, ...)
//       for (let size in allNonTouchingLoops) {
//           console.log('...................................................', size)
//           let currentGroup = allNonTouchingLoops[size];
//           let sum = '';

//           // Calculate the sum of products of loop gains for the current group
//           for (let set of currentGroup) {
//               let product = '';
//               for (let loop of set) {
//                   product = this.ExpMult(product,this.calculateLoopGain(graph,loop)); // Assuming calculateLoopGain computes the gain of a single loop
//               }
//               try {
//                 sum = this.ExpAdd(sum,product);
//               } catch (error) {
//                 console.log(error.message)
//               }
              
//           }
//           if(sum !== ''){
//               sum = '('+ sum+')';
//               // Add or subtract this sum from delta depending on the size of the group
//               if(sign===-1)
//                   sum = '-'+sum;
//               try {
//                 delta= this.ExpAdd(delta,sum);
//               } catch (error) {
//                 console.log(error.message)
//               }
//           }
//           sign *= -1; // Alternate the sign for each group
//       }

//       return '('+delta+')';
//     },
//     findNonTouchingLoopsSets(loops) {
//       let nonTouchingLoops = [];
//       // Initialize nonTouchingLoops with individual loops
//       nonTouchingLoops[0] = loops.map(loop => [loop.sort((a, b) => a - b)]); // index 0 for size 1

//       // Find all sets of non-touching loops
//       for (let size = 2; size <= loops.length; size++) {
//           nonTouchingLoops[size - 1] = []; // Adjust index by -1
//           let uniqueSets = []; // Use a list to track unique sets based on a serialized key

//           // Compare each set of the previous size with every other loop
//           for (let previousSet of nonTouchingLoops[size - 2]) { // Adjust index by -1
//               for (let loop of loops) {
//                   if (previousSet.every(existingLoop => this.areNonTouching(existingLoop, loop))) {
//                       let newSet = previousSet.concat([loop.sort((a, b) => a - b)]);
//                       newSet.sort((a, b) => a[0] - b[0]); // Sort the new set by the first element of each loop

//                       // Serialize the set to a string for comparison
//                       let key = newSet.map(loop => loop.join(',')).join(';');
//                       if (!uniqueSets.includes(key)) {
//                           uniqueSets.push(key);
//                           nonTouchingLoops[size - 1].push(newSet); // Adjust index by -1
//                       }
//                   }
//               }
//           }
//       }

//       return nonTouchingLoops;
//     },
//     getKeyByValue(object, value) {
//       for (let prop in object) {
//           if (object.hasOwnProperty(prop)) {
//               if (object[prop] === value)
//                   return prop;
//           }
//       }
//     },
//     removeDublicates(arr){
//       return arr.map(JSON.stringify).reverse() // convert to JSON string the array content, then reverse it (to check from end to begining)
//                 .filter(function(item, index, arr){ return arr.indexOf(item, index + 1) === -1; }) // check if there is any occurence of the item in whole array
//                 .reverse().map(JSON.parse);
//     },
//     calculateTransferFunction(isNumbers) {
//       let path = [];
//       let simplePaths = this.findAllSimplePaths(this.adjacencyMatrix, this.nodes[this.startNode], this.nodes[this.endNode], path);
//       let loops = this.findLoopsFromNode(this.adjacencyMatrix, 0)
//       // console.log(simplePaths);
      
//       // console.log(loops);
//       console.log( this.paths_loops(this.adjacencyMatrix,simplePaths,loops));

//       let realLoops = []

//       for(let loop of loops)
//       {
//           var tempGain = this.calculateLoopGain(this.adjacencyMatrix,loop)
//           console.log("loop is",loop,"it's gain", tempGain);
//           if (tempGain != 0){
//             this.loops[this.loops.length] = loop
//             realLoops[realLoops.length] = loop
//             this.loopsGain.push(tempGain)
//             var size1 = loop.length;
//             for (let j=0; j < size1; j++){
//               var size2 = this.loops.length-1
//               console.log(this.nodes,  this.loops[size2][j])
//               this.loops[size2][j] = this.getKeyByValue(this.nodes, this.loops[size2][j])
//             }
//           }
//       }
//       this.loops = this.removeDublicates(this.loops)
//       console.log('>>>>>>>>>>>>>>>>>>>>>>>>',this.loops)

//       console.log(loops)
//       let loops_paths = this.paths_loops(this.adjacencyMatrix,simplePaths,loops);
//       console.log("paths loops are",loops_paths);
      
//       let numer = ''
//       for(let i=0;i<simplePaths.length;i++){
//           var tempGain = this.calculatePathGain(this.adjacencyMatrix,simplePaths[i])
//           if (tempGain != 0){
//             this.simplePaths[this.simplePaths.length] = simplePaths[i];
//             this.simplePathsGain.push(tempGain)
//             var size1 = simplePaths[i].length;
//             for (let j=0; j < size1; j++){
//               var size2 = this.simplePaths.length-1
//               console.log(this.nodes,  this.simplePaths[size2][j])
//               this.simplePaths[size2][j] = this.getKeyByValue(this.nodes, this.simplePaths[size2][j])
//               //console.log(this.simplePaths[j])
//             }
            
//           }
//           let delta = this.calculateDelta(this.adjacencyMatrix,loops_paths[i])
//           console.log("path is",simplePaths[i],"it's gain",tempGain, "its loop",loops_paths[i], "its gain",delta);
//           console.log("the final term will be",tempGain,delta)
//           try {
//             numer=this.ExpAdd(numer,this.ExpMult(tempGain,delta))
//           } catch (error) {
//             console.log(error.message)
//           }
          
          
//       }
//       this.simplePaths = this.removeDublicates(this.simplePaths)

//       let real_paths_loops = this.paths_loops(this.adjacencyMatrix,this.simplePaths,this.loops)
//       this.Δm = []
//       for (let j=0; j<this.simplePaths.length; j++){
//         var delta = this.calculateDelta(this.adjacencyMatrix,real_paths_loops[j])
//         this.Δm.push(delta)
//       }

      
//       this.nonTouchingLoops = this.findNonTouchingLoopsSets(realLoops) 
//       this.nonTouchingLoops.shift()
//       for (let l=0; l< this.nonTouchingLoops.length; l++)
//         this.nonTouchingLoops[l] = this.removeDublicates(this.nonTouchingLoops[l])

//       for (let i=this.nonTouchingLoops.length-1; i>=0; i--){
//         if (this.nonTouchingLoops[i].length == 0)
//          this.nonTouchingLoops.pop()
//       }
      
//       let numer_number;
//       let denom_number;
//       console.log("final term numerator",numer);
//       if(isNumbers){
//           try {
//               numer_number = eval(this.convertExpression(numer));
//               console.log("Result of the expression:", numer_number);
//           } catch (error) {
//               console.log("Error evaluating the expression:", error.message);
//           }
//       }
//       let denom = this.calculateDelta(this.adjacencyMatrix,realLoops);

//       console.log("-------------------------------------");
//       console.log("final term denominator",denom);
//       if(isNumbers){
//           try {
//               denom_number = eval(this.convertExpression(denom));
//               console.log("Result of the expression:", denom_number);
//           } catch (error) {
//               console.log("Error evaluating the expression:", error.message);
//           }
//           console.log("Final value is",numer_number/denom_number)
//           this.finalValue = numer_number/denom_number
//       } 
//       this.Δ = denom_number
//     }
  }
}
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
}

.node-input-section,
.edge-input-section,
.t-f-input-section {
  margin-bottom: 10px;
}

.input-section{
  margin-bottom: 10px;
  background-color: #cccccc90;
  border-radius: 20px;
  padding: 10px;
}

.label {
  font-weight: bold;
  margin-right: 10px;
  color: black;
  font-size: 18px;
}

.node-input,
.weight-input {
  padding: 5px;
  margin-right: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.custom-button {
  background-color: #4CAF50;
  border: none;
  border-radius: 20px;
  color: white;
  padding: 15px 30px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  transition: 0.3s;
}

.custom-button:hover {
  background-color: #45a049;
}

.graph svg {
  background-color: #ff0000; /* Set the background color of the SVG */
}

.graph{
  margin-bottom: 10px;
  border-radius: 20px ;
  border:solid 1px black;
  padding: 5px;
}

.output-section{
  background-color: #83c8f390;
  border-radius: 20px;
  padding: 10px;
}
</style>
