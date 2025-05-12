// import scss
import './styles/index.scss';

// get car data
import * as data from './car-dataset.json';

// make JSON into usable array 
const cars = [...data.default];

// grab year - only one of each type
const years = [...new Set(cars.map(car => car.year))].sort((a, b) => b - a);

// grab "make"/"manufacturer" - only one of each type, based on selected year
const getManufacturers = (year) => {
  return [...new Set(cars.filter(car => car.year === year).map(car => car.Manufacturer.toLowerCase()))].sort();
}

// grab model - only one of each type, based on selected year and manufacturer
const getModel = (year, manufacturer) => {
  return [...new Set(
    cars
      .filter(car => car.year === year && car.Manufacturer.toLowerCase() === manufacturer.toLowerCase())
      .map(car => car.model)
  )].sort();
}

// function to get all final selections - to be used later
const getFinalSelection = (data, year, make, model) => {
  return data.filter(
    car =>
      car.year === year &&
      car.Manufacturer.toLowerCase() === make.toLowerCase() &&
      car.model === model
  );
}

// function to set up everything and run later
const getCars = (data) => {
  // grab html elements
  const yearDropdown = document.getElementById('year');
  const makeDropdown = document.getElementById('make');
  const modelDropdown = document.getElementById('model');

  // fill year dropdown
  years.forEach(year => {
    yearDropdown.innerHTML += `<option value="${year}">${year}</option>`;
  });

  // listen for change and populate make dropdown
  yearDropdown.addEventListener('change', () => {
    const selectedYear = parseInt(yearDropdown.value);
    const makes = getManufacturers(selectedYear);
    makeDropdown.innerHTML = `<option disabled selected>Select Make</option>`;
    makes.forEach(make => {
      makeDropdown.innerHTML += `<option value="${make}">${make}</option>`;
    });
    makeDropdown.disabled = false;
    const makeActive = document.querySelector(".make");
    makeActive.classList.add("active");
    modelDropdown.disabled = true;
    modelDropdown.innerHTML = `<option disabled selected>Select Model</option>`;
  });

  // listen for change and populate model dropdown
  makeDropdown.addEventListener('change', () => {
    const selectedYear = parseInt(yearDropdown.value);
    const selectedMake = makeDropdown.value;
    const models = getModel(selectedYear, selectedMake);
    modelDropdown.innerHTML = `<option disabled selected>Select Model</option>`;
    models.forEach(model => {
      modelDropdown.innerHTML += `<option value="${model}">${model}</option>`;
    });
    modelDropdown.disabled = false;
    const modelActive = document.querySelector(".model");
    modelActive.classList.add("active");
  });

  // listen for change and populate console
  modelDropdown.addEventListener('change', () => {
    const selectedYear = parseInt(yearDropdown.value);
    const selectedMake = makeDropdown.value;
    const selectedModel = modelDropdown.value;
    const results = getFinalSelection(data, selectedYear, selectedMake, selectedModel);

    if (results.length > 0) {
      console.log("Here are the cars that match your search 🚗", results);
    } else {
      console.log("No cars found with the selected criteria.");
    }
  });

}

// run function to get cars and return results
getCars(cars);
