const countriesListContainer = document.getElementById("countries-list");
const apiUrl =
  "https://restcountries.com/v3.1/all?fields=name,flags,car,population,capital";
let countriesData;

async function fetchAndSortCountries() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    let data = await response.json();
    data.sort((a, b) => {
      const nameA = a.name.common.toUpperCase();
      const nameB = b.name.common.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    countriesData = data;
    renderCountries(countriesData);
  } catch (error) {
    console.error("Error al cargar los datos de los países:", error);
    countriesListContainer.innerHTML =
      '<p class="error-message">Error al cargar los datos. Por favor, inténtelo de nuevo más tarde.</p>';
  }
}

function renderCountries(countries) {
  countriesListContainer.innerHTML = "";

  countries.forEach((country) => {
    const countryDiv = document.createElement("div");
    countryDiv.classList.add("country-card");

    const flagImg = document.createElement("img");
    flagImg.src = country.flags.svg;
    flagImg.alt = `Bandera de ${country.name.common}`;
    flagImg.classList.add("flag");

    const countryName = document.createElement("p");
    countryName.textContent = country.name.common;

    flagImg.addEventListener("click", () => {
      showCountryDetails(country);
    });

    countryDiv.appendChild(flagImg);
    countryDiv.appendChild(countryName);
    countriesListContainer.appendChild(countryDiv);
  });
}

function showCountryDetails(country) {
  const existingModal = document.querySelector(".modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const flagImg = document.createElement("img");
  flagImg.src = country.flags.svg;
  flagImg.alt = `Bandera de ${country.name.common}`;
  flagImg.classList.add("detail-flag");

  const countryTitle = document.createElement("h2");
  countryTitle.textContent = country.name.common;

  const formattedPopulation = country.population;

  const capital = country.capital;
  const side = country.car.side;

  const details = document.createElement("div");
  details.classList.add("country-details");
  details.innerHTML = `
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Población:</strong> ${formattedPopulation}</p>
        <p><strong>Lado de circulación:</strong> ${side}</p>
    `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "Cerrar";
  closeButton.classList.add("close-btn");
  closeButton.addEventListener("click", () => {
    modalOverlay.remove();
  });

  modalContent.appendChild(closeButton);
  modalContent.appendChild(countryTitle);
  modalContent.appendChild(flagImg);
  modalContent.appendChild(details);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

fetchAndSortCountries();
