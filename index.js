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
        alert("All cells must be filled correctly!");
    } else {
        let polyProduct = polynomialMultiplier(poly1Array, poly2Array);
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

const polynomialMultiplier = (poly1, poly2) => {
    let p = [];
    const lenOfP = parseInt(poly1.length + poly2.length - 1);
    k = 0;

    do {
        let sumOfProducts = 0;
        for (let i = 0; i < poly1.length; i++) {
            for (let j = 0; j < poly2.length; j++) {
                if (i + j === k) {
                    sumOfProducts += poly1[i] * poly2[j];
                    break;
                }
            }
        }
        p.push(sumOfProducts);
        k++;
    } while (k < lenOfP);
    return p;
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
