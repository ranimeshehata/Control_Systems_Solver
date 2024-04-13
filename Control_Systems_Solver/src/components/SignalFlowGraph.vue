<template>
  <div class="container">
    <!-- Input sections for adding nodes and edges -->
    <div class="input-section">
      <label class="label">Add Node:</label>
      <input type="text" v-model="newNode" placeholder="Node name" class="node-input">
      <button @click="addNode" class="custom-button">Add</button>
    </div>
    <div class="input-section">
      <label class="label">Add Edge:</label>
      <input type="text" v-model="sourceNode" placeholder="Source node" class="node-input">
      <input type="text" v-model="targetNode" placeholder="Target node" class="node-input">
      <input type="number" v-model.number="edgeWeight" placeholder="Edge weight" class="weight-input">
      <button @click="addEdge" class="custom-button">Add</button>
    </div>
    <div class="input-section">
      <button @click="calculateTransferFunction" class="custom-button">Calculate Transfer Function</button>
    </div>
    <div ref="graph" class="graph"></div>
  </div>
</template>

<script>
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
    calculateTransferFunction() {
      //todo

    },
  }
}
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.input-section {
  margin-bottom: 10px;
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

</style>
