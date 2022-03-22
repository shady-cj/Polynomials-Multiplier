const numOfP1 = document.querySelector("#p1");
const numOfP2 = document.querySelector("#p2");
const poly1Table = document.querySelector("#poly1Layout");
const poly2Table = document.querySelector("#poly2Layout");
const computeBtn = document.querySelector("#compute");
const resultBtn = document.querySelector("#result");
const resultDiv = document.querySelector(".result-div");
const resultRenderer = document.querySelector("#result-renderer");
const layoutWrap = document.querySelector(".layout-wrapper");

computeBtn.addEventListener("click", (e) => {
    if (numOfP1.value.trim() == "" || numOfP2.value.trim() == "") {
        return;
    }

    if (!isNaN(numOfP1.value) && !isNaN(numOfP2.value)) {
        let numVal1 = Math.abs(Math.floor(Number(numOfP1.value)));
        let numVal2 = Math.abs(Math.floor(Number(numOfP2.value)));
        polyLayout(numVal1, poly1Table, "First Polynomial");
        polyLayout(numVal2, poly2Table, "Second Polynomial");
        resultDiv.style.display = "block";
        layoutWrap.style.display = "block";
    } else {
        alert("There has to be a valid number for both polynomials");
    }
});

resultBtn.addEventListener("click", (e) => {
    let firstPolyInputs = document.querySelectorAll(".f-poly-value");
    let secondPolyInputs = document.querySelectorAll(".s-poly-value");
    let poly1Array = convertCellsToArray(firstPolyInputs);
    let poly2Array = convertCellsToArray(secondPolyInputs);
    if (!poly1Array || !poly2Array) {
        alert("All cells must be filled");
    } else {
        let polyProduct = multiply_optimized(poly1Array, poly2Array);
        let input1 = formatOutput(poly1Array);
        let input2 = formatOutput(poly2Array);
        let result = formatOutput(polyProduct);
        console.log(polyProduct);
        resultRenderer.innerHTML = `(${input1}) x (${input2}) = ${result}`;
    }
});

const polyLayout = (num, polyTable, text) => {
    let tableHTML = ``;
    let thead = `${tableDataMaker("<thead><tr>", num, "head")}</tr></thead>`;
    let tbody = `${tableDataMaker("<tbody><tr>", num, text)}</tr></tbody>`;
    tableHTML += thead + tbody;
    polyTable.innerHTML = tableHTML;
};

const tableDataMaker = (elem, num, type) => {
    let data = elem;

    for (let i = 0; i <= parseInt(num); i++) {
        if (type === "head") {
            let th = `<th>${i}</th>`;

            data += th;
        } else {
            let td = `<td> <input class=${
                type === "First Polynomial" ? "f-poly-value" : "s-poly-value"
            } type="text"/></td>`;

            data += td;
        }
    }

    return data;
};

const convertCellsToArray = (dataElem) => {
    let dataArr = [];
    let empty = false;
    dataElem.forEach((elem) => {
        if (!isNaN(elem.value) && elem.value.trim() !== "") {
            dataArr.push(Number(elem.value));
        } else {
            empty = true;
        }
    });
    if (empty) {
        return;
    }
    return dataArr;
};

// Using O(N^2)

// const polynomialMultiplier = (poly1, poly2) => {
//     let p = [];
//     const lenOfP = parseInt(poly1.length + poly2.length - 1);
//     k = 0;

//     do {
//         let sumOfProducts = 0;
//         for (let i = 0; i < poly1.length; i++) {
//             for (let j = 0; j < poly2.length; j++) {
//                 if (i + j === k) {
//                     sumOfProducts += poly1[i] * poly2[j];
//                     break;
//                 }
//             }
//         }
//         p.push(sumOfProducts);
//         k++;
//     } while (k < lenOfP);

//     return p;
// };

// Using ~0(N Log N)
const multiply_optimized = (poly1, poly2, first = true) => {
    let numOfPoly1 = poly1.length;
    let numOfPoly2 = poly2.length;

    result = [];
    if (numOfPoly1 > 1 || numOfPoly2 > 1) {
        let n, k, A0B0, A1B1, productOfSumAB, differenceOfProductAB;
        // n to find the maximum of the 2 polynomials to determine the length of the longest list
        n = Math.max(numOfPoly1, numOfPoly2);
        // getting the half
        k = Math.floor(n / 2);

        //  We split the array into 2 halves
        let [A, B] = split(poly1, poly2);
        //  destructuring A0, A1,B0, B1
        let [A0, A1] = A;
        let [B0, B1] = B;

        //  We find the value of A0B0 and A1B1 recursively
        A0B0 = multiply_optimized(A0, B0, false);
        A1B1 = multiply_optimized(A1, B1, false);
        // we find the product of (A0+A1)*(B0+B1)
        productOfSumAB = multiply_optimized(add(A0, A1), add(B0, B1), false);
        // subract from A0B0 and A1B1 to get ((A0+A1)*(B0+B1) - A0B0 - A1B1)
        differenceOfProductAB = subtract(subtract(productOfSumAB, A0B0), A1B1);
        result = add(
            add(A0B0, increase_exponent(differenceOfProductAB, k)),
            increase_exponent(A1B1, 2 * k)
        );
        //  remove all 0s
        if (first) {
            lenDiff = Math.abs(numOfPoly1 - numOfPoly2) - 1;

            if (lenDiff > 0) result = result.slice(0, -lenDiff);
        }
    } else if (numOfPoly1 == 1 && numOfPoly2 == 1) {
        result.push(poly1[0] * poly2[0]);
    } else {
        result = [];
    }
    return result;
};

const add = (poly1, poly2) => {
    // Add two polynomials
    let lengthOfArr = Math.max(poly1.length, poly2.length);
    let result = new Array(lengthOfArr).fill(0);

    for (let i = 0; i < result.length; i++) {
        if (i < poly1.length) {
            result[i] += poly1[i];
        }
        if (i < poly2.length) {
            result[i] += poly2[i];
        }
    }
    return result;
};

const subtract = (poly1, poly2) => {
    // subtract two polynomials
    let lengthOfArr = Math.max(poly1.length, poly2.length);
    let result = new Array(lengthOfArr).fill(0);

    for (let i = 0; i < result.length; i++) {
        if (i < poly1.length) {
            result[i] += poly1[i];
        }
        if (i < poly2.length) {
            result[i] -= poly2[i];
        }
    }
    return result;
};

const split = (poly1, poly2) => {
    let mid = Math.floor(Math.max(poly1.length, poly2.length) / 2);

    return [
        [poly1.slice(0, mid), poly1.slice(mid)],
        [poly2.slice(0, mid), poly2.slice(mid)],
    ];
};
const increase_exponent = (poly, n) => {
    //    Multiply poly1 by x^n
    let arr = new Array(n).fill(0);
    return arr.concat(poly);
};

const formatOutput = (arr) => {
    let textStr = "";

    arr.forEach((data, index) => {
        textStr += `${formattedData(data, index)}`;
    });
    return textStr.slice(0, -2);
};

const formattedData = (data, ind) => {
    if (data === 0) {
        return "";
    } else if (ind === 0) {
        return `${data} + `;
    } else if (ind === 1) {
        return `${data}𝑥 + `;
    } else {
        return `${data}𝑥<sup>${ind}</sup> + `;
    }
};
