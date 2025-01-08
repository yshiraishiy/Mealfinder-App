const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

// APIから取得し食事を検索
function searchMeal(e) {
  e.preventDefault();

  // 単一の食事をクリア
  single_mealEl.innerHTML = "";

  // 検索したワードを取得
  const term = search.value;

  // 空文字をチェック
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search result for '${term}':</h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML =
            "<p>There are no search results. Try again!<p>";
        } else {
          mealsEl.innerHTML = data.meals
            .map((meal) => {
              return `
              <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
            `;
            })
            .join("");
        }
      });
    // 検索した文字をクリア
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}

// IDで食事の情報を取得
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// ランダムに食事を取得
function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// 食事情報をDOMに追加
function addMealToDom(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients
            .map((ing) => {
              return `<li>${ing}</li>`;
            })
            .join("")}
        </ul>
      </div>
    </div>
  `;
}

// イベントリスナー
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", getRandomMeal);

mealsEl.addEventListener("click", (e) => {
  const path = e.composedPath();
  const mealInfo = path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
