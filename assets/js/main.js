// DOM Manipulations Objects
function NorrisMain() {
    const
        api = new NorrisApi(),
        randomJokesList = getById("random-jokes"),
        favoritesJokesList = getById("favorites-jokes"),
        favoriteTab = getById('tab-favorites'),
        randomTab = getById('tab-random'),
        resetRandomJokesBtn = getById('reset-random-jokes');

    const jokeElem = ({joke}) => {
        return `
            <img alt="Norris" class="norris" src='assets/images/norris.png'/>
            <h2>"${joke}"</h2>
        `;
    };

    const resetRandomJokes = () => {
        api.resetRandomJokes();
        renderRandomJokes();
        randomTab.click();
    }
    
    const renderRandomJokes = (animation = true) => {

        if (animation) randomJokesList.classList.add('loading');
        
        randomJokesList.classList.remove('error');
        api.getRandomJokes(
            (value) => {
                randomJokesList.classList.remove('no-jokes')
                if ((value || []).length > 0) {
                    randomJokesList.innerHTML = '';
                    value.forEach((value) => {
                        const li = createElem('li');
                        li.innerHTML = jokeElem(value);
                        li.appendChild(addFavoriteButton(value))
                        randomJokesList.appendChild(li);
                    });
                    setTimeout(() => randomJokesList.classList.remove('loading'), 500);
                } else {
                    randomJokesList.classList.add('no-jokes');
                }
            },
            (exception) => {
                console.error(exception);
                const modal = new Modal({
                    'type': 'error',
                    'message': `Could not load the list of jokes.<br />Please check your internet connection and try again in few moments.`
                });
                modal.show();
                randomJokesList.classList.remove('loading');
            }
            );
    }

    const addFavoriteButton = (data) => {
        const div = createElem('div');
        const favorite = api.wasThisSavedAsFavorite(data);

        div.setAttribute('class', 'add-to-favorite');
        div.setAttribute('title',  (favorite) ? 'Kick out of favorites' : 'Add to favorites');
        div.addEventListener('click', () => {
            if (favorite) {
                api.removeFromFavorites(data);
            } else {
                api.addToFavorites(data);
            }
            renderRandomJokes(false);
        });
        div.innerHTML = `
            <span class="${(favorite) ? 'favorite' : ''}">
                <img alt="Add to favorites" class="icon-favorite ${(favorite) ? 'remove' : 'star'}" src="assets/images/${(favorite) ? 'remove' : 'favorite'}.png" />
            </span>
            <img  alt="Add to favorites" class="icon-favorite ${(favorite) ? '' : 'star'}" src="assets/images/${(favorite) ? 'checked' : 'favorite'}.png" />
        `;
        return div;
    }

    const removeFromFavoriteButton = (data) => {
        const div = createElem('div');
        div.setAttribute('class', 'add-to-favorite');
        div.addEventListener('click', () => {
            api.removeFromFavorites(data);
            renderFavoritesJokes(false);
            renderRandomJokes(false);
        });
        div.innerHTML = `
            <span title="Kick out this guy!" class="favorite">
                <img  alt="Remove from favorites" class="icon-favorite remove" src="assets/images/remove.png" />
            </span>
            <img  alt="Remove from favorites" class="icon-favorite" src="assets/images/remove.png" />
        `;
        return div;
    }
    
    const renderFavoritesJokes = (animation = true) => {
        if (animation) favoritesJokesList.classList.add('loading');
        api.getFavoritesJokes((value) => {
            if (value.length === 0) {
                favoritesJokesList.classList.add('no-favorites');
            }
            favoritesJokesList.innerHTML = '';
            value.forEach((joke) => {
                favoritesJokesList.classList.remove('no-favorites') 
                const li = createElem('li');
                li.innerHTML = jokeElem(joke);
                li.appendChild(removeFromFavoriteButton(joke))
                favoritesJokesList.appendChild(li);
            });
            setTimeout(() => favoritesJokesList.classList.remove('loading'), 500);
        });
    }
    
    this.init = () => {
        favoriteTab.addEventListener('click', renderFavoritesJokes);
        resetRandomJokesBtn.addEventListener('click', resetRandomJokes);
        renderRandomJokes()
    };
}
