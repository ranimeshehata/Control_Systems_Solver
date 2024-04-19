<template>
    <div class="routh">
        <div class="input">
            <label class="equation">Enter the characteristic equation</label>
            <input type="text" v-model="equation" placeholder="Write the equation in the form: s^3+3s^2+2s+1" class="equation_input">
            <button @click="handleButtonClick">Solve</button>
        </div>
        <div class="output">
            <label class="res">Result: </label>
            <p v-if="result !== null" class="type">{{ result }}</p>
            <p v-if="unstablePoles.length > 0" class="poles">Unstable poles: {{ unstablePoles }}</p>
            <p v-if="unstablePoles.length > 0" class="poles">Number of unstable poles: {{ unstablePoles.length }}</p>
        </div>
    </div>
</template>



<script>
export default {
    data() {
        return {
            equation: '',
            result: null,
            unstablePoles: []
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
                const { result, unstablePoles } = this.solve(this.equation);
                console.log("Result:", result);
                console.log("Unstable poles:", unstablePoles);
                this.result = result;
                this.unstablePoles = unstablePoles;
            } catch (error) {
                alert("Error: " + error.message);
            }
        },
        solve(equation) {
            // Extract coefficients from the equation
            const coefficients = this.extractCoefficients(equation);

            // Check stability using Routh-Hurwitz criterion
            const { stable, unstablePoles } = this.checkStability(coefficients);

            // Return the result
            if (stable) {
                return { result: "System is stable", unstablePoles: [] };
            } else {
                return { result: "System is unstable", unstablePoles };
            }
        },
        extractCoefficients(equation) {
            // Extract coefficients from the equation
            // Assuming the equation is in the format: a_n*s^n + a_{n-1}*s^{n-1} + ... + a_1*s + a_0
            const regex = /(-?\d+(\.\d+)?|\.\d+|\+|\-)/g;
            const matches = equation.match(regex);
            const coefficients = [];

            for (let i = 0; i < matches.length; i++) {
                if (matches[i] === '+' || matches[i] === '-') {
                    continue;
                }
                coefficients.push(parseFloat(matches[i]));
            }

            return coefficients;
        },
        checkStability(coefficients) {
            // Check stability using Routh-Hurwitz criterion
            const n = coefficients.length - 1;
            const rhTable = [];

            // Initialize Routh-Hurwitz table
            for (let i = 0; i <= n; i++) {
                rhTable.push([]);
            }

            // Fill in the first two rows of the table
            for (let i = 0; i <= n; i += 2) {
                rhTable[0].push(coefficients[i]);
            }

            for (let i = 1; i <= n; i += 2) {
                rhTable[1].push(coefficients[i]);
            }

            // Fill in the rest of the table
            for (let i = 2; i <= n; i++) {
                for (let j = 0; j < n - i + 1; j++) {
                    const a = rhTable[i - 2][0];
                    const b = rhTable[i - 1][j];
                    const c = rhTable[i - 1][j + 1];
                    rhTable[i].push((b * rhTable[i - 2][0] - a * rhTable[i - 1][j + 1]) / b);
                }
            }

            // Count number of sign changes in the first column
            let signChanges = 0;
            for (let i = 0; i < n; i++) {
                if (rhTable[i][0] * rhTable[i + 1][0] < 0) {
                    signChanges++;
                }
            }

            // If there are no sign changes, all poles are stable
            if (signChanges === 0) {
                return { stable: true, unstablePoles: [] };
            }

            // If there are sign changes, find the number and values of unstable poles
            const unstablePoles = [];
            for (let i = 0; i < n; i++) {
                if (rhTable[i][0] * rhTable[i + 1][0] < 0) {
                    unstablePoles.push(rhTable[i + 1][0]);
                }
            }

            return { stable: false, unstablePoles };
        }
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
</style>
