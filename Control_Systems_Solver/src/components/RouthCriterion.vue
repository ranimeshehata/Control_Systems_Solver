<template>
    <div class="routh">
        <div class="input">
            <label class="equation">Enter the characteristic equation</label>
            <input type="text" v-model="equation" placeholder="Write the equation in the form: s^3+3s^2+2s+1" class="equation_input">
            <button @click="handleButtonClick">Solve</button>
        </div>
        <div class="output" v-if="result">
      <label class="res">Result: </label>
      <p class="type">{{ result }}</p>
      <p class="poles" v-if="degree !== 0">Degree of the polynomial: {{ degree }}</p>
      <p class="poles" v-if="coeff.length !== 0">Coefficients: {{ coeff }}</p>
      <p class="poles" v-if="table.length !== 0">Routh-Hurwitz Table:</p>

      <table v-if="table.length !== 0" border="1" class="routh-table">
        <tr v-for="(row, index) in table" :key="index">
          <td v-for="(cell, i) in row" :key="i" class="routh-table-cell">{{ cell }}</td>
        </tr>
      </table>

      <p class="poles" v-if="signChange !== 0">Number of sign changes in the first column: {{ signChange }}</p>
      <p class="poles" v-if="negativePoles.length > 0">Stable poles: {{ negativePoles }}</p>
      <p class="poles" v-if="!isStable">Number of unstable poles: {{ postivePoles.length }}</p>
      <p class="poles" v-if="!isStable">Unstable poles: {{ postivePoles }}</p>
      <p class="poles" v-if="isStable">All poles are stable</p>
    </div>
  </div>
</template>



<script>
import * as logic from '../shared/part2/logic.js'
export default {
    data() {
        return {
            equation: '',
            result: null,
            postivePoles: [],
            negativePoles: [],
            signChange: 0,
            isStable: true,
            degree: 0,
            coeff: [],
            table: []
        }
    },
    methods: {
        handleButtonClick() {
            if (!this.equation) {
                alert("Please enter a valid equation.");
                return;
            }

            // Call the solve function and handle errors
            try {

                this.solve(this.equation);
                console.log("Solving the equation");

                // console.log("Unstable poles:", unstablePoles);
                // this.result = result;
                // this.unstablePoles = unstablePoles;
            } catch (error) {
                alert("Error: " + error.message);
            }
        },
        async solve(equation) {
            // // Extract coefficients from the equation
            // const coefficients = this.extractCoefficients(equation);

            // // Check stability using Routh-Hurwitz criterion
            // const { stable, unstablePoles } = this.checkStability(coefficients);
            const  {degree,coeff,table,postivePoles,negativePoles,signChange,isStable} = await logic.solve(this.equation);
                // let output = {
                //     degree: c.length-1,
                //     coeff: c,
                //     table:routhFinalTable(routhInitalTable(c),c.length-1),
                //     postivePoles: [],
                //     negativePoles: [],
                //     signChange : 0, // number of change in sign in first column 
                //     isStable: true
                // }
                console.log("Result is:");
                console.log("degree",degree);
                console.log("coeff",coeff);
                console.log("table",table);
                console.log("posPoles",postivePoles);
                console.log("negPoles",negativePoles);
                console.log("Number of sign change",signChange);
                console.log("is Stable",isStable);
                this.degree = degree;
                this.coeff = coeff;
                this.table = table;
                this.postivePoles = postivePoles;
                this.negativePoles = negativePoles;
                this.signChange = signChange;
                this.isStable = isStable;
            // // Return the result
            // Return the result
            if (isStable) {
                this.result= "System is stable"
            } else {
                this.result="System is unstable"
            }
        },
        // extractCoefficients(equation) {
        //     // Extract coefficients from the equation
        //     // Assuming the equation is in the format: a_n*s^n + a_{n-1}*s^{n-1} + ... + a_1*s + a_0
        //     const regex = /(-?\d+(\.\d+)?|\.\d+|\+|\-)/g;
        //     const matches = equation.match(regex);
        //     const coefficients = [];

        //     for (let i = 0; i < matches.length; i++) {
        //         if (matches[i] === '+' || matches[i] === '-') {
        //             continue;
        //         }
        //         coefficients.push(parseFloat(matches[i]));
        //     }

        //     return coefficients;
        // },
//         checkStability(coefficients) {
//             // Check stability using Routh-Hurwitz criterion
//             const n = coefficients.length - 1;
//             const rhTable = [];

//             // Initialize Routh-Hurwitz table
//             for (let i = 0; i <= n; i++) {
//                 rhTable.push([]);
//             }

//             // Fill in the first two rows of the table
//             for (let i = 0; i <= n; i += 2) {
//                 rhTable[0].push(coefficients[i]);
//             }

//             for (let i = 1; i <= n; i += 2) {
//                 rhTable[1].push(coefficients[i]);
//             }

//             // Fill in the rest of the table
//             for (let i = 2; i <= n; i++) {
//                 for (let j = 0; j < n - i + 1; j++) {
//                     const a = rhTable[i - 2][0];
//                     const b = rhTable[i - 1][j];
//                     const c = rhTable[i - 1][j + 1];
//                     rhTable[i].push((b * rhTable[i - 2][0] - a * rhTable[i - 1][j + 1]) / b);
//                 }
//             }

//             // Count number of sign changes in the first column
//             let signChanges = 0;
//             for (let i = 0; i < n; i++) {
//                 if (rhTable[i][0] * rhTable[i + 1][0] < 0) {
//                     signChanges++;
//                 }
//             }

//             // If there are no sign changes, all poles are stable
//             if (signChanges === 0) {
//                 return { stable: true, unstablePoles: [] };
//             }

//             // If there are sign changes, find the number and values of unstable poles
//             const unstablePoles = [];
//             for (let i = 0; i < n; i++) {
//                 if (rhTable[i][0] * rhTable[i + 1][0] < 0) {
//                     // Round the unstable pole to 3 decimal points
//             const roundedPole = parseFloat(rhTable[i + 1][0].toFixed(3));
//             unstablePoles.push(roundedPole);
//                 }
//             }

//             return { stable: false, unstablePoles };
//         }
    }
}
</script>



