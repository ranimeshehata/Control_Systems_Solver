// export function solve(equation) {
//     // Split the equation into its individual terms
//     const terms = equation.split(/([+\-])/).filter(term => term.trim() !== "");

//     // Extract coefficients
//     const coefficients = [];
//     for (let i = 0; i < terms.length; i++) {
//         const term = terms[i].trim();
//         if (term.includes("s")) {
//             if (term === "s") {
//                 coefficients.push(1);
//             } else if (term === "-s") {
//                 coefficients.push(-1);
//             } else {
//                 const coeff = parseInt(term.substring(0, term.indexOf("s")));
//                 coefficients.push(coeff);
//             }
//         }
//     }

//     // Check Routh-Hurwitz criterion for stability
//     const signs = coefficients.map(coeff => Math.sign(coeff));
//     let changes = 0;
//     for (let i = 1; i < signs.length; i++) {
//         if (signs[i] === 0) {
//             // Check the next non-zero coefficient's sign
//             let nextSign = signs.slice(i).find(sign => sign !== 0);
//             if (!nextSign) break; // If all remaining coefficients are zero, exit loop
//             if (nextSign === signs[i - 1]) changes++;
//         } else if (signs[i] !== signs[i - 1]) {
//             changes++;
//         }
//     }

//     // Determine stability based on the number of sign changes
//     if (changes === 0) {
//         return { result: "Stable system", unstablePoles: [] };
//     } else {
//         const routhArray = calculateRouthArray(coefficients);
//         const unstablePoles = calculateUnstablePoles(routhArray);
//         console.log("Unstable poles:", unstablePoles);
//         return { result: "Unstable system", unstablePoles };
//     }
// }

// function calculateRouthArray(coefficients) {
//     // Initialize Routh array with zeros
//     const n = coefficients.length;
//     const routhArray = [];
//     for (let i = 0; i < Math.ceil(n / 2); i++) {
//         routhArray.push(new Array(n).fill(0));
//     }

//     // Fill in the Routh array with coefficients
//     for (let i = 0; i < n; i++) {
//         routhArray[i % 2][Math.floor(i / 2)] = isNaN(coefficients[i]) ? 0 : coefficients[i];
//     }

//     console.log("Routh Array:", routhArray);
//     return routhArray;
// }

// function calculateUnstablePoles(routhArray) {
//     console.log("Routh Array:", routhArray);
    
//     // Count the number of sign changes in the first column of the Routh array
//     let signChanges = 0;
//     for (let i = 0; i < routhArray.length - 1; i++) {
//         if ((routhArray[i][0] * routhArray[i + 1][0]) < 0) {
//             signChanges++;
//         }
//     }

//     console.log("Sign changes:", signChanges);

//     // If there are sign changes, determine the corresponding values of s for unstable poles
//     if (signChanges > 0) {
//         const unstablePoles = [];
//         for (let i = 0; i < routhArray.length - 1; i++) {
//             if ((routhArray[i][0] * routhArray[i + 1][0]) < 0) {
//                 const sValue = calculateSValue(i, routhArray);
//                 unstablePoles.push(sValue);
//             }
//         }
//         console.log("Unstable poles:", unstablePoles);
//         return unstablePoles;
//     } else {
//         return [];
//     }
// }


// function calculateSValue(rowIndex, routhArray) {
//     const determinant1 = routhArray[rowIndex][0];
//     const determinant2 = routhArray[rowIndex + 1][0];

//     // Ensure that the determinant2 is not 0 to avoid division by zero
//     if (determinant2 === 0) {
//         return "undefined";
//     }

//     const sValue = determinant1 / (determinant1 - determinant2);
//     return sValue;
// }

const api = 'http://localhost:3000/api';
export async function solve(chsFunction) {
    console.log("sending",chsFunction);
    const response = await fetch(`${api}/solve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chsFunction }),
    });
    console.log(response);
    if (response.ok) {
        return response.json(); 
    } else {
        throw new Error('Failed to fetch file');
    }
}