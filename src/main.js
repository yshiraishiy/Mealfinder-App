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
        console.log(data);
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

// イベントリスナー
submit.addEventListener("submit", searchMeal);
