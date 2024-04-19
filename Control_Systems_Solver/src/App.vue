<script setup>
import SignalFlowGraph from './components/SignalFlowGraph.vue'
import RouthCriterion from './components/RouthCriterion.vue'
</script>

<template>
  <main>
    <div class="switch">
      <button @click="switchChange">{{ switchText }}</button>
    </div>
    <SignalFlowGraph v-if="isSwitchOn"/>
    <RouthCriterion v-else/>
    
  </main>
</template>

<script>
export default {
  data() {
    return {
        isSwitchOn: true,
        switchText: 'Routh Stability Criterion'
    }
  },
  methods : {
    switchChange(){
      this.isSwitchOn = !this.isSwitchOn
      if (this.isSwitchOn)  this.switchText = 'Routh Stability Criterion'
      else this.switchText = 'Signal Flow Graph'
    }
  }
}
</script>
<style>
body {
  background-color: rgb(255, 255, 255);
  background-size: 100% 100%;
  background-position: center; 
  background-repeat: no-repeat;
}
main {
  /* width: 100vw; */
  margin: 0% 0% 0% 0% !important;
  padding: 0% 0% 0% 0% !important;

}

.switch{
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
}
.switch button{
  width: 100%;
  height: 50px;
  border-radius: 20px;
  outline: none;
  border: transparent;
  cursor: pointer;
  background-color: rgb(201, 225, 225);
  font-size: medium;
}

.switch button:hover{
  background-color: antiquewhite;
  font-size: larger
}
</style>