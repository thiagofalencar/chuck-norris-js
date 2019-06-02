// LocalStorage Object
function NorrisStorage() {
    function ORM(key) {
        this.get = () => JSON.parse(localStorage.getItem(key));
        this.set = (data) => localStorage.setItem(key, JSON.stringify(data));
        this.all = () => this.get(key) || [];
        this.one = (filterValue) => this.all(key).filter(({id}) => id === filterValue).shift() || {};
        this.add = (data, single = true) => {
            const items = this.all();
            if (items.length > 0 && single && !isEmpty(this.one(data.id))) {
                throw new SingleElementException('Object already added to storage');
            } else {
                items.push(data);
                this.set(items);
                return true;
            }
        };
        this.clear = () => localStorage.removeItem(key);
        this.del = (data) => {
            const items = this.all();
            const item = this.one(data.id);

            if (items.length > 0 && !isEmpty(item)) {
                this.set(items.filter((value) => value.id !== item.id));
            }
        }
    }

    this.random = new ORM('randomJokes');
    this.favorites = new ORM('favoriteJokes');
}
