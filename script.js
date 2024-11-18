// script.js

// data ophalen
let data = null;

fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error. status: ${response.status}`);
        }
        return response.json();
    })
    .then(jsonData => {
        data = jsonData;
        loadYears();
        loadWeeks();
        filterData();
    })
    .catch(error => {
        console.error('Er is een fout opgetreden bij het ophalen van de JSON:', error);
    });



// Functie om de jaaropties te laden
function loadYears() {
    const yearSelect = document.getElementById("jaar");
    const years = Object.keys(data.weekblad);
    years.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

// Functie om de weekopties te laden
function loadWeeks() {
    const weekSelect = document.getElementById("week");
    weekSelect.innerHTML = "<option value='Alle'>Alle</option>";  // Reset de weken

    // Voeg de weken 1 t/m 52 toe
    for (let week = 1; week <= 52; week++) {
        const option = document.createElement("option");
        option.value = week;
        option.textContent = `Week ${week}`;
        weekSelect.appendChild(option);
    }
}

// Functie om de tabel te filteren en weer te geven
function filterData() {
    const jaar = document.getElementById("jaar").value;
    const week = document.getElementById("week").value;
    const locatie = document.getElementById("locatie").value.toLowerCase();
    const beschadigd = document.getElementById("beschadigd").value;

    const tableBody = document.getElementById("donaldDuckTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Leeg de tabel

    let filteredData = [];

    // Filter de data
    for (const year in data.weekblad) {
        // Filter op jaar als het niet "Alle" is
        if (jaar !== "Alle" && year !== jaar) continue;

        for (const w in data.weekblad[year]) {
            // Filter op week als het niet "Alle" is
            if (week !== "Alle" && w !== week) continue;

            data.weekblad[year][w].forEach(item => {
                const [isDamaged, location, remarks, serialNr] = item;

                if (beschadigd !== "Alle" && (beschadigd === "Ja" ? !isDamaged : isDamaged)) {
                    return;
                }


                if (locatie && !location.toLowerCase().includes(locatie)) {
                    return;
                }

                filteredData.push([year, w, isDamaged ? "Ja" : "Nee", location, remarks, serialNr]);
            });
        }
    }

    filteredData.sort((a, b) => b[0] - a[0] || b[1] - a[1]);

    // Vul de tabel met de gefilterde gegevens
    filteredData.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    // Update de teller
    const resultCount = document.getElementById("resultCount");
    resultCount.textContent = `Aantal resultaten: ${filteredData.length}`;
}





// Add a smooth scroll to top feature
document.addEventListener('DOMContentLoaded', () => {
    const toTopButton = document.createElement('button');
    toTopButton.textContent = '⬆';
    toTopButton.style.position = 'fixed';
    toTopButton.style.bottom = '20px';
    toTopButton.style.right = '20px';
    toTopButton.style.padding = '10px';
    toTopButton.style.borderRadius = '50%';
    toTopButton.style.background = 'linear-gradient(to right, #6a11cb, #2575fc)';
    toTopButton.style.color = '#fff';
    toTopButton.style.border = 'none';
    toTopButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    toTopButton.style.cursor = 'pointer';
    toTopButton.style.display = 'none';

    document.body.appendChild(toTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            toTopButton.style.display = 'block';
        } else {
            toTopButton.style.display = 'none';
        }
    });

    toTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
