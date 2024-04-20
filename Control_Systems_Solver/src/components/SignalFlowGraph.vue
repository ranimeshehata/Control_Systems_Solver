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
        <input type="number" v-if="weightTypeToggeller" v-model.number="edgeWeight" placeholder="Edge weight (numeric)" class="weight-input">
        <input type="text" v-if="!weightTypeToggeller" v-model="edgeVar" placeholder="Edge weight (non-numeric)" class="weight-input">
        <button @click="switchWeightType" class="custom-button">{{weightType}}</button>
        <button @click="addEdge" class="custom-button">Add</button>
      </div>
      <div class="t-f-input-section">
        <label class="label">Transfer Function:</label>
        <input type="text" v-model.number="startNode" placeholder="Starting Node" class="node-input">
        <input type="text" v-model.number="endNode" placeholder="Ending Node" class="node-input">
        <button @click="calculateTransferFunction(this.weightTypeToggeller)" class="custom-button">Calculate</button>
      </div>
    </div>
    <div>
      <div ref="graph" class="graph"></div>
    </div>
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
      edgeVar: '',
      weightType: 'Non-numeric',
      weightTypeToggeller: true,
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
    switchWeightType(){
      if (this.weightTypeToggeller){
        this.weightTypeToggeller = !this.weightTypeToggeller
        this.weightType = 'Numeric'
      }
      else{
        this.weightTypeToggeller = !this.weightTypeToggeller
        this.weightType = 'Non-numeric'
      }
    },
    renderGraph() {
      const viz = new Viz({ Module, render });
      viz.renderSVGElement(this.digraph)
        .then(element => {
          this.$refs.graph.innerHTML = '';
          this.$refs.graph.appendChild(element);
        })
        .catch(error => {
          console.error('Error rendering graph:', error)
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
      if (this.weightTypeToggeller)
        this.realtions += `\n${edge}[label="${this.edgeWeight}"];`;
      else 
        this.realtions += `\n${edge}[label="${this.edgeVar}"];`;
      this.updateGraph();
      this.sourceNode = '';
      this.targetNode = '';
      this.edgeWeight = 1;
      this.edgeVar = '';
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
      console.log('nodes go here', nodes);
      // create an adjacency matrix
      this.adjacencyMatrix = Array.from(nodes).map(source => {
        return Array.from(nodes).map(target => {
          const edge = `${source} -> ${target}`;
          const match = this.realtions.match(new RegExp(`${edge}\\[label="(.+)"\\];`));
          if (this.weightTypeToggeller)
            return match ? parseInt(match[1]) : null;
          else 
            return match ? match[1] : null;
        });
      });
      console.log(this.adjacencyMatrix);
      this.updateMatrix(this.adjacencyMatrix);
    },
    updateMatrix(matrix) {
      this.$store.dispatch('updateAdjacencyMatrix', matrix);
    },
    getKeyByValue(object, value) {
      for (let prop in object) {
          if (object.hasOwnProperty(prop)) {
              if (object[prop] === value)
                  return prop;
          }
      }
    },
    removeDublicates(arr){
      return arr.map(JSON.stringify).reverse() // convert to JSON string the array content, then reverse it (to check from end to begining)
                .filter(function(item, index, arr){ return arr.indexOf(item, index + 1) === -1; }) // check if there is any occurence of the item in whole array
                .reverse().map(JSON.parse);
    },
    adjacencyMatrixToGraph(){
      for (let i=0; i<this.adjacencyMatrix.length; i++){
        for (let j=0; j<this.adjacencyMatrix[i].length; j++){
          if (this.adjacencyMatrix[i][j] === 0) 
            this.adjacencyMatrix[i][j] = null;
        }
      }
    },
    calculateTransferFunction(isNumbers) {
      //this.adjacencyMatrixToGraph();

      let startNode=this.nodes[this.startNode];
      let endNode=this.nodes[this.endNode];

      console.log("STARTING AND ENDING NODE",startNode,endNode)
      console.log('adjacencyMatrix= ',this.adjacencyMatrix)

      let simplePaths = logic.findAllSimplePaths(this.adjacencyMatrix, startNode, endNode);
      
      let loops = logic.findLoopsFromNode(this.adjacencyMatrix, startNode);
      let paths_loops = logic.paths_loops(this.adjacencyMatrix,simplePaths,loops);
      console.log("simple paths are",simplePaths);
      console.log("loops are",loops);
      console.log("paths loops are",paths_loops);
      
      //ADJASTING LOOPS TO BE PRINTED
      for(let i=0; i<loops.length; i++)
      {
          var tempGain = logic.calculateLoopGain(this.adjacencyMatrix,loops[i])
          console.log("loop is",loops[i],"it's gain", tempGain);
          this.loops[i] = []
          this.loopsGain.push(tempGain)
          for (let j=0; j < loops[i].length; j++){
            console.log(this.nodes,  loops[i][j])
            this.loops[i][j] = this.getKeyByValue(this.nodes, loops[i][j])
          }
      }

      console.log(loops)
      let loops_paths = logic.paths_loops(this.adjacencyMatrix,simplePaths,loops);
      console.log("paths loops are",loops_paths);
      
      let numer = ''
      
      //ADJASTIG SIMPLE PATHS TO BE PRINTED
      for(let i=0;i<simplePaths.length;i++){
          let tempGain = logic.calculatePathGain(this.adjacencyMatrix,simplePaths[i])
            this.simplePathsGain.push(tempGain)
            this.simplePaths[i] = []
            for (let j=0; j < simplePaths[i].length; j++){
              console.log(this.nodes,  simplePaths[i][j])
              this.simplePaths[i][j] = this.getKeyByValue(this.nodes, simplePaths[i][j])
            }
            
          let delta = logic.calculateDelta(this.adjacencyMatrix,loops_paths[i])
          console.log("path is",simplePaths[i],"it's gain",tempGain, "its loop",loops_paths[i], "its gain",delta);
          console.log("the final term will be",tempGain,delta)
          try {
            numer=logic.ExpAdd(numer,logic.ExpMult(tempGain,delta))
          } catch (error) {
            console.log(error.message)
          }
          
          
      }
      

      let real_paths_loops = logic.paths_loops(this.adjacencyMatrix, simplePaths, loops)
      this.Δm = []
      for (let j=0; j<this.simplePaths.length; j++){
        var delta = logic.calculateDelta(this.adjacencyMatrix,real_paths_loops[j])
        this.Δm.push(delta)
      }

      
      let nonTouchingLoops = logic.findNonTouchingLoopsSets(loops) 
      nonTouchingLoops.shift()
      
      //ADJUSTING NONTOUCHING LOOPS TO BE PRINTED
      
      for (let i=0; i<nonTouchingLoops.length; i++){
        if (nonTouchingLoops[i].length == 0){
          nonTouchingLoops.pop()
          break;
        }
        this.nonTouchingLoops[i] = []
        for (let j=0; j<nonTouchingLoops[i].length; j++){
          this.nonTouchingLoops[i][j] = []
          for (let k=0; k<nonTouchingLoops[i][j].length; k++){
            this.nonTouchingLoops[i][j][k] = []
            for (let l=0; l<nonTouchingLoops[i][j][k].length; l++){
              this.nonTouchingLoops[i][j][k][l] = this.getKeyByValue(this.nodes, nonTouchingLoops[i][j][k][l])
            }
          }
        }
      }

      let numer_number;
      let denom_number;
      console.log("final term numerator",numer);
      if(isNumbers){
          try {
              numer_number = eval(logic.convertExpression(numer));
              console.log("Result of the expression:", numer_number);
          } catch (error) {
              console.log("Error evaluating the expression:", error.message);
          }
      }
      let denom = logic.calculateDelta(this.adjacencyMatrix,loops);

      console.log("-------------------------------------");
      console.log("final term denominator",denom);
      if(isNumbers){
          try {
              denom_number = eval(logic.convertExpression(denom));
              console.log("Result of the expression:", denom_number);
          } catch (error) {
              console.log("Error evaluating the expression:", error.message);
          }
          console.log("Final value is",numer_number/denom_number)
          this.finalValue = numer_number/denom_number
          this.Δ = denom_number
      } 
      else {
        this.finalValue = '('+ numer +')/(' + denom + ')'
        this.Δ =  denom
      }
    }
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
