async function getData() {
	const url = './travel_recommendation_api.json';
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		return json;
	} catch (error) {
		console.error(error.message);
	}
}

function searchInArray(array) {
	const searchInput = document.getElementById('searchInput');
	const inputValue = searchInput.value.toLowerCase();

	return array.flatMap((item) => {
		let matchedItem = null;

		if (item.name && item.name.toLowerCase().includes(inputValue)) {
			matchedItem = { ...item };
		}

		if (
			item.description &&
			item.description.toLowerCase().includes(inputValue)
		) {
			matchedItem = { ...item };
		}

		if (item.cities && Array.isArray(item.cities)) {
			const matchingCities = item.cities.filter(
				(city) =>
					(city.name && city.name.toLowerCase().includes(inputValue)) ||
					(city.description &&
						city.description.toLowerCase().includes(inputValue))
			);

			if (matchingCities.length > 0) {
				matchedItem = { ...item, cities: matchingCities };
			}
		}

		return matchedItem ? [matchedItem] : [];
	});
}
async function search() {
	const inputValue = document.getElementById('searchInput').value.toLowerCase();
	const data = await getData();
	const resultsDiv = document.getElementById('results');
	const resultsWrapper = document.getElementById('results-wrapper');
	resultsDiv.innerHTML = '';

	const noResults = document.getElementById('no-results');
	noResults.style.display = 'none';

	const categoryMap = {
		countries: ['country', 'countries'],
		temples: ['temple', 'temples'],
		beaches: ['beach', 'beaches'],
	};

	let matchedCategory = null;
	Object.keys(categoryMap).forEach((category) => {
		if (categoryMap[category].includes(inputValue)) {
			matchedCategory = category;
		}
	});
	if (matchedCategory) {
		const matches = data[matchedCategory];
		resultsDiv.style.display = 'block';
		resultsWrapper.style.opacity = '0.6';

		if (matches.imageUrl) {
			if (matches.length > 0) {
				matches.forEach((match) => {
					resultsDiv.innerHTML += `
                        <div style="margin-bottom: 10px; background-color: white">
                            <img src="${match.imageUrl}" alt="${match.name}" style="width:300px;height:auto;">
                            <div style="padding: 10px">
                                <h3>${match.name}</h3>
                                <p style="width:100%">${match.description}</p>
                            </div>
                        </div>
                        <br />
                        `;
				});
			} else {
				noResults.style.display = 'block';
			}
		} else {
			if (matches.length > 0) {
				const random = Math.floor(Math.random() * 2);
				if (matches[random].cities) {
					matches[random].cities.forEach((match) => {
						console.log(match, '2');
						resultsDiv.innerHTML += `
                            <div style="margin-bottom: 10px; background-color: white">
                                <img src="${match.imageUrl}" alt="${match.name}" style="width:300px;height:200px;">
                                <div style="padding: 10px">
                                    <h3>${match.name}</h3>
                                    <p style="width:100%">${match.description}</p>
                                </div>
                            </div>
                            <br />
                            `;
					});
				} else {
					matches.forEach((match) => {
						resultsDiv.innerHTML += `
                            <div style="margin-bottom: 10px; background-color: white">
                                <img src="${match.imageUrl}" alt="${match.name}" style="width:300px;height:auto;">
                                <div style="padding: 10px">
                                    <h3>${match.name}</h3>
                                    <p style="width:100%">${match.description}</p>
                                </div>
                            </div>
                            <br />
                            `;
					});
				}
			} else {
				noResults.style.display = 'block';
			}
		}
	} else {
		let anyMatchesFound = false;
		resultsDiv.style.display = 'block';
		resultsWrapper.style.opacity = '0.6';
		Object.keys(categoryMap).forEach((category) => {
			const matches = searchInArray(data[category]);
			if (matches.length > 0) {
				anyMatchesFound = true;

				matches.forEach((match) => {
					resultsDiv.innerHTML += `
                        <div style="margin-bottom: 10px; background-color: white">
                            <img src="${match.imageUrl}" alt="${match.name}" style="width:300px;height:auto;">
                            <div style="padding: 10px">
                                <h3>${match.name}</h3>
                                <p style="width:100%">${match.description}</p>
                            </div>
                        </div>
                        <br />
                        `;
				});
			}
		});

		if (!anyMatchesFound) {
			resultsDiv.style.display = 'block';
			resultsWrapper.style.opacity = '0.6';
			noResults.style.display = 'block';
		}
	}
}

function resetSearch() {
	const resultsDiv = document.getElementById('results');
	resultsDiv.innerHTML = '';
	const inputValue = document.getElementById('searchInput');
	inputValue.value = '';
	noResults.style.display = 'none';
	resultsWrapper.style.opacity = '0.6';
}