<style scoped>
    .routh {
        display: flex;
        flex-direction: column;
    }
    .input {
        margin-bottom: 10px;
        background-color: #cccccc90;
        border-radius: 20px;
        padding: 10px;
    }
    .equation {
        font-weight: bold;
        margin-right: 10px;
        color: black;
        font-size: 35px
    }
    .equation_input {
        width: 30%;
        padding: 12px 20px;
        margin: 8px 5px;
        border: 1px solid #ccc;
        border-radius: 3px;
        font-size: 17px;
    }
    button {
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
    button:hover {
       background-color: #45a049;
    }
    .output {
        background-color: #83c8f390;
        border-radius: 20px;
        padding: 10px;
    }
    .res {
        font-weight: bold;
        margin-right: 10px;
        color: black;
        font-size: 35px;
    }
    .type, .poles{
        font-size: 20px;
        font-weight: bold;
    }
    .routh-table {
  /* Table layout and borders */
  border-collapse: separate; /* Remove default cell borders */
  /* border: 1px solid #149c4d; Add a thin border around the entire table */
  width: auto; /* Allow table to adapt to content width */
  /* margin: 10px auto; Add some margin for better presentation */

  /* Cell formatting */
  font-family: sans-serif; /* Use a clean sans-serif font */
  font-size: 25px; /* Set a readable font size */
  /* text-align: center; Center text content in cells */
  padding: 8px 16px; /* Add some padding for better spacing */

}
/* Header row (optional) */
.routh-table-header {
  background-color: #d7083f; /* Light gray background for headers */
  font-weight: bold; /* Bold font weight for headers */
}

.routh-table-cell {
  /* Additional cell styles for highlighting or differentiation (optional) */
  /* border: 1px solid #000000; Optional cell borders */
    background-color: #ffffff; /* Optional cell background color */
    /* Add some padding for better spacing */
    padding: 8px 16px;
    /* Center text content in cells */
    text-align: center;

    
}
</style>
