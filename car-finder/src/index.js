// import scss
import './styles/index.scss';
import * as data from './car-dataset.json';

const cars = [...data.default];

// build lookup once for more efficient code - aka "giant filing cabinet"
const carLookup = new Map();

// assigning keys for year and make/manufacturer
cars.forEach(({ year, Manufacturer, model }) => {
  const yearKey = year;
  const makeKey = Manufacturer.toLowerCase();

  // does carLookup have that year? no = create new Map object/"bucket" for that year - aka "drawer" in "giant filing cabinet"
  if (!carLookup.has(yearKey)) {
    carLookup.set(yearKey, new Map());
  }

  // create "folder" in each year "drawer" to hold makes/manufacturers
  const makesMap = carLookup.get(yearKey);
  if (!makesMap.has(makeKey)) {
    makesMap.set(makeKey, new Set());
  }
  // add models per make - each model is a "paper" in "folder" within the year "drawer" in the carLookup "filing cabinet"
  makesMap.get(makeKey).add(model);
});

// years sorted descending
const years = [...carLookup.keys()].sort((a, b) => b - a);

// lookup for make
const getManufacturers = (year) =>
  // chaining ? as a safety so that app doesn't crash if something returns undefined
  [...carLookup.get(year)?.keys() || []].sort();

// lookup for model
const getModel = (year, manufacturer) =>
  [...(carLookup.get(year)?.get(manufacturer.toLowerCase()) || [])].sort();

// getting and returning final selection data via filter method
const getFinalSelection = (data, year, make, model) => {
  return data.filter(
    car =>
      car.year === year &&
      car.Manufacturer.toLowerCase() === make.toLowerCase() &&
      car.model === model
  );
};

// dropdown logic
const getCars = (data) => {
  const yearDropdown = document.getElementById('year');
  const makeDropdown = document.getElementById('make');
  const modelDropdown = document.getElementById('model');

  years.forEach(year => {
    yearDropdown.innerHTML += `<option value="${year}">${year}</option>`;
  });

  yearDropdown.addEventListener('change', () => {
    const selectedYear = parseInt(yearDropdown.value);
    const makes = getManufacturers(selectedYear);
    makeDropdown.innerHTML = `<option disabled selected>Select Make</option>`;
    makes.forEach(make => {
      makeDropdown.innerHTML += `<option value="${make}">${make}</option>`;
    });
    makeDropdown.disabled = false;
    document.querySelector(".make").classList.add("active");
    modelDropdown.disabled = true;
    modelDropdown.innerHTML = `<option disabled selected>Select Model</option>`;
  });

  makeDropdown.addEventListener('change', () => {
    const selectedYear = parseInt(yearDropdown.value);
    const selectedMake = makeDropdown.value;
    const models = getModel(selectedYear, selectedMake);
    modelDropdown.innerHTML = `<option disabled selected>Select Model</option>`;
    models.forEach(model => {
      modelDropdown.innerHTML += `<option value="${model}">${model}</option>`;
    });
    modelDropdown.disabled = false;
    document.querySelector(".model").classList.add("active");
  });

  modelDropdown.addEventListener('change', () => {
    const selectedYear = parseInt(yearDropdown.value);
    const selectedMake = makeDropdown.value;
    const selectedModel = modelDropdown.value;
    const results = getFinalSelection(data, selectedYear, selectedMake, selectedModel);

    console.log(
      results.length > 0
        ? "Here are the cars that match your search: "
        : "No cars found with the selected criteria.",
      results
    );
  });
};

getCars(cars);
