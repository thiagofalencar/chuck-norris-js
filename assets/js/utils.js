// Utils functions
const isEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object;
const createElem = tag => document.createElement(tag);
const getById = id => document.getElementById(id);

// Exceptions Objects
function AppGenericError(name, message) {
    const error = new Error(message);
    error.name = name;
    error.message = message;
    return error;
}

function SingleElementException(message) {
    return new AppGenericError('Single Element Exception', message);
}

function ApiRequestException(message) {
    return new AppGenericError('API Request Exception', message);
}

// API Object
function NorrisApi() {
    const { random, favorites } = new NorrisStorage();

    this.setRandomJokes = (callback, callbackError) => {
        setTimeout(() => {
            fetch('http://api.icndb.com/jokes/random/10?escape=javascript')
                .then((response) => response.json())
                .then(({type, value}) => {
                    random.set(value);
                    callback(value);
                })
                .catch((exception) => {
                    callbackError(ApiRequestException(exception.message));
                });
        }, 2000);
    };
    this.getRandomJokes = (callback, callbackError) => {
        const randomJokes = random.get();
        callback(randomJokes|| this.setRandomJokes(callback, callbackError));
    };
    this.getFavoritesJokes = (callback) => {
        callback(favorites.all());
    };
    this.addToFavorites = (data) => {                                
        return favorites.add(data, true);
    };
    this.removeFromFavorites = (data) => {                                
        return favorites.del(data);
    };
    this.wasThisSavedAsFavorite = ({id}) => {
        return !isEmpty(favorites.one(id));
    };
    this.resetRandomJokes = () => {
        random.clear();
    };
}

// Modal Object
function Modal({type, message}) {
    const modal = getById('modal');
    this.setMessage = (message) => {
        modal.querySelector('.message').innerHTML = message;
    };
    this.setType = (type) => {
        this.type = type;
        modal.classList.add(type);
    };
    this.close = () => {
        modal.classList.remove(this.type);
        this.setMessage('');
    };
    this.show = () => {
        this.setType(type);
        this.setMessage(message);
    };
    modal.addEventListener('click', this.close);
    modal.querySelector('button').addEventListener('click', this.close);
}
