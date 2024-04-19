<template>
    <button @click="handleButtonClick">Click me</button>
</template>

<script>
import * as logic from '../shared/part2/logic.js'
export default {
    methods: {
        handleButtonClick() {
            // Call your desired function here
            // Example: this.myFunction();
            let res=logic.solve("s^3+3s^2+2s+1");
            console.log("response is",res);
        }
    }
}
</script>